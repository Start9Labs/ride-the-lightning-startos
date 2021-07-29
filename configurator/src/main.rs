use std::{convert::TryInto, fs::File};
use std::io::Write;
use std::net::IpAddr;
use std::path::{Path, PathBuf};

use http::Uri;
use linear_map::LinearMap;
use serde::{
    de::{Deserializer, Error as DeserializeError, Unexpected},
    Deserialize,
};
use serde_json::Value;

fn deserialize_parse<'de, D: Deserializer<'de>, T: std::str::FromStr>(
    deserializer: D,
) -> Result<T, D::Error> {
    let s: String = Deserialize::deserialize(deserializer)?;
    s.parse()
        .map_err(|_| DeserializeError::invalid_value(Unexpected::Str(&s), &"a valid URI"))
}

#[derive(Deserialize)]
#[serde(rename_all = "kebab-case")]
struct Config {
    nodes: Vec<NodeConfig>,
    password: String,
}
#[derive(Debug, Clone)]
#[derive(serde::Deserialize)]
#[serde(tag = "type")]
#[serde(rename_all = "kebab-case")]
pub struct NodeConfig {
    #[serde(rename = "type")]
    typ: NodeType,
    name: String,
    connection_settings: NodeConnectionSettings,
}

#[derive(Debug, Clone)]
#[derive(serde::Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum NodeType {
    Lnd,
    CLightning,
}

#[derive(Debug, Clone)]
#[derive(serde::Deserialize)]
#[serde(tag = "type")]
#[serde(rename_all = "kebab-case")]
enum NodeConnectionSettings {
    #[serde(rename_all = "kebab-case")]
    Internal { address: IpAddr },
    #[serde(rename_all = "kebab-case")]
    External {
        #[serde(deserialize_with = "deserialize_parse")]
        address: Uri,
        rest_port: u16,
        macaroon: String,
        cert: String,
    },
}

#[derive(serde::Serialize)]
pub struct Properties {
    version: u8,
    data: Data,
}

#[derive(serde::Serialize)]
pub struct Data {
    #[serde(rename = "Password")]
    password: Property,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "kebab-case")]
#[serde(tag = "type")]
pub enum Property {
    #[serde(rename_all = "kebab-case")]
    String {
        value: String,
        description: Option<String>,
        copyable: bool,
        qr: bool,
        masked: bool,
    },
    #[serde(rename_all = "kebab-case")]
    Object {
        value: LinearMap<String, Property>,
        description: Option<String>,
    },
}

fn main() -> Result<(), anyhow::Error> {
    let s9_config: Config = serde_yaml::from_reader(File::open("/root/start9/config.yaml")?)?;
    {
        let cfg_path = Path::new("/root/RTL-Config.json");

        let mut default_node_cfg = serde_json::json!({
            // "index": 1,
            // "lnNode": "Embassy LND",
            "Authentication": {},
            "Settings": {
                "userPersona": "MERCHANT",
                "themeMode": "NIGHT",
                "themeColor": "PURPLE",
                "enableLogging": true,
                "fiatConversion": false,
            }
        });

        let mut cfg = if cfg_path.exists() {
            serde_json::from_reader(File::open(&cfg_path)?)?
        } else {
            serde_json::json!({
                "defaultNodeIndex": 1,
                "SSO": {
                    "rtlSSO": 0,
                    "rtlCookiePath": "",
                    "logoutRedirectLink": ""
                },
                "nodes": []
            })
        };

        let base_cfg = cfg
            .as_object_mut()
            .ok_or_else(|| anyhow::anyhow!("RTL-Config is not an object"))?;
        base_cfg.remove("multiPassHashed".into());
        base_cfg.insert("multiPass".into(), s9_config.password.as_str().into());
        base_cfg.insert("port".into(), 80.into());
        base_cfg.insert("host".into(), "0.0.0.0".into());

        let mut node_index = 0;
        let mut rtl_nodes: Vec<Value> = Vec::new();
        println!("{:?} nodes found", s9_config.nodes.len());
        for s9_node_config in s9_config.nodes {
            node_index += 1;
            let (host, rest_port, macaroon_path) = match s9_node_config.clone().typ {
                NodeType::Lnd => {
                    match s9_node_config.clone().connection_settings {
                        NodeConnectionSettings::Internal { address } => {
                            (format!("{}", address), 8080, PathBuf::from("/root/start9/public/lnd"))
                        }
                        NodeConnectionSettings::External {
                            address,
                            rest_port,
                            macaroon,
                            cert: _,
                        } => {
                            let macaroon_dir_path = PathBuf::from(format!("/root/lnd-external-{}", node_index));
                            std::fs::create_dir_all(macaroon_dir_path.as_path())?;
                            let macaroon_path = macaroon_dir_path.join("admin.macaroon");
                            File::create(macaroon_path)?.write_all(
                                &base64::decode_config(
                                    macaroon,
                                    base64::Config::new(base64::CharacterSet::UrlSafe, false),
                                )?,
                            )?;
            
                            (
                                format!("{}", address.host().unwrap()),
                                rest_port,
                                macaroon_dir_path
                            )
                        }
                    }
                }
                NodeType::CLightning => {
                    match s9_node_config.clone().connection_settings {
                        NodeConnectionSettings::Internal { address } => {
                            (format!("{}", address), 3001, PathBuf::from("/root/start9/public/c-lightning"))
                        }
                        NodeConnectionSettings::External {
                            address,
                            rest_port,
                            macaroon,
                            cert: _,
                        } => {
                            let macaroon_dir_path = PathBuf::from(format!("/root/cl-external-{}", node_index));
                            std::fs::create_dir_all(macaroon_dir_path.as_path())?;
                            let macaroon_path = macaroon_dir_path.join("access.macaroon");
                            File::create(macaroon_path)?.write_all(
                                &base64::decode_config(
                                    macaroon,
                                    base64::Config::new(base64::CharacterSet::UrlSafe, false),
                                )?,
                            )?;
            
                            (
                                format!("{}", address.host().unwrap()),
                                rest_port,
                                macaroon_dir_path
                            )
                        }
                    }
                }
            };
    
            // let node_cfg = &mut serde_json::Map::new();
            // RTL config
            let node_cfg = match base_cfg.get_mut("nodes")
                .ok_or_else(|| anyhow::anyhow!("RTL-Config.nodes does not exist"))?
                .as_array_mut()
                .ok_or_else(|| anyhow::anyhow!("RTL-Config.nodes is not an array"))?
                .iter_mut()
                .filter(|n| {
                    n.as_object()
                        .and_then(|n| n.get("lnNode").map(|i| i == &serde_json::Value::from(s9_node_config.clone().name)))
                        .unwrap_or(false)
                })
                .next() 
            {
                Some(cfg) => {
                    println!("Found {:?} node with name {:?}!", s9_node_config.clone().typ, s9_node_config.clone().name);
                    cfg
                        .as_object_mut()
                        .ok_or_else(|| anyhow::anyhow!("Node found in RTL-Config is not an object"))?
                }
                None => {
                    println!("No node with type {:?} and name {:?}", s9_node_config.clone().typ, s9_node_config.clone().name);
                    default_node_cfg
                        .as_object_mut()
                        .ok_or_else(|| anyhow::anyhow!("Default node settings are invalid"))?
                }
            };
            node_cfg.insert("index".into(), node_index.into());
            node_cfg.insert("lnNode".into(), s9_node_config.clone().name.into());
            match s9_node_config.clone().typ {
                NodeType::Lnd => {
                    node_cfg.insert("lnImplementation".into(), "LND".into());
                }
                NodeType::CLightning => {
                    node_cfg.insert("lnImplementation".into(), "CLT".into());
                }
            };
            node_cfg.get_mut("Authentication")
                .ok_or_else(|| {
                    anyhow::anyhow!("Node found in RTL-Config does not have Authentication")
                })?
                .as_object_mut()
                .ok_or_else(|| {
                    anyhow::anyhow!("Node found in RTL-Config has invalid Authentication")
                })?
                .insert("macaroonPath".into(), macaroon_path.to_str().unwrap().into());
            let node_settings = node_cfg
                .get_mut("Settings")
                .ok_or_else(|| anyhow::anyhow!("Node found in RTL-Config does not have Settings"))?
                .as_object_mut()
                .ok_or_else(|| {
                    anyhow::anyhow!("Node found in RTL-Config has invalid Settings")
                })?;
            node_settings.insert("channelBackupPath".into(), format!("/root/backup/node-{}", node_index).into());
            node_settings.insert(
                "lnServerUrl".into(),
                format!("https://{}:{}", host, rest_port).into(),
            );
            rtl_nodes.push(Value::Object(node_cfg.clone()));
        }
        base_cfg.insert("nodes".into(), rtl_nodes.into());
        serde_json::to_writer_pretty(File::create("/root/RTL-Config-new.json")?, base_cfg)?;
        std::fs::rename("/root/RTL-Config-new.json", &cfg_path)?;
    }
    
    serde_yaml::to_writer(
        File::create("/root/start9/stats.yaml")?,
        &Properties {
            version: 2,
            data: Data {
                password: Property::String {
                    value: format!("{}", s9_config.password),
                    description: Some(
                        "Copy this password to login. Change this value in Config.".to_owned(),
                    ),
                    copyable: true,
                    qr: false,
                    masked: true,
                },
            },
        },
    )?;
    Ok(())
}

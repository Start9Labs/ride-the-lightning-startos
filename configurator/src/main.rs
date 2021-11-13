use std::fs::File;
use std::io::Write;
use std::net::IpAddr;
use std::path::Path;

use http::Uri;
use linear_map::LinearMap;
use serde::{
    de::{Deserializer, Error as DeserializeError, Unexpected},
    Deserialize,
};

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
    lnd: LNDConfig,
    password: String,
}

#[derive(serde::Deserialize)]
#[serde(tag = "type")]
#[serde(rename_all = "kebab-case")]
enum LNDConfig {
    #[serde(rename_all = "kebab-case")]
    Internal,
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
    let config: Config = serde_yaml::from_reader(File::open("/root/start9/config.yaml")?)?;
    {
        let cfg_path = Path::new("/root/RTL-Config.json");

        let (lnd_host, lnd_rest_port, macaroon_path) = match config.lnd {
            LNDConfig::Internal => ("lnd.embassy".to_owned(), 8080, "/mnt/lnd"),
            LNDConfig::External {
                address,
                rest_port,
                macaroon,
                cert: _,
            } => {
                std::fs::create_dir_all("/root/lnd-external")?;
                File::create("/root/lnd-external/admin.macaroon")?.write_all(
                    &base64::decode_config(
                        macaroon,
                        base64::Config::new(base64::CharacterSet::UrlSafe, false),
                    )?,
                )?;

                (
                    format!("{}", address.host().unwrap()),
                    rest_port,
                    "/root/lnd-external",
                )
            }
        };

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
                "nodes": [
                    {
                        "index": 1,
                        "lnNode": "Embassy LND",
                        "Authentication": {},
                        "Settings": {
                          "userPersona": "MERCHANT",
                          "themeMode": "NIGHT",
                          "themeColor": "PURPLE",
                          "enableLogging": true,
                          "fiatConversion": false,
                        }
                    }
                ]
            })
        };

        let base = cfg
            .as_object_mut()
            .ok_or_else(|| anyhow::anyhow!("RTL-Config is not an object"))?;
        base.remove("multiPassHashed".into());
        base.insert("multiPass".into(), config.password.as_str().into());
        base.insert("port".into(), 80.into());
        base.insert("host".into(), "0.0.0.0".into());
        let node = base
            .get_mut("nodes")
            .ok_or_else(|| anyhow::anyhow!("RTL-Config.nodes does not exist"))?
            .as_array_mut()
            .ok_or_else(|| anyhow::anyhow!("RTL-Config.nodes is not an array"))?
            .iter_mut()
            .filter(|n| {
                n.as_object()
                    .and_then(|n| n.get("index").map(|i| i == &serde_json::Value::from(1)))
                    .unwrap_or(false)
            })
            .next()
            .ok_or_else(|| {
                anyhow::anyhow!("RTL-Config.nodes does not contain a node with index 1")
            })?
            .as_object_mut()
            .ok_or_else(|| anyhow::anyhow!("RTL-Config.nodes[.index = 1] is not an object"))?;
        node.insert("lnImplementation".into(), "LND".into());
        node.get_mut("Authentication")
            .ok_or_else(|| {
                anyhow::anyhow!("RTL-Config.nodes[.index = 1].Authentication does not exist")
            })?
            .as_object_mut()
            .ok_or_else(|| {
                anyhow::anyhow!("RTL-Config.nodes[.index = 1].Authentication is not an object")
            })?
            .insert("macaroonPath".into(), macaroon_path.into());
        let settings = node
            .get_mut("Settings")
            .ok_or_else(|| anyhow::anyhow!("RTL-Config.nodes[.index = 1].Settings does not exist"))?
            .as_object_mut()
            .ok_or_else(|| {
                anyhow::anyhow!("RTL-Config.nodes[.index = 1].Settings is not an object")
            })?;
        settings.insert("channelBackupPath".into(), "/root/backup/node-1".into());
        settings.insert(
            "lnServerUrl".into(),
            format!("https://{}:{}", lnd_host, lnd_rest_port).into(),
        );

        serde_json::to_writer_pretty(File::create("/root/RTL-Config-new.json")?, base)?;
        std::fs::rename("/root/RTL-Config-new.json", &cfg_path)?;
    }
    serde_yaml::to_writer(
        File::create("/root/start9/stats.yaml")?,
        &Properties {
            version: 2,
            data: Data {
                password: Property::String {
                    value: format!("{}", config.password),
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

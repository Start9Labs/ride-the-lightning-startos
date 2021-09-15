use std::fs::File;
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
struct S9Config {
    nodes: Vec<S9NodeConfig>,
    password: String,
}
#[derive(Debug, Clone, serde::Deserialize)]
#[serde(tag = "type")]
#[serde(rename_all = "kebab-case")]
pub struct S9NodeConfig {
    #[serde(rename = "type")]
    typ: NodeType,
    name: String,
    connection_settings: S9NodeConnectionSettings,
}

#[derive(Debug, Clone, serde::Deserialize)]
#[serde(tag = "type")]
#[serde(rename_all = "kebab-case")]
enum S9NodeConnectionSettings {
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

#[derive(Debug, Clone, serde::Deserialize)]
#[serde(rename_all(deserialize = "kebab-case"))]
pub enum NodeType {
    Lnd,
    CLightning,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub enum RTLNodeType {
    LND,
    CLT,
}

impl From<NodeType> for RTLNodeType {
    fn from(nt: NodeType) -> RTLNodeType {
        match nt {
            NodeType::CLightning => RTLNodeType::CLT,
            NodeType::Lnd => RTLNodeType::LND,
        }
    }
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct RTLConfig {
    #[serde(rename = "SSO")]
    sso: SSO,
    default_node_index: usize,
    host: IpAddr,
    nodes: Vec<RTLNode>,
    port: usize,
    multi_pass: Option<String>,
    multi_pass_hashed: Option<String>,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct SSO {
    logout_redirect_link: String,
    rtl_cookie_path: String,
    rtl_s_s_o: usize,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct RTLNode {
    index: usize,
    ln_implementation: RTLNodeType,
    ln_node: String,
    #[serde(rename = "Authentication")]
    authentication: RTLNodeAuthentication,
    #[serde(rename = "Settings")]
    settings: RTLNodeSettings,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct RTLNodeAuthentication {
    macaroon_path: PathBuf,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct RTLNodeSettings {
    channel_backup_path: Option<PathBuf>,
    // log_level: RTLNodeLogLevel,
    fiat_conversion: bool,
    ln_server_url: Option<String>,
    theme_color: RTLNodeThemeColor,
    theme_mode: RTLNodeThemeMode,
    user_persona: RTLNodePersona,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
enum RTLNodeThemeColor {
    PURPLE,
    TEAL,
    INDIGO,
    PINK,
    YELLOW,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
enum RTLNodePersona {
    MERCHANT,
    OPERATOR,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
enum RTLNodeThemeMode {
    DAY,
    NIGHT,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
enum RTLNodeLogLevel {
    ERROR,
    WARN,
    INFO,
    DEBUG,
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
    let s9_config: S9Config = serde_yaml::from_reader(File::open("/root/start9/config.yaml")?)?;
    {
        let cfg_path = Path::new("/root/RTL-Config.json");
        let mut cfg_seed: RTLConfig = if cfg_path.exists() {
            serde_json::from_reader(File::open(&cfg_path)?)?
        } else {
            RTLConfig {
                default_node_index: 1,
                sso: SSO {
                    logout_redirect_link: "".into(),
                    rtl_cookie_path: "".into(),
                    rtl_s_s_o: 0,
                },
                nodes: Vec::new(),
                multi_pass: Some(s9_config.password.clone()),
                multi_pass_hashed: None,
                host: "0.0.0.0".parse().unwrap(),
                port: 80,
            }
        };

        let default_node_index = cfg_seed.default_node_index;
        let sso = cfg_seed.sso;
        let mut nodes: Vec<RTLNode> = Vec::new();
        let mut multi_pass = Some(s9_config.password.clone());
        let multi_pass_hashed = None;
        let host = "0.0.0.0".parse().unwrap();
        let port = 80;

        println!("{:?} nodes found", s9_config.nodes.len());
        let mut node_index = 0;
        for s9_node_config in s9_config.nodes {
            node_index += 1;
            let (host, rest_port, macaroon_path) = match s9_node_config.clone().typ {
                NodeType::Lnd => match s9_node_config.clone().connection_settings {
                    S9NodeConnectionSettings::Internal => (
                        format!("{}", "lnd.embassy"),
                        8080,
                        PathBuf::from("/mnt/lnd"),
                    ),
                    S9NodeConnectionSettings::External {
                        address,
                        rest_port,
                        macaroon,
                        cert: _,
                    } => {
                        let macaroon_dir_path =
                            PathBuf::from(format!("/root/lnd-external-{}", node_index));
                        std::fs::create_dir_all(macaroon_dir_path.as_path())?;
                        let macaroon_path = macaroon_dir_path.join("admin.macaroon");
                        File::create(macaroon_path)?.write_all(&base64::decode_config(
                            macaroon,
                            base64::Config::new(base64::CharacterSet::UrlSafe, false),
                        )?)?;

                        (
                            format!("{}", address.host().unwrap()),
                            rest_port,
                            macaroon_dir_path,
                        )
                    }
                },
                NodeType::CLightning => match s9_node_config.clone().connection_settings {
                    S9NodeConnectionSettings::Internal => (
                        format!("{}", "c-lightning.embassy"),
                        3001,
                        PathBuf::from("/mnt/c-lightning"),
                    ),
                    S9NodeConnectionSettings::External {
                        address,
                        rest_port,
                        macaroon,
                        cert: _,
                    } => {
                        let macaroon_dir_path =
                            PathBuf::from(format!("/root/cl-external-{}", node_index));
                        std::fs::create_dir_all(macaroon_dir_path.as_path())?;
                        let macaroon_path = macaroon_dir_path.join("access.macaroon");
                        File::create(macaroon_path)?.write_all(&base64::decode_config(
                            macaroon,
                            base64::Config::new(base64::CharacterSet::UrlSafe, false),
                        )?)?;

                        (
                            format!("{}", address.host().unwrap()),
                            rest_port,
                            macaroon_dir_path,
                        )
                    }
                },
            };

            let mut default = RTLNode {
                index: 1,
                ln_implementation: RTLNodeType::LND,
                ln_node: "Embassy LND".to_owned(),
                authentication: RTLNodeAuthentication {
                    macaroon_path: PathBuf::from(""),
                },
                settings: RTLNodeSettings {
                    user_persona: RTLNodePersona::OPERATOR,
                    theme_mode: RTLNodeThemeMode::NIGHT,
                    theme_color: RTLNodeThemeColor::PURPLE,
                    fiat_conversion: false,
                    channel_backup_path: None,
                    ln_server_url: None,
                },
            };
            let node_seed = if let Some(ns) = cfg_seed
                .nodes
                .iter_mut()
                .filter(|n| n.ln_node == s9_node_config.name)
                .next()
            {
                ns
            } else {
                &mut default
            };

            let index = node_index;
            let ln_node = s9_node_config.name;
            let ln_implementation = s9_node_config.typ.into();
            let authentication = RTLNodeAuthentication { macaroon_path };
            let mut settings = node_seed.settings.clone();
            settings.channel_backup_path = Some(format!("/root/backup/node-{}", node_index).into());
            settings.ln_server_url = Some(format!("https://{}:{}", host, rest_port).into());
            nodes.push(RTLNode {
                index,
                ln_implementation,
                ln_node,
                authentication,
                settings,
            });
        }
        let cfg = RTLConfig {
            sso,
            default_node_index,
            host,
            nodes,
            port,
            multi_pass,
            multi_pass_hashed,
        };
        serde_json::to_writer_pretty(File::create("/root/RTL-Config-new.json")?, &cfg)?;
        std::fs::rename("/root/RTL-Config-new.json", &cfg_path)?;
    }

    serde_yaml::to_writer(
        File::create("/root/start9/stats.yaml")?,
        &Properties {
            version: 2,
            data: Data {
                password: Property::String {
                    value: format!("{}", s9_config.password.clone()),
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

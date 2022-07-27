use std::collections::HashMap;
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
    nodes: Vec<S9Node>,
    password: String,
}
#[derive(Debug, Clone, serde::Deserialize)]
#[serde(tag = "type")]
#[serde(rename_all = "kebab-case")]
pub struct S9Node {
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
    secret_2fa: Option<String>,
}
impl RTLConfig {
    fn default_with_pass(pass: String) -> RTLConfig {
        RTLConfig {
            default_node_index: 1,
            sso: SSO {
                logout_redirect_link: String::new(),
                rtl_cookie_path: String::new(),
                rtl_s_s_o: 0,
            },
            nodes: Vec::new(),
            host: "0.0.0.0".parse().unwrap(),
            port: 80,
            multi_pass: Some(pass),
            multi_pass_hashed: None,
            secret_2fa: None,
        }
    }
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

fn write_macaroons_and_get_connection_details(
    s9_node: &S9Node,
    node_index: usize,
) -> Result<(String, u16, PathBuf), anyhow::Error> {
    match (&s9_node.typ, &s9_node.connection_settings) {
        (NodeType::Lnd, S9NodeConnectionSettings::Internal) => {
            Ok((String::from("lnd.embassy"), 8080, PathBuf::from("/mnt/lnd")))
        }
        (NodeType::CLightning, S9NodeConnectionSettings::Internal) => Ok((
            String::from("c-lightning.embassy"),
            3001,
            PathBuf::from("/mnt/c-lightning"),
        )),
        (
            typ,
            S9NodeConnectionSettings::External {
                address,
                rest_port,
                macaroon,
            },
        ) => {
            let (mac_path, mac_dir) = match typ {
                NodeType::Lnd => {
                    let mac_dir = PathBuf::from(format!("/root/lnd-external-{}", node_index));
                    (mac_dir.join("admin.macaroon"), mac_dir)
                }
                NodeType::CLightning => {
                    let mac_dir = PathBuf::from(format!("/root/cl-external-{}", node_index));
                    (mac_dir.join("access.macaroon"), mac_dir)
                }
            };
            std::fs::create_dir_all(mac_dir.as_path())?;
            File::create(mac_path)?.write_all(&base64::decode_config(
                macaroon,
                base64::Config::new(base64::CharacterSet::UrlSafe, false),
            )?)?;
            Ok((address.host().unwrap().to_owned(), *rest_port, mac_dir))
        }
    }
}

// annotateRtlNames :: [RTLNodes] -> HashMap<Name, RTLNode>
fn get_rtl_node_map(nodes: Vec<RTLNode>) -> HashMap<String, RTLNode> {
    let mut m = HashMap::new();
    for node in nodes {
        m.insert(node.ln_node.clone(), node);
    }
    m
}

// toRtlDefault :: S9Node -> RTLNode
fn to_rtl_default(
    s9_node: S9Node,
    node_index: usize,
    macaroon_path: PathBuf,
    address: String,
    rest_port: u16,
) -> RTLNode {
    RTLNode {
        index: node_index,
        ln_implementation: s9_node.typ.into(),
        ln_node: s9_node.name,
        authentication: RTLNodeAuthentication { macaroon_path },
        settings: RTLNodeSettings {
            user_persona: RTLNodePersona::OPERATOR,
            theme_mode: RTLNodeThemeMode::NIGHT,
            theme_color: RTLNodeThemeColor::PURPLE,
            fiat_conversion: false,
            channel_backup_path: Some(format!("/root/backup/node-{}", node_index).into()),
            ln_server_url: Some(format!("https://{}:{}", address, rest_port).into()),
        },
    }
}

fn to_rtl(
    prev_rtl_node: Option<RTLNode>,
    s9_node: S9Node,
    node_index: usize,
    macaroon_path: PathBuf,
    address: String,
    rest_port: u16,
) -> RTLNode {
    let mut def = to_rtl_default(s9_node, node_index, macaroon_path, address, rest_port);
    if let Some(prev) = prev_rtl_node {
        def.settings.user_persona = prev.settings.user_persona;
        def.settings.theme_color = prev.settings.theme_color;
        def.settings.theme_mode = prev.settings.theme_mode;
        def.settings.fiat_conversion = prev.settings.fiat_conversion;
    }
    def
}

fn write_properties(pass: String) -> Result<(), anyhow::Error> {
    Ok(serde_yaml::to_writer(
        File::create("/root/start9/stats.yaml")?,
        &Properties {
            version: 2,
            data: Data {
                password: Property::String {
                    value: pass,
                    description: Some(
                        "Copy this password to login. Change this value in Config.".to_owned(),
                    ),
                    copyable: true,
                    qr: false,
                    masked: true,
                },
            },
        },
    )?)
}

fn main() -> Result<(), anyhow::Error> {
    let s9_config: S9Config = serde_yaml::from_reader(File::open("/root/start9/config.yaml")?)?;
    let cfg_path = Path::new("/root/RTL-Config.json");
    let mut cfg: RTLConfig = if cfg_path.exists() {
        serde_json::from_reader(File::open(&cfg_path)?)?
    } else {
        RTLConfig::default_with_pass(s9_config.password.clone())
    };

    let mut rtl_node_map = get_rtl_node_map(cfg.nodes);
    let nodes = s9_config
        .nodes
        .into_iter()
        .enumerate()
        .map(|(zero_index, s9_node)| {
            let one_index = zero_index + 1;
            let (address, rest_port, macaroon_path) =
                write_macaroons_and_get_connection_details(&s9_node, one_index)?;
            Ok(to_rtl(
                rtl_node_map.remove(&s9_node.name),
                s9_node,
                one_index,
                macaroon_path,
                address,
                rest_port,
            ))
        })
        .collect::<Result<Vec<RTLNode>, anyhow::Error>>()?;

    cfg.nodes = nodes;

    serde_json::to_writer_pretty(File::create("/root/RTL-Config-new.json")?, &cfg)?;
    std::fs::rename("/root/RTL-Config-new.json", &cfg_path)?;

    write_properties(s9_config.password)?;

    Ok(())
}

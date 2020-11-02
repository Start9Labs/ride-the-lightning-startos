use std::fs::File;
use std::io::Write;
use std::net::IpAddr;

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
    user_persona: String,
    theme_mode: String,
    theme_color: String,
}

#[derive(serde::Deserialize)]
#[serde(tag = "type")]
#[serde(rename_all = "kebab-case")]
enum LNDConfig {
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
    let config: Config = serde_yaml::from_reader(File::open("/root/start9/config.yaml")?)?;
    {
        let mut outfile = File::create("/RTL/RTL-Config.json")?;

        let (lnd_host, lnd_rest_port, macaroon_path) = match config.lnd {
            LNDConfig::Internal { address } => {
                (format!("{}", address), 8080, "/root/start9/public/lnd")
            }
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

        write!(
            outfile,
            include_str!("RTL-Config.json.template"),
            password = config.password,
            user_persona = config.user_persona,
            theme_mode = config.theme_mode,
            theme_color = config.theme_color,
            macaroon_path = macaroon_path,
            lnd_host = lnd_host,
            lnd_rest_port = lnd_rest_port,
        )?;
    }
    Ok(())
}

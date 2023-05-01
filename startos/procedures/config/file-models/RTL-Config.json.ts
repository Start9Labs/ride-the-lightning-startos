import { matches } from 'start-sdk/lib'
import { FileHelper } from 'start-sdk/lib/util'

const { object, array, string, natural, anyOf, literal, boolean } = matches

const shape = object({
  SSO: object({
    logout_redirect_link: string,
    rtl_cookie_path: string,
    rtl_s_s_o: natural,
  }),
  default_node_index: natural,
  host: string,
  nodes: array(
    object({
      index: natural,
      ln_implementation: anyOf(literal(0), literal(1)), // 0=LND 1=CLN
      ln_node: string,
      Authentication: object({
        macaroon_path: string,
      }),
      Settings: object({
        user_persona: anyOf(literal(0), literal(1)), // 0=merchant 1=operator
        theme_mode: anyOf(literal(0), literal(1)), // 0=day 1=night
        theme_color: anyOf(
          literal(0),
          literal(1),
          literal(2),
          literal(3),
          literal(4),
        ), // 0=purple 1=teal 2=indigo 3=pink 4=yellow
        fiat_conversion: boolean,
        channel_backup_path: string,
        ln_server_url: string,
        enable_offers: boolean.optional(),
        unannounced_channels: boolean.optional(),
        currency_unit: string.optional(),
      }),
    }),
  ),
  port: natural,
  multi_pass: string,
  multi_pass_hashed: string.optional(),
  secret_2fa: string.optional(),
})

export const rtlConfig = FileHelper.json('RTL-Config.json', 'root', shape)

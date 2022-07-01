import { compat, types as T } from "../deps.ts";

export const getConfig: T.ExpectedExports.getConfig = compat.getConfig({
  "nodes": {
    "type": "list",
    "subtype": "union",
    "name": "Lightning Nodes",
    "description": "List of Lightning Network node instances to manage",
    "range": "[1,*)",
    "default": [
      "lnd"
    ],
    "spec": {
      "type": "string",
      "display-as": "{{name}}",
      "unique-by": "name",
      "name": "Node Implementation",
      "tag": {
        "id": "type",
        "name": "Type",
        "description": "- LND: Lightning Network Daemon from Lightning Labs\n- CLN: Core Lightning from Blockstream\n",
        "variant-names": {
          "lnd": "Lightning Network Daemon (LND)",
          "c-lightning": "Core Lightning (CLN)"
        }
      },
      "default": "lnd",
      "variants": {
        "lnd": {
          "name": {
            "type": "string",
            "name": "Node Name",
            "description": "Name of this node in the list",
            "default": "Embassy LND",
            "nullable": false
          },
          "connection-settings": {
            "type": "union",
            "name": "Connection Settings",
            "description": "The Lightning Network Daemon node to connect to.",
            "tag": {
              "id": "type",
              "name": "Type",
              "description": "- Internal: The Lightning Network Daemon service installed to your Embassy.\n- External: A Lightning Network Daemon instance running on a remote device (advanced).\n",
              "variant-names": {
                "internal": "Internal",
                "external": "External"
              }
            },
            "default": "internal",
            "variants": {
              "internal": {},
              "external": {
                "address": {
                  "type": "string",
                  "name": "Public Address",
                  "description": "The public address of your LND REST server\nNOTE: RTL does not support a .onion URL here\n",
                  "nullable": false
                },
                "rest-port": {
                  "type": "number",
                  "name": "REST Port",
                  "description": "The port that your Lightning Network Daemon REST server is bound to",
                  "nullable": false,
                  "range": "[0,65535]",
                  "integral": true,
                  "default": 8080
                },
                "macaroon": {
                  "type": "string",
                  "name": "Macaroon",
                  "description": "Your admin.macaroon file, Base64URL encoded. This is the same as the value after \"macaroon=\" in your lndconnect URL.",
                  "nullable": false,
                  "masked": true
                }
              }
            }
          }
        },
        "c-lightning": {
          "name": {
            "type": "string",
            "name": "Node Name",
            "description": "Name of this node in the list",
            "default": "Embassy CLN",
            "nullable": false
          },
          "connection-settings": {
            "type": "union",
            "name": "Connection Settings",
            "description": "The Core Lightning (CLN) node to connect to.",
            "tag": {
              "id": "type",
              "name": "Type",
              "description": "- Internal: The Core Lightning (CLN) service installed to your Embassy.\n- External: A Core Lightning (CLN) instance running on a remote device (advanced).\n",
              "variant-names": {
                "internal": "Internal",
                "external": "External"
              }
            },
            "default": "internal",
            "variants": {
              "internal": {},
              "external": {
                "address": {
                  "type": "string",
                  "name": "Public Address",
                  "description": "The public address of your C-Lightning-REST server\nNOTE: RTL does not support a .onion URL here\n",
                  "nullable": false
                },
                "rest-port": {
                  "type": "number",
                  "name": "REST Port",
                  "description": "The port that your C-Lightning-REST server is bound to",
                  "nullable": false,
                  "range": "[0,65535]",
                  "integral": true,
                  "default": 3001
                },
                "macaroon": {
                  "type": "string",
                  "name": "Macaroon",
                  "description": "Your C-Lightning-REST access.macaroon file, Base64URL encoded.",
                  "nullable": false,
                  "masked": true
                }
              }
            }
          }
        }
      }
    }
  },
  "password": {
    "type": "string",
    "name": "Password",
    "description": "The password for your Ride the Lightning dashboard",
    "nullable": false,
    "copyable": true,
    "masked": true,
    "default": {
      "charset": "a-z,A-Z,0-9",
      "len": 22
    }
  },
} as T.ConfigSpec);

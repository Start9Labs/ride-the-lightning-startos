import { setupProperties } from '@start9labs/start-sdk/lib/properties'
import { WrapperData } from '../wrapperData'
import { PropertyString } from '@start9labs/start-sdk/lib/properties/PropertyString'
import { PropertyGroup } from '@start9labs/start-sdk/lib/properties/PropertyGroup'

/**
 * With access to WrapperData, in this function you determine what to include in the Properties section of the UI
 *
 * Hello Moon has no properties. See Hello World for an example
 */
export const properties = setupProperties<WrapperData>(
  async ({ wrapperData }) => {
    return [
      PropertyGroup.of({
        header: null,
        values: [
          PropertyString.of({
            // The display label of the property
            name: 'Password',
            // A human-readable description of the property
            description: 'The default password for RTL user interface',
            // The value of the property
            value: wrapperData.password,
            // optionally display a copy button with the property
            copyable: true,
            // optionally permit displaying the property as a QR code
            qr: false,
            // optionally mask the value of the property
            masked: true,
          }),
        ],
      }),
    ]
  },
)

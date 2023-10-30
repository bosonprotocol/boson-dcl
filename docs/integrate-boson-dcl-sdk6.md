[![banner](assets/banner.png)](https://bosonprotocol.io)

< [Boson Protocol Metaverse Toolkit - Decentraland Library](../README.md)

# Use Boson Protocol in your DCL scene (SDK 6)

**@bosonprotocol/boson-dcl** is currently available to be integrated in any DCL scene built with DCL SDK v6.

## Usage

We suggest starting by looking at the example scene in `./scene/game.ts`.

This code can be run with the following command while in the `scene` directory:
`dcl start --web3`
You will be prompted to sign in with a Web3 wallet. 

The code in here is dependent on two files in the same directory:

### [`boson.ts`](../scene/src/boson.ts)

This piece of code is in charge of initializing the Boson SDK, depending on the targeted environment (`testing` or `staging` or `production`)

Please copy/paste this file into your scene repository, so that you can import `useBoson()` service from your scene code.

### [`bosonConfig.ts`](../scene/src/bosonConfig.example.ts)

This file shows how to configure the Boson SDK depending on the targeted environment. For each environment, configuration includes a Biconomy configuration (to handle metatransactions) and an RPC node URL (to connect with the blockchain).

Please create a `bosonConfig.ts` file in your scene repository based on this example (you have to use your own Biconomy configuration and RPC node URLs)

### Note that

Note that, as a developer if you wish to use the Metaverse Toolkit in production you will need to provide your own [Biconomy account details](https://biconomy.io/) to the scene `scene/src/bosonConfig.ts`. We do provide example configurations for use on the Polygon's Testnet Mumbai, so that people can get up and running quickly. 


### Kiosk images and models

Images and 3D models required to build the Boson Kiosk and panels are automatically copied to the scene repository when installing the library.
- Images are copied into: `./images/kiosk`.
- 3D models are copied into: `./images/models`.

Please do not remove these folders.

### Example implementation

```ts

import  *  as  boson  from  '@bosonprotocol/boson-dcl'
import { Kiosk } from  '@bosonprotocol/boson-dcl'
import { useBoson } from  './boson'

useBoson()
	.then(async ({ coreSDK, userAccount, walletAddress }) => {
	const allBalances: object = await boson.getAllBalances(walletAddress)
    Kiosk.init(coreSDK, userAccount, walletAddress, allBalances)

    new Kiosk(
      new Transform({
        position: new Vector3(12, 0, 4),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }),
      '12', // seller id
      'dac3a-cf71-ea64-12b6-162ddb823e7' // product uuid
    )

    new Kiosk(
      new Transform({
        position: new Vector3(4, 0, 4),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }),
      '4', // seller id
      '0af25a2-6b5a-fd5-c751-6d33e81c5634' // product uuid
    )
})
```

The Boson Product shown in the kiosk is uniquely identified by:
- the id of the seller that published the product on the Boson Protocol
- the product uuid, passed in the offer metadata when the product has been created in the protocol

In the example above, the product uuid is directly passed into the kiosk constructor.

Optionally, it's possible to add parameters to the product managed by the kiosk:
```ts
    new Kiosk(
      new Transform({
        position: new Vector3(4, 0, 4),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }),
      '4', // seller id
      {
        productUUID: 'a3a1db6-3bb7-c6f5-441c-80cccbb014',
        mainImageIndex: 2, // choose which image is shown in the kiosk (default: 0)
        imageSizes: {
          // override the image size if missing from metadata (before March 2023)
          0: { height: 1100, width: 733 },
          1: { height: 1100, width: 733 },
          2: { height: 1100, width: 733 },
          3: { height: 1100, width: 733 },
          4: { height: 1100, width: 733 },
          5: { height: 1100, width: 733 }
        }
      }
    )
```
  where:
- `productUUID` is the product uuid
  (required)
- `mainImageIndex` is the index of the image that is shown in the kiosk
  (optional, default is 0)
- `imageSizes` is the list of image size (height,width), indexed by their respective position in the metadata
  (optional, to be used with product created before March 2023, as new products created with the dApp now include image sizes in the metadata). 

### Adding a 3D Model
If you'd like to add a 3D model to be displayed in the kiosk, rather than the 2D thumbnail you will need to add the model to `./scene/models/` directory.  The kiosk can then be instantiated with the following code:

```ts

new Kiosk(
    new Transform({
    position: new Vector3(8, 0, 8),
    rotation: Quaternion.Euler(0, 0, 0),
    scale: new Vector3(1, 1, 1)
    }),
    '34', // seller id
    '245d5ed-1c6a-0beb-23f-2d787f32ef',
    new boson.DisplayProduct("models/OGShirt.glb", // path to your 3D model
      new Transform({
        position: new Vector3(0,1.7,0),
        scale: new Vector3(1.2,1.2,1.2)
      }),50)
)

```

### Customising the Kiosk

To customise the colours and branding you will need to import the `kiosk.glb` file into 3D editing software such as [Blender](https://www.blender.org/).

Changes can then be made to the model, which can then be re-exported.

The 3D model for the kiosk (along with its collider) can be found in `./scene/models/kiosk.glb`.

### Supported Currencies

#### on Polygon/Mumbai

Currently we support the following Polygon currencies:

| token | Polygon | Mumbai (testnet) |
| ----- | ------- | ---------------- |
| boson | 0x9B3B0703D392321AD24338Ff1f846650437A43C9 | 0x1f5431E8679630790E8EbA3a9b41d1BB4d41aeD0 |
| weth | 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619 | 0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa |
| usdc | 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174 | 0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747 |
| dai | 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063 | 0x001b3b4d0f3714ca98ba10f6042daebf0b1b7b6f |
| usdt | 0xc2132D05D31c914a87C6611C10748AEb04B58e8F | 0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832 |

Native currency (MATIC on Polygon) requires direct "commitToOffer" transactions, which can't be relayed as meta-transactions. Although supported by Boson Protocol, this currency can't be used with the Boson Decentraland Widget as it requires using meta-transaction to operate within Decentraland (because the user wallet is forced to be connected to Ethereum mainnet)

#### on Ethereum/Goerli

Currently we support the following Ethereum currencies

| token | Ethereum | Goerli (testnet) |
| ----- | ------- | ---------------- |
| ETH | (native) | (native) |
| boson | 0xC477D038d5420C6A9e0b031712f61c5120090de9 | 0xe3c811abbd19fbb9fe324eb0f30f32d1f6d20c95 |
| usdc | 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 | 0x07865c6E87B9F70255377e024ace6630C1Eaa37F |
| dai | 0x6B175474E89094C44Da98b954EedeAC495271d0F | 0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844 |
| usdt | 0xdAC17F958D2ee523a2206206994597C13D831ec7 | 0xfad6367E97217cC51b4cd838Cc086831f81d38C2 |
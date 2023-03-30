[![banner](../docs/assets/banner.png)](https://bosonprotocol.io)

# Boson Protocol Metaverse Toolkit - Decentraland Library

This repo provides the first instance of the Boson Protocol Metaverse Toolkit. This will allow scene builders, in Decentraland, the ability to add a Boson Kiosk to their scene, that will allow potential buyers to buy Boson rNFTs directly from the Metaverse, interacting directly with the Boson Protocol on Polygon.

# Index

- [Index](#index)
- [Using boson-dcl in your decentraland scene](#using-boson-dcl-in-your-decentraland-scene)
  - [Prerequisites](#prerequisites)
  - [Create a Decentraland scene](#create-a-decentraland-scene)
  - [Install dependencies](#install-dependencies)
  - [Install `boson-dcl` Library](#install-boson-dcl-library)
    - [Note:](#note)
    - [Usage](#usage)
      - [`boson.ts`](#bosonts)
      - [`bosonConfig.ts`](#bosonconfigts)
      - [Kiosk images and models](#kiosk-images-and-models)
    - [Example implementation](#example-implementation)
    - [Adding a 3D Model](#adding-a-3d-model)
    - [Customising the Kiosk](#customising-the-kiosk)
    - [Supported Currencies](#supported-currencies)


# Using boson-dcl in your decentraland scene

## Prerequisites

Install `decentraland` CLI
```
npm install -g decentraland
```
Ref: [Decentraland CLI documentation](https://github.com/decentraland/cli)

## Create a Decentraland scene
```bash
dcl init -p scene
```

## Install dependencies

```bash
npm install -D eth-connect patch-package
```

```bash
npm install @dcl/crypto-scene-utils @dcl/ecs-scene-utils
```

## Install `boson-dcl` Library

```bash
npm install  @bosonprotocol/boson-dcl
```

Once you have added all dependencies in your scene project, please launch the build to finish initializing your project:
```bash
dcl build
```

### Note:
In order to fix building errors, you may have to:
- adapt the version of `decentraland-ecs` dependency that is used by your scene.
  ```bash
  npm install -D decentraland-ecs@6.11.4
  ```
- add some compiler configuration properties in the `tsconfig.json` file
  ```ts
  {
    "compilerOptions": {
      ...
      "skipLibCheck": true
    },
    ...
  }

  ```

### Usage

We suggest starting by looking at the example scene in `./scene/game.ts`.

This code can be run with the following command while in the `scene` directory:
`dcl start --web3`
You will be prompted to sign in with a Web3 wallet. 

The code in here is dependent on two files in the same directory:

#### [`boson.ts`](../scene/src/boson.ts)

This piece of code is in charge of initializing the Boson SDK, depending on the targeted environment (`testing` or `staging` or `production`)

Please copy/paste this file into your scene repository, so that you can import `useBoson()` service from your scene code.

#### [`bosonConfig.ts`](../scene/src/bosonConfig.example.ts)

This file shows how to configure the Boson SDK depending on the targeted environment. For each environment, configuration includes a Biconomy configuration (to handle metatransactions) and an RPC node URL (to connect with the blockchain).

Please create a `bosonConfig.ts` file in your scene repository based on this example (you have to use your own Biconomy configuration and RPC node URLs)

#### Note that

Note that, as a developer if you wish to use the Metaverse Toolkit in production you will need to provide your own [Biconomy account details](https://biconomy.io/) to the scene `scene/src/bosonConfig.ts`. We do provide example configurations for use on the Polygon's Testnet Mumbai, so that people can get up and running quickly. 


#### Kiosk images and models

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
      'dac3a-cf71-ea64-12b6-162ddb823e7' // product uuid
    )

    new Kiosk(
      new Transform({
        position: new Vector3(4, 0, 4),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }),
      '0af25a2-6b5a-fd5-c751-6d33e81c5634' // product uuid
    )
})
```

Here the product uuid is passed into the kiosk constructor.

Optionally, it's possible to add parameters to the product managed by the kiosk:
```ts
    new Kiosk(
      new Transform({
        position: new Vector3(4, 0, 4),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }),
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

Currently we support the following Polygon currencies:

| token | Polygon | Mumbai (testnet) |
| ----- | ------- | ---------------- |
| boson | 0x9B3B0703D392321AD24338Ff1f846650437A43C9 | 0x1f5431E8679630790E8EbA3a9b41d1BB4d41aeD0 |
| weth | 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619 | 0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa |
| usdc | 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174 | 0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747 |
| dai | 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063 | 0x001b3b4d0f3714ca98ba10f6042daebf0b1b7b6f |
| usdt | 0xc2132D05D31c914a87C6611C10748AEb04B58e8F | 0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832 |

Native currency (MATIC on Polygon) requires direct "commitToOffer" transactions, which can't be relayed as meta-transactions. Although supported by Boson Protocol, this currency can't be used with the Boson Decentraland Widget as it requires using meta-transaction to operate within Decentraland (because the user wallet is forced to be connected to Ethereum mainnet)

# Contributing

We welcome contributions! Until now, Boson Protocol has been largely worked on by a small dedicated team. However, the ultimate goal is for all of the Boson Protocol repositories to be fully owned by the community and contributors. Issues, pull requests, suggestions, and any sort of involvement are more than welcome.

If you have noticed a bug, please report them here as an issue.

Questions and feedback are always welcome, we will use them to improve our offering.

All PRs must pass all tests before being merged.

By being in this community, you agree to the [Code of Conduct](../docs/code-of-conduct.md). Take a look at it, if you haven't already.

Before starting to contribute, please check out Local development guide.

# License

Licensed under [Apache v2](../LICENSE)

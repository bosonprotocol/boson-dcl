[![banner](docs/assets/banner.png)](https://bosonprotocol.io)

  

<h2  align="center">Boson Protocol - DCL Library V2</h2>

  

<div  align="center">

  

<a  href="">![](https://img.shields.io/badge/license-Apache--2.0-brightgreen?style=flat-square)</a>

<a  href="https://discord.com/invite/QSdtKRaap6">![](https://img.shields.io/badge/Chat%20on-Discord-%235766f2?style=flat-square)</a>

<a  href="https://twitter.com/BosonProtocol">![](https://img.shields.io/twitter/follow/BosonProtocol?style=social)</a>

  

</div>

  

<div  align="center">

  

🛠️ **The official Decentraland library to build on top of the [Boson Protocol](https://bosonprotocol.io).**

  

</div>

  

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

This file shows how to configure the Boson SDK depending on the targeted environment. For each environment, configuration includes a Biconomy coniguration (to handle metatransactions) and an RPC node URL (to connect with the blockchain).

Please create a `bosonConfig.ts` file in your scene repository based on this example (you have to use your own BIconomy configuration and RPC node URLs)

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
      'dac3a-cf71-ea64-12b6-162ddb823e7'
    )

    new Kiosk(
      new Transform({
        position: new Vector3(4, 0, 4),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }),
      '0af25a2-6b5a-fd5-c751-6d33e81c5634' // product id
    )
})
```

Here the product id is passed into the kiosk constructor.

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

* boson
* weth
* usdc
* dai
* usdt
           

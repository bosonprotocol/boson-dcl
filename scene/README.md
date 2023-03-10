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

  

## Index

  

- [Index](#index)

- [Getting started](#getting-started)

- [Install](#install)

- [Usage](#usage)

  

## Getting started

### Install

```bash

npm install  @bosonprotocol/boson-dcl-v2

# OR

yarn add  @bosonprotocol/boson-dcl-v2

```

  

### Usage

We suggest starting by looking at the example scene in `./scene/game.ts`.

This code can be run with the following command while in the `scene` directory:
`dcl start --web3`
You will be prompted to sign in with a Web3 wallet. 

The code in here is dependent on two files in the same directory:

`boson.ts`

`bosonConfig.ts`

These are used to communicate with the backend library and subgraph.

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
      '0af25a2-6b5a-fd5-c751-6d33e81c5634' // offer id
    )
})
```

Here the offer id is passed into the kiosk constructor.

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
           

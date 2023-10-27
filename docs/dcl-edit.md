[![banner](assets/banner.png)](https://bosonprotocol.io)

< [Boson Protocol Metaverse Toolkit - Decentraland Library](../README.md)

# Use Boson Protocol with [DCL Edit](https://dcl-edit.com)

- boson-dcl library allows to use Boson Protocol from a Decentraland scene. Doing so, you are able to build a completely new shopping experience to your users.
- dcl-edit makes scene building an easy and user-friendly process, allowing to place and manipulate 3D objets just like in any other state-of-the-art game engine.
- combining boson-dcl with dcl-edit, you can easily create a 3D scene with objects which can be clicked to commit to some Boson Protocol products/offers.

## Prerequisites

- register a Boson Seller account in the [Boson Protocol Marketplace](https://bosonapp.io)
- create some Boson Protocol products in the marketplace

Note: when using the [Boson Protocol Marketplace](https://bosonapp.io), you can choose to use Boson Protocol on [Ethereum](https://ethereum.org/en/) or on [Polygon](https://polygon.technology/polygon-pos).

Your choice between Ethereum and Polygon must consider different points, detailed here after:
| | Ethereum | Polygon |
| - | - | - |
| ***transaction fees*** | Choosing Ethereum means your scene's users will pay transaction fees to operate with Boson Protocol. These fees may be significant (ex: ~$5), compared with the price of the items being purchased. | Choosing Polygon means you will have to use meta-transactions(*) and pay the gas fees of your users, at least for the transactions operated from Decentraland. These fees are very low (ex: $0.02) compared to the ones on Ethereum, thought.
***payment currencies*** | Users will commit to Boson Protocol products, paying with ETH native currency or ERC20 tokens on Ethereum | users will commit to Boson Protocol products, paying with MATIC native currency or ERC20 tokens on Polygon, meaning they will have to bridge their funds from Ethereum to Polygon, if not done yet
***token-gated offers*** (Boson Protocol allows you to create token-gated products, meaning that only users that owns specific tokens (ERC20 or NFT ERC721/ERC1155) can commit to them.) | The token (ERC20 or NFT ERC721/ERC1155) used for the token-gating condition must be an Ethereum token | The token (ERC20 or NFT ERC721/ERC1155) used for the token-gating condition must be a Polygon token
***meta-transactions*** (in Decentraland, the user wallet is forced to be connected to Ethereum, meaning that to interact with another blockchain, transactions need to be relayed - we called them meta-transactions) | on Ethereum, use of meta-transaction is not required | on Polygon, use of meta-transaction is required. We advice the scene builder to subscribe to [Biconomy](biconomy.io) that provides this service. A proper configuration needs to be done to setup the relaying service, and this configuration needs to be passed on ***boson-dcl*** when initializing.

 


## DCL-Edit installation

Please refer to [DCL-Edit Install Instructions](https://dcl-edit.com/install-guide)

## create a Decentraland scene project

```
dcl init -p scene
```

## boson-dcl installation

Install boson-dcl library and some required dependencies in your scene

```bash
npm install -D eth-connect patch-package
```

```bash
npm install @dcl/crypto-scene-utils @dcl/ecs-scene-utils
```

```bash
npm install  @bosonprotocol/boson-dcl
```

Once you have added all dependencies in your scene project, please launch the build to finish initializing your project:
```bash
dcl build
```

### Note:
You may have some building errors, that are removed by adding some compiler configuration properties in the `tsconfig.json` file
  ```ts
  {
    "compilerOptions": {
      ...
      "skipLibCheck": true
    },
    ...
  }

  ```

## edit the scene with DCL-Edit

With DCL-Edit, you can place and manipulate objects in your scene just like in any other state-of-the-art game engine.

### Add BosonConfiguration component

This component is required to initialize the boson-dcl library with the correct configuration.

You have to add this component to any object (at least one, and preferably only one) in the scene.

### Add BosonProducts components to some objects in your scene

Within DCL-Edit, select an object in your scene and Add Component > Custom > Boson Products

This object will be clickable and, when clicked, will show the Commit Popup of boson-dcl to commit to a given Boson Protocol Product.

Set the seller ID and the product ID of the Boson Protocol product you want to associate with this object





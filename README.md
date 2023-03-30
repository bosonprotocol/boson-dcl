[![banner](docs/assets/banner.png)](https://bosonprotocol.io)

# Boson Protocol Metaverse Toolkit - Decentraland Library

This repo provides the first instance of the Boson Protocol Metaverse Toolkit. This will allow scene builders, in Decentraland, the ability to add a Boson Kiosk to their scene, that will allow potential buyers to buy Boson rNFTs directly from the Metaverse, interacting directly with the Boson Protocol on Polygon.

## Prerequisites

Install `decentraland` CLI
```
npm install -g decentraland
```
Ref: [Decentraland CLI documentation](https://github.com/decentraland/cli)

## Build the library

Note that, as a developer if you wish to use the the Metaverse Toolkit in production you will need to provide your own [Biconomy account details](https://biconomy.io/) to the scene `scene/src/bosonConfig.ts`. We do provide example configurations for use on the Polygon's Testnet Mumbai, so that people can get up and running quickly. 

```
cd library
```

```
npm install
```

```
npm run build
```

## Test the library

An example of a decentraland scene using the library is provided in the **_'scene'_** sub-folder.

```
cd scene
```

```
npm install
```

```
npm run build
```

```
dcl start --web3
```

## How to publish the library

A Github action automatically runs when a Release is created

# Integrate Boson-DCL in your own Decentraland Scene

Create your Decentraland Scene and use BOSON to sell redeemable NFT for physical products.

See [README.md](./library/README.md)

# Contributing
We welcome contributions! Until now, Boson Protocol has been largely worked on by a small dedicated team. However, the ultimate goal is for all of the Boson Protocol repositories to be fully owned by the community and contributors. Issues, pull requests, suggestions, and any sort of involvement are more than welcome.

If you have noticed a bug, please report them here as an issue.

Questions and feedback are always welcome, we will use them to improve our offering.

All PRs must pass all tests before being merged.

By being in this community, you agree to the [Code of Conduct](./docs/code-of-conduct.md). Take a look at it, if you haven't already.

Before starting to contribute, please check out Local development guide.

# License
Licensed under [Apache v2](./LICENSE)


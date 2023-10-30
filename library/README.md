[![banner](../docs/assets/banner.png)](https://bosonprotocol.io)

# Boson Protocol Metaverse Toolkit - Decentraland Library

This repo provides the first instance of the Boson Protocol Metaverse Toolkit. This will allow scene builders, in Decentraland, the ability to add a Boson Kiosk to their scene, that will allow potential buyers to buy Boson rNFTs directly from the Metaverse, interacting directly with the Boson Protocol on Polygon.

# Index

- [Boson Protocol Metaverse Toolkit - Decentraland Library](#boson-protocol-metaverse-toolkit---decentraland-library)
- [Index](#index)
- [Using boson-dcl in your decentraland scene](#using-boson-dcl-in-your-decentraland-scene)
  - [Create a Decentraland scene project](#create-a-decentraland-scene-project)
    - [Prerequisites](#prerequisites)
    - [Create a scene](#create-a-scene)
  - [Install @bosonprotocol/boson-dcl and their dependencies](#install-bosonprotocolboson-dcl-and-their-dependencies)
    - [Note:](#note)
  - [Build/Edit your Scene](#buildedit-your-scene)
    - [With DCL-Edit](#with-dcl-edit)
    - [Writing code](#writing-code)
- [Contributing](#contributing)
- [License](#license)


# Using boson-dcl in your decentraland scene

## Create a Decentraland scene project

### Prerequisites

Install `decentraland` CLI
```
npm install -g decentraland
```
Ref: [Decentraland CLI documentation](https://github.com/decentraland/cli)

### Create a scene
```
dcl init -p scene
```

## Install @bosonprotocol/boson-dcl and their dependencies

Run npm to install @bosonprotocol/boson-dcl library and some required dependencies in your scene

```bash
npm install -D eth-connect patch-package
```

```bash
npm install @dcl/crypto-scene-utils @dcl/ecs-scene-utils
```

```bash
npm install @bosonprotocol/boson-dcl
```

Once you have added all dependencies in your scene project, please launch the build to finish initializing your project:
```bash
dcl build
```

### Note:
- You may have some building errors, that are removed by adding some compiler configuration properties in the `tsconfig.json` file
  ```ts
  {
    "compilerOptions": {
      ...
      "skipLibCheck": true
    },
    ...
  }

  ```

## Build/Edit your Scene 

### With DCL-Edit

We advise you to run [DCL Edit](https://dcl-edit.com) to edit and build your scene.

You can integrate **Boson Protocol** in **DCL-Edit** easily using [these detailed instructions](../docs/dcl-edit.md).

### Writing code

Or, you can build your scene programmatically, writing code in typescript, based on the DCL SDK v6. In that case, you will find an example and useful information about how integrate Boson Protocol in [this chapter](../docs/integrate-boson-dcl-sdk6.md).

# Contributing

We welcome contributions! Until now, Boson Protocol has been largely worked on by a small dedicated team. However, the ultimate goal is for all of the Boson Protocol repositories to be fully owned by the community and contributors. Issues, pull requests, suggestions, and any sort of involvement are more than welcome.

If you have noticed a bug, please report them here as an issue.

Questions and feedback are always welcome, we will use them to improve our offering.

All PRs must pass all tests before being merged.

By being in this community, you agree to the [Code of Conduct](../docs/code-of-conduct.md). Take a look at it, if you haven't already.

Before starting to contribute, please check out Local development guide.

# License

Licensed under [Apache v2](../LICENSE)

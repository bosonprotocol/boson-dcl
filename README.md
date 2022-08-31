[![banner](docs/assets/banner.png)](https://bosonprotocol.io)

<h2 align="center">Boson Protocol - DCL Library V2</h2>

<div align="center">

<a href="">![](https://img.shields.io/badge/license-Apache--2.0-brightgreen?style=flat-square)</a>
<a href="https://discord.com/invite/QSdtKRaap6">![](https://img.shields.io/badge/Chat%20on-Discord-%235766f2?style=flat-square)</a>
<a href="https://twitter.com/BosonProtocol">![](https://img.shields.io/twitter/follow/BosonProtocol?style=social)</a>

</div>

<div align="center">

🛠️ **The official Decentraland library to build on top of the [Boson Protocol](https://bosonprotocol.io).**

</div>

## Index

- [Getting started](#getting-started)
- [API docs](./library/docs/index.md)
- [Example scene](./scene/README.md)

## Getting started

### Install

```bash
npm install @bosonprotocol/boson-dcl-v2
# OR
yarn add @bosonprotocol/boson-dcl-v2
```

### Usage

Example usage of library in a scene:

```ts
import { initCoreSdk } from "@bosonprotocol/boson-dcl-v2";
import { getUserAccount } from "@decentraland/EthereumController";

async function init() {
  const userAccount = await getUserAccount();

  const coreSDK = await initCoreSdk(targetChainId);

  return { coreSDK, userAccount };
}

init().then(async ({ coreSDK, userAccount }) => {
  log("initialized core-sdk", coreSDK);

  // query valid offers from subgraph
  const offers = await coreSDK.getOffers({
    offersOrderBy: "createdAt",
    offersOrderDirection: "desc",
    offersFirst: 10,
    offersFilter: {
      validFromDate_lte: Math.floor(Date.now() / 1000),
      quantityAvailable_gt: 0,
    },
  });
  log("offers", offers);

  for (const [i, offer] of offers.entries()) {
    const cube = spawnCube(i + 1, 1, 1);

    cube.addComponent(
      new OnPointerDown(
        async () => {
          // commit to offer
          const txResponse = await coreSDK.commitToOffer(offer.id, {
            buyer: userAccount,
          });
          log("commitToOffer - txResponse", txResponse);
        },
        {
          button: ActionButton.POINTER,
          hoverText: `Commit to offer: ${offer.id}`,
        }
      )
    );
  }
});
```

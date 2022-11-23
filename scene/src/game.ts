/// --- Set up a system ---

import { useBoson } from "./boson";

class RotatorSystem {
  // this group will contain every entity that has a Transform component
  group = engine.getComponentGroup(Transform);

  update(dt: number) {
    // iterate over the entities of the group
    for (const entity of this.group.entities) {
      // get the Transform component of the entity
      const transform = entity.getComponent(Transform);

      // mutate the rotation
      transform.rotate(Vector3.Up(), dt * 10);
    }
  }
}

// Add a new instance of the system to the engine
engine.addSystem(new RotatorSystem());

/// --- Spawner function ---

function spawnCube(x: number, y: number, z: number) {
  // create the entity
  const cube = new Entity();

  // add a transform to the entity
  cube.addComponent(new Transform({ position: new Vector3(x, y, z) }));

  // add a shape to the entity
  cube.addComponent(new BoxShape());

  // add the entity to the engine
  engine.addEntity(cube);

  return cube;
}

/// --- Spawn a cube ---

useBoson().then(async ({ coreSDK, userAccount }) => {
  log("initialized core-sdk", coreSDK);

  // query valid offers from subgraph
  const onlyErc20Offers = false;
  const targetDate = Math.floor(Date.now() / 1000)
  const offers = await coreSDK.getOffers({
    offersOrderBy: "createdAt",
    offersOrderDirection: "desc",
    offersFirst: 10,
    offersFilter: {
      validFromDate_lte: targetDate,
      validUntilDate_gte: targetDate,
      quantityAvailable_gt: 0,
      exchangeToken_not: onlyErc20Offers ? "0x0000000000000000000000000000000000000000" : undefined
    },
  });
  log("offers", offers);

  for (const [i, offer] of offers.entries()) {
    const cube = spawnCube(i + 1, 1, 1);

    cube.addComponent(
      new OnPointerDown(
        async () => {
          const txResponse = await coreSDK.commitToOffer(offer.id, {
            buyer: userAccount,
          });
          log("commitToOffer - txResponse", txResponse);
          const txReceipt = await txResponse.wait();
          log("commitToOffer - txReceipt", txReceipt);
        },
        {
          button: ActionButton.POINTER,
          hoverText: `Commit to offer: ${offer.id}`,
        }
      )
    );
  }
});

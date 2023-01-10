/// --- Set up a system ---

import { ADDRESS_ZERO, useBoson } from "./boson";
import { BigNumber, toBigNumber } from 'eth-connect';

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
    offersOrderBy: "createdAt" as any,
    offersOrderDirection: "desc" as any,
    offersFirst: 10,
    offersFilter: {
      validFromDate_lte: String(targetDate),
      validUntilDate_gte: String(targetDate),
      quantityAvailable_gt: String(0),
      exchangeToken_not: onlyErc20Offers ? ADDRESS_ZERO : undefined
    },
  });
  log("offers", offers);

  for (const [i, offer] of (offers as any).entries()) {
    const cube = spawnCube(i + 1, 1, 1);
    const exchangeTokenAddress = offer.exchangeToken.address;
    const nativeOffer = exchangeTokenAddress === ADDRESS_ZERO;

    cube.addComponent(
      new OnPointerDown(
        async () => {
          let txResponse;
          const canUseMetaTx = coreSDK.isMetaTxConfigSet;
          if (!nativeOffer && canUseMetaTx) {
            log("getProtocolAllowance()", exchangeTokenAddress, offer.price);
            const currentAllowance = await coreSDK.getProtocolAllowance(
              exchangeTokenAddress
            );
            const approveNeeded = toBigNumber(currentAllowance).lt(offer.price);
            log("approveNeeded", approveNeeded);
            if (approveNeeded) {
              let approveTx;
              if (coreSDK.checkMetaTxConfigSet({ contractAddress: exchangeTokenAddress })) {
                // Use meta-transaction for approval, if needed
                log("signNativeMetaTxApproveExchangeToken()", exchangeTokenAddress);
                const { r, s, v, functionName, functionSignature } =
                  await coreSDK.signNativeMetaTxApproveExchangeToken(
                    exchangeTokenAddress,
                    offer.price
                  );
                log("relayNativeMetaTransaction()", exchangeTokenAddress, functionSignature);
                approveTx = await coreSDK.relayNativeMetaTransaction(
                  exchangeTokenAddress,
                  {
                    functionSignature,
                    sigR: r,
                    sigS: s,
                    sigV: v
                  }
                )
              } else {
                approveTx = await coreSDK.approveExchangeToken(
                  exchangeTokenAddress,
                  offer.price
                );
              }
              await approveTx.wait();
            }
            log("signMetaTxCommitToOffer()", offer.id);
            const nonce = Date.now();
            const { r, s, v, functionName, functionSignature } =
              await coreSDK.signMetaTxCommitToOffer({
                offerId: offer.id,
                nonce
              }
            );
            txResponse = await coreSDK.relayMetaTransaction(
              {
                functionName,
                functionSignature,
                sigR: r,
                sigS: s,
                sigV: v,
                nonce
              }
            );
          } else {
            txResponse = await coreSDK.commitToOffer(offer.id, {
              buyer: userAccount,
            });
          }
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

/// --- Set up a system ---

import { ADDRESS_ZERO, checkOfferCommittable, commitToOffer, checkUserCanCommitToOffer } from '@bosonprotocol/boson-dcl'
import { useBoson } from './boson'

/// --- Spawner function ---

function spawnCube(x: number, y: number, z: number) {
  // create the entity
  const cube = new Entity()

  // add a transform to the entity
  cube.addComponent(new Transform({ position: new Vector3(x, y, z) }))

  // add a shape to the entity
  cube.addComponent(new BoxShape())

  // add the entity to the engine
  engine.addEntity(cube)

  return cube
}

/// --- Spawn a cube ---

useBoson()
  .then(async ({ coreSDK, userAccount }) => {
    log('initialized core-sdk', coreSDK)

    // query valid offers from subgraph
    const onlyErc20Offers = true
    const targetDate = Math.floor(Date.now() / 1000)
    const offers = await coreSDK.getOffers({
      offersOrderBy: 'createdAt' as any,
      offersOrderDirection: 'desc' as any,
      offersFirst: 10,
      offersFilter: {
        validFromDate_lte: String(targetDate),
        validUntilDate_gte: String(targetDate),
        quantityAvailable_gt: String(0),
        exchangeToken_not: onlyErc20Offers ? ADDRESS_ZERO : undefined,
        voided: false
      }
    })
    log('offers', offers)

    for (const [i, offer] of (offers as any).entries()) {
      const cube = spawnCube(i*1.1 + 1, 1, 1)

      cube.addComponent(
        new OnPointerDown(
          async () => {
            try {
              const { isCommittable, voided, notYetValid, expired, soldOut } = checkOfferCommittable(coreSDK, offer)
              if (!isCommittable) {
                log(`Offer ${offer.id} can be committed`)
                if (voided) {
                  log(`Offer ${offer.id} has been voided`)
                  return
                }
                if (notYetValid) {
                  log(`Offer ${offer.id} is not valid yet`)
                  return
                }
                if (expired) {
                  log(`Offer ${offer.id} has expired`)
                  return
                }
                if (soldOut) {
                  log(`Offer ${offer.id} is sold out`)
                  return
                }
              }
              const { canCommit, approveNeeded } = await checkUserCanCommitToOffer(coreSDK, offer, userAccount)
              log('canCommit', canCommit)
              log('approveNeeded', !!approveNeeded)
              await commitToOffer(coreSDK, offer, userAccount)
            } catch (e) {
              log(`ERROR when committing to offer ${offer.id}`, e)
            }
          },
          {
            button: ActionButton.POINTER,
            hoverText: `Commit to offer: ${offer.id}`
          }
        )
      )
    }
  })
  .catch((e) => {
    log('ERROR - Unable to initialize BOSON', e)
  })

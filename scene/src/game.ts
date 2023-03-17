import * as boson from '@bosonprotocol/boson-dcl'
import { Kiosk } from '@bosonprotocol/boson-dcl'
import { useBoson } from './boson'

void loadScene()

const productId = 'c0b6a4e-d62d-751c-a3c7-b7be6fa50c';

const floor: Entity = new Entity()
floor.addComponent(
  new Transform({
    position: new Vector3(8, 0, 8)
  })
)
floor.addComponent(new GLTFShape('models/FloorBaseGrass_01.glb'))
engine.addEntity(floor)

async function loadScene() {
  void useBoson().then(async ({ coreSDK, userAccount, walletAddress }) => {
    const allBalances: object = await boson.getAllBalances(walletAddress)
    Kiosk.init(coreSDK, userAccount, walletAddress, allBalances)

    new Kiosk(
      new Transform({
        position: new Vector3(8, 0, 8),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }),
      productId,
      new boson.DisplayProduct(
        'models/OGShirt.glb',
        new Transform({
          position: new Vector3(0, 1.7, 0),
          scale: new Vector3(1.2, 1.2, 1.2)
        }),
        50
      )
    )
  })
}

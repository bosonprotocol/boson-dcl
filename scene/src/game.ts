import * as boson from '@bosonprotocol/boson-dcl'
import { Kiosk } from '@bosonprotocol/boson-dcl'
import { useBoson } from './boson'

void loadScene()

const productUUIDs = ['c0b6a4e-d62d-751c-a3c7-b7be6fa50c', 'a3a1db6-3bb7-c6f5-441c-80cccbb014']

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
        position: new Vector3(6, 0, 6),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }),
      productUUIDs[0], // product UUID
      new boson.DisplayProduct( // show a 3D model inside the kiosk
        'models/OGShirt.glb',
        new Transform({
          position: new Vector3(0, 1.7, 0),
          scale: new Vector3(1.2, 1.2, 1.2)
        }),
        50
      )
    )

    new Kiosk(
      new Transform({
        position: new Vector3(6, 0, 10),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      }),
      {
        productUUID: productUUIDs[1], // product UUID
        mainImageIndex: 2, // choose which image is shown in the kiosk (default: 0)
        imageSizes: {
          // override the image size if missing from metadata (before March 2023)
          0: { height: 1100, width: 733 },
          1: { height: 1100, width: 733 },
          2: { height: 1100, width: 733 },
          3: { height: 1100, width: 733 },
          4: { height: 1100, width: 733 },
          5: { height: 1100, width: 733 }
        }
      }
    )
  })
}

import { ProductHandle } from "@bosonprotocol/boson-dcl";
import { BosonConfigurator } from "@bosonprotocol/boson-dcl";

/* 
#DCECOMP
{
  "class": "BosonProduct",
  "component": "BosonProduct",
  "category": "BosonProtocol",
  "properties": [
    {
      "name": "productUUID",
      "type": "string"
    },
    {
      "name": "sellerId",
      "type": "string"
    },
    {
      "name": "productUUID_test",
      "type": "string"
    },
    {
      "name": "sellerId_test",
      "type": "string"
    },
    {
      "name": "panelPositionOffset",
      "type": "vector3",
      "default": [0, 0, 0]
    }
  ]
}
*/

@Component("BosonProduct")
export class BosonProduct {
  public productUUID = "";
  public sellerId = "";
  public productUUID_test = "";
  public sellerId_test = "";
  public panelPositionOffset = Vector3.Zero();

  init(entity: Entity) {
    log("BosonProduct:: init() - wait for BosonConfigurator to be initialized");
    BosonConfigurator.whenInitialized().then(() => {
      log(
        `BosonConfigurator initialized on ${
          BosonConfigurator.testEnv ? "test" : "prod"
        } env`
      );
      const sellerId_ = BosonConfigurator.testEnv
        ? this.sellerId_test || this.sellerId
        : this.sellerId;
      const productUUID_ = BosonConfigurator.testEnv
        ? this.productUUID_test || this.productUUID
        : this.productUUID;
      ProductHandle.whenInitialized().then(() => {
        log("BosonProduct:: init() - create the ProductHandle");
        new ProductHandle(
          { parent: entity, panelPosition: this.panelPositionOffset },
          sellerId_,
          productUUID_
        );
      });
    });
  }
}

import {
  OfferFieldsFragment,
  ProductV1Media,
} from "@bosonprotocol/core-sdk/dist/esm/subgraph";
import { Helper } from "../helper";

export class LockComponent {
  // artist image for lock
  artistEntity: Entity = new Entity();
  artistMat: Material = new Material();

  // Artist background in case it has alpha
  artistFillEntity: Entity = new Entity();
  artistFillMat: Material = new Material();

  // lock
  backgroundEntity: Entity = new Entity();
  foregroundEntity: Entity = new Entity();
  lockMaterial: Material = new Material();
  lockTextureUnlocked: Texture | undefined;
  lockTextureLocked: Texture | undefined;

  public locked = true;

  constructor(
    _productData: OfferFieldsFragment | undefined,
    _parent: Entity,
    _transform: Transform
  ) {
    if (!_productData) {
      throw new Error(
        "Invalid product data used in LockComponent instantiation"
      );
    }

    this.foregroundEntity = new Entity();
    this.foregroundEntity.addComponent(new PlaneShape());
    this.foregroundEntity.setParent(_parent);
    this.foregroundEntity.addComponent(
      new Transform({
        position: new Vector3(
          _transform.position.x + 0.07,
          _transform.position.y,
          _transform.position.z - 0.02
        ),
        rotation: _transform.rotation,
        scale: new Vector3(
          _transform.scale.x * 1.2,
          _transform.scale.y * 1.2,
          0.01
        ),
      })
    );

    // Artist background
    this.artistFillEntity = new Entity();
    this.artistFillEntity.addComponent(new PlaneShape());
    this.artistFillEntity.setParent(_parent);
    this.artistFillEntity.addComponent(
      new Transform({
        position: new Vector3(
          _transform.position.x,
          _transform.position.y,
          _transform.position.z - 0.0005
        ),
        scale: _transform.scale,
      })
    );

    this.artistFillMat.emissiveIntensity = 0.25;
    this.artistFillMat.emissiveColor = Color3.White();
    this.artistFillMat.alphaTexture = new Texture(
      "images/kiosk/ui/gate_mask.png"
    );
    this.artistFillMat.transparencyMode = 2;
    this.artistFillEntity.addComponent(this.artistFillMat);

    // Artist image for lock
    this.artistEntity = new Entity();
    this.artistEntity.addComponent(new PlaneShape());
    this.artistEntity.setParent(_parent);
    this.artistEntity.addComponent(
      new Transform({
        position: new Vector3(
          _transform.position.x,
          _transform.position.y,
          _transform.position.z - 0.0008
        ),
        rotation: Quaternion.Euler(180,180,0),
        scale: _transform.scale,
      })
    );

    this.artistMat = new Material();

    if (
      _productData.metadata &&
      "productV1Seller" in _productData.metadata &&
      _productData.metadata.productV1Seller.images &&
      _productData.metadata.productV1Seller.images.length > 0
    ) {
      let targetImage: ProductV1Media | undefined = undefined;

      for (
        let i = 0;
        i < _productData.metadata.productV1Seller.images.length;
        i++
      ) {
        const currentImage = _productData.metadata.productV1Seller.images[i];
        if (currentImage.tag === "profile") {
          targetImage = currentImage;
          break;
        }
      }
      if (targetImage) {
        if (targetImage.url != undefined) {
          Helper.getIPFSImageTexture(targetImage.url).then((texture:Texture)=>{
            this.artistMat.albedoTexture = texture;
            this.artistMat.emissiveIntensity = 1;
            this.artistMat.emissiveColor = Color3.White();
            this.artistMat.emissiveTexture = texture;
            this.artistMat.alphaTexture = new Texture(
              "images/kiosk/ui/gate_mask.png"
            );
            this.artistMat.transparencyMode = 2;
            this.artistEntity.addComponent(this.artistMat);
          })

          if (targetImage.height && targetImage.width) {
            this.artistEntity.getComponent(Transform).scale.y =
              this.artistEntity.getComponent(Transform).scale.x *
              (targetImage.height / targetImage.width);
          }
        }
      }

      //Lock
      this.backgroundEntity = new Entity();
      this.backgroundEntity.addComponent(new PlaneShape());
      this.backgroundEntity.setParent(_parent);
      this.backgroundEntity.addComponent(
        new Transform({
          position: new Vector3(
            _transform.position.x,
            _transform.position.y,
            _transform.position.z - 0.0
          ),
          rotation: _transform.rotation,
          scale: new Vector3(
            _transform.scale.x * 1.2,
            _transform.scale.y * 1.2,
            0.01
          ),
        })
      );

      this.lockMaterial = new Material();
      this.lockTextureUnlocked = new Texture(
        "images/kiosk/ui/gate_lock_tick.png"
      );
      this.lockTextureLocked = new Texture(
        "images/kiosk/ui/gate_lock_cross.png"
      );

      this.lockMaterial.albedoTexture = this.lockTextureLocked;
      this.lockMaterial.emissiveIntensity = 0.25;
      this.lockMaterial.emissiveColor = Color3.White();
      this.lockMaterial.emissiveTexture = this.lockTextureLocked;
      this.lockMaterial.transparencyMode = 2;
      this.backgroundEntity.addComponent(this.lockMaterial);
      this.foregroundEntity.addComponent(this.lockMaterial);

      this.setLock();
    }
  }
  public show(): void {
    Helper.showAllEntities([
      this.artistEntity,
      this.backgroundEntity,
      this.foregroundEntity,
      this.artistFillEntity,
    ]);
  }

  public hide(): void {
    Helper.hideAllEntities([
      this.artistEntity,
      this.backgroundEntity,
      this.foregroundEntity,
      this.artistFillEntity,
    ]);
  }

  public setLock(): void {
    if (this.locked) {
      this.lockMaterial.albedoTexture = this.lockTextureLocked;
      this.lockMaterial.emissiveTexture = this.lockTextureLocked;
    } else {
      this.lockMaterial.albedoTexture = this.lockTextureUnlocked;
      this.lockMaterial.emissiveTexture = this.lockTextureUnlocked;
    }
  }
}

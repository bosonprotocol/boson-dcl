import { ScaleSpringComponent } from "./animation/ScaleSpringComponent";
import { Helper } from "./helper";

/**
 * @public
 */
export class DisplayProduct extends Entity {
  private readonly frameOffset: number = 0.05;
  modelPath: string;
  transformOffset: Transform;
  spinSpeed: number;
  created = false;
  originalScale: Vector3;
  frame: Entity | undefined;

  constructor(
    _modelPath: string,
    _transformOffset: Transform,
    _spinSpeed: number
  ) {
    super();

    this.modelPath = _modelPath;
    this.transformOffset = _transformOffset;
    this.spinSpeed = _spinSpeed;

    this.originalScale = _transformOffset.scale.clone();

    this.addComponent(new ScaleSpringComponent(120, 10));
  }

  create(_parent: Entity, _productData: any, mainImageIndex = 0) {
    if (!this.created) {
      this.created = true;

      this.addComponent(this.transformOffset);

      if (this.modelPath.length > 0) {
        this.addComponent(new GLTFShape(this.modelPath));
        this.setParent(_parent);
      } else {
        // Intermediate entity
        const parent: Entity = new Entity();
        parent.setParent(_parent);
        parent.addComponent(new Transform());
        parent.addComponent(new Billboard(false, true, false));

        this.setParent(parent);

        // Set up product image as a model
        this.addComponent(new PlaneShape());
        const productImageMat: Material = new Material();
        const transform = this.addComponentOrReplace(
          new Transform({
            position: new Vector3(0, 1.6, 0),
            rotation: Quaternion.Euler(180, 0, 0),
            scale: new Vector3(1.6 / 1.4, 1.6 / 1.4, 0.01),
          })
        );

        if (_productData.metadata.product.visuals_images.length > 0) {

          Helper.getIPFSImageTexture(
            _productData.metadata.product.visuals_images[mainImageIndex].url
          ).then((texture: Texture) => {
            productImageMat.albedoTexture = texture;
            productImageMat.emissiveIntensity = 1;
            productImageMat.emissiveColor = Color3.White();
            productImageMat.emissiveTexture = texture;
            this.addComponent(productImageMat);

            if (texture.src.indexOf("waitingForImage") == -1) {
              const width =
                _productData.metadata.product.visuals_images[mainImageIndex].width;
              const height =
                _productData.metadata.product.visuals_images[mainImageIndex].height;
              transform.scale.y =
                transform.scale.x * (width > 0 ? height / width : 1);
            }
            this.originalScale = transform.scale.clone();
          })

        }

        // Add image frame
        this.frame = new Entity();
        this.frame.setParent(parent);
        this.frame.addComponent(new GLTFShape("models/kiosk/image_frame.glb"));
        this.frame.addComponent(transform);
      }
    }
  }

  update(_dt: number) {
    if (this.modelPath.length > 0) {
      this.getComponent(Transform).rotate(Vector3.Up(), this.spinSpeed * _dt);
    }
  }

  hide() {
    this.getComponent(ScaleSpringComponent).targetScale = new Vector3(0, 0, 0);
  }

  show() {
    this.getComponent(ScaleSpringComponent).targetScale = this.originalScale;
  }
}

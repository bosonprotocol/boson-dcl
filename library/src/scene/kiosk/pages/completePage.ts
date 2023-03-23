import { ScaleSpringComponent } from "../animation/ScaleSpringComponent";
import { Helper } from "../helper";
import { Kiosk } from "../kiosk";
import { Separator } from "../UIComponents/separator";

export class CompletePage {
  kiosk: Kiosk;

  productData: any = undefined;
  parent: Entity = new Entity();

  whiteBackgroundBox: Entity = new Entity();
  whiteBackgroundMat: Material = new Material();

  successTitle: Entity = new Entity();
  successTitleText: TextShape;

  errorTitle: Entity = new Entity();
  errorTitleText: TextShape;

  htrEntity: Entity = new Entity();
  htrMat: Material = new Material();
  htrTexture: Texture;

  logoEntity: Entity = new Entity();
  logoMat: Material = new Material();
  logoTexture: Texture;

  successEntity: Entity = new Entity();
  successMat: Material = new Material();
  successTexture: Texture;

  errorEntity: Entity = new Entity();
  errorMat: Material = new Material();
  errorTexture: Texture;

  etherScanLinkClickBox: Entity = new Entity();
  openSeaLinkClickBox: Entity = new Entity();
  redeemLinkClickBox: Entity = new Entity();

  constructor(_kiosk: Kiosk, _parent: Entity, _productData: any) {
    this.kiosk = _kiosk;
    this.productData = _productData;

    // Parent
    this.parent = new Entity();
    this.parent.setParent(_parent);
    this.parent.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0),
        scale: new Vector3(0, 0, 0),
      })
    );

    // White background Box
    this.whiteBackgroundBox.addComponent(new PlaneShape());
    this.whiteBackgroundBox.setParent(this.parent);
    this.whiteBackgroundBox.addComponent(
      new Transform({
        position: new Vector3(0, -0.1, -0.008),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(2.6, 1.9, 0.01),
      })
    );
    this.whiteBackgroundMat = new Material();
    this.whiteBackgroundMat.emissiveIntensity = 1;
    this.whiteBackgroundMat.emissiveColor = Color3.White();
    this.whiteBackgroundBox.addComponent(this.whiteBackgroundMat);

    // Add spring
    this.parent.addComponent(new ScaleSpringComponent(120, 10));

    // Success title
    this.successTitleText = new TextShape(
      "You have successfully committed to this item and will receive an NFT\nVoucher that can be transferred, sold or used to redeem the item."
    );
    this.successTitleText.color = Color3.Black();
    this.successTitleText.fontSize = 7;
    this.successTitleText.outlineColor = Color3.Black();
    this.successTitleText.outlineWidth = 0.2;
    this.successTitle.addComponent(this.successTitleText);
    this.successTitle.setParent(this.parent);
    this.successTitle.addComponent(
      new Transform({
        position: new Vector3(0, 0.2, -0.0075),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    // Error title
    this.errorTitleText = new TextShape("");
    this.errorTitleText.color = Color3.Black();
    this.errorTitleText.fontSize = 7;
    this.errorTitleText.outlineColor = Color3.Black();
    this.errorTitleText.outlineWidth = 0.2;
    this.errorTitle.addComponent(this.errorTitleText);
    this.errorTitle.setParent(this.parent);
    this.errorTitle.addComponent(
      new Transform({
        position: new Vector3(0, 0.2, -0.0085),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    // Hold/Transfer/Redeem
    this.htrEntity = new Entity();
    this.htrEntity.addComponent(new PlaneShape());
    this.htrEntity.setParent(this.parent);
    this.htrEntity.addComponent(
      new Transform({
        position: new Vector3(0, -0.4, -0.0082),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.942 * 2.75, 0.301 * 2.75, 0.01),
      })
    );

    this.htrMat = new Material();
    this.htrTexture = new Texture("images/kiosk/ui/hold_transfer_redeem.png", {
      hasAlpha: false,
    });

    this.htrMat.albedoTexture = this.htrTexture;
    this.htrMat.emissiveIntensity = 1;
    this.htrMat.emissiveColor = Color3.White();
    this.htrMat.emissiveTexture = this.htrTexture;
    this.htrEntity.addComponent(this.htrMat);

    new Separator(
      this.parent,
      new Transform({
        position: new Vector3(0, -0.85, -0.0085),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(2.6, 0.007, 0.01),
      })
    );

    // Boson Logo
    this.logoEntity = new Entity();
    this.logoEntity.addComponent(new PlaneShape());
    this.logoEntity.setParent(this.parent);
    this.logoEntity.addComponent(
      new Transform({
        position: new Vector3(0, -0.95, -0.0085),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.435, 0.103, 0.01),
      })
    );

    this.logoMat = new Material();
    this.logoTexture = new Texture("images/kiosk/ui/boson_logo_black.png", {
      hasAlpha: true,
    });

    this.logoMat.albedoTexture = this.logoTexture;
    this.logoMat.emissiveIntensity = 1;
    this.logoMat.emissiveColor = Color3.White();
    this.logoMat.emissiveTexture = this.logoTexture;
    this.logoMat.transparencyMode = 1;
    this.logoEntity.addComponent(this.logoMat);

    // Success Image
    this.successEntity = new Entity();
    this.successEntity.addComponent(new PlaneShape());
    this.successEntity.setParent(this.parent);
    this.successEntity.addComponent(
      new Transform({
        position: new Vector3(0, 0.55, -0.0085),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.209 * 1.5, 0.216 * 1.5, 0.01),
      })
    );

    this.successMat = new Material();
    this.successTexture = new Texture(
      "images/kiosk/ui/transaction_success.png",
      {
        hasAlpha: true,
      }
    );

    this.successMat.albedoTexture = this.successTexture;
    this.successMat.emissiveIntensity = 1;
    this.successMat.emissiveColor = Color3.White();
    this.successMat.emissiveTexture = this.successTexture;
    this.successMat.transparencyMode = 1;
    this.successEntity.addComponent(this.successMat);

    // Error Image
    this.errorEntity = new Entity();
    this.errorEntity.addComponent(new PlaneShape());
    this.errorEntity.setParent(this.parent);
    this.errorEntity.addComponent(
      new Transform({
        position: new Vector3(0, 0.55, -0.0085),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.214 * 1.5, 0.216 * 1.5, 0.01),
      })
    );

    this.errorMat = new Material();
    this.errorTexture = new Texture("images/kiosk/ui/transaction_error.png", {
      hasAlpha: true,
    });

    this.errorMat.albedoTexture = this.errorTexture;
    this.errorMat.emissiveIntensity = 1;
    this.errorMat.emissiveColor = Color3.White();
    this.errorMat.emissiveTexture = this.errorTexture;
    this.errorMat.transparencyMode = 1;
    this.errorEntity.addComponent(this.errorMat);

    // click boxes
    this.etherScanLinkClickBox.setParent(this.parent);
    this.etherScanLinkClickBox.addComponent(new PlaneShape());
    this.etherScanLinkClickBox.addComponent(
      new Transform({
        position: new Vector3(-0.96, -0.645, -0.0085),
        scale: new Vector3(0.52, 0.16, 0.01),
      })
    );

    this.etherScanLinkClickBox.addComponent(Kiosk.alphaMat as Material);
    this.etherScanLinkClickBox.addComponent(
      new OnPointerDown(
        () => {
          openExternalURL("https://etherscan.io/");
        },
        {
          hoverText: "Etherscan",
        }
      )
    );

    this.openSeaLinkClickBox.setParent(this.parent);
    this.openSeaLinkClickBox.addComponent(new PlaneShape());
    this.openSeaLinkClickBox.addComponent(
      new Transform({
        position: new Vector3(-0.097, -0.645, -0.0085),
        scale: new Vector3(0.52, 0.16, 0.01),
      })
    );

    this.openSeaLinkClickBox.addComponent(Kiosk.alphaMat as Material);
    this.openSeaLinkClickBox.addComponent(
      new OnPointerDown(
        () => {
          openExternalURL("https://opensea.io/");
        },
        {
          hoverText: "OpenSea",
        }
      )
    );

    this.redeemLinkClickBox.setParent(this.parent);
    this.redeemLinkClickBox.addComponent(new PlaneShape());
    this.redeemLinkClickBox.addComponent(
      new Transform({
        position: new Vector3(0.77, -0.645, -0.0085),
        scale: new Vector3(0.52, 0.16, 0.01),
      })
    );

    this.redeemLinkClickBox.addComponent(Kiosk.alphaMat as Material);
    this.redeemLinkClickBox.addComponent(
      new OnPointerDown(
        () => {
          openExternalURL("https://bosonapp.io/");
        },
        {
          hoverText: "Redeem",
        }
      )
    );
  }

  show(_success: boolean, data: any) {
    if (_success) {
      // Success
      Helper.showAllEntities([
        this.successEntity,
        this.successTitle,
        this.htrEntity,
      ]);
      Helper.hideAllEntities([this.errorEntity, this.errorTitle]);

      // Reload product
      this.kiosk.loadProduct();
    } else {
      // Error
      this.errorTitle.getComponent(TextShape).value =
        Helper.addNewLinesInString(data.toString(), 70,8);

      Helper.hideAllEntities([
        this.successEntity,
        this.successTitle,
        this.htrEntity,
      ]);
      Helper.showAllEntities([this.errorEntity, this.errorTitle]);
    }
    this.parent.getComponent(ScaleSpringComponent).targetScale = new Vector3(
      1,
      1,
      1
    );
  }

  hide() {
    this.parent.getComponent(ScaleSpringComponent).targetScale = new Vector3(
      0,
      0,
      0
    );
  }
}

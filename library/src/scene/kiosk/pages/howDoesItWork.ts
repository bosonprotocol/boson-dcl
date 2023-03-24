import { ScaleSpringComponent } from "../animation/ScaleSpringComponent";
import { Helper } from "../helper";
import { Kiosk } from "../kiosk";
import { DelayedTask } from "../tasks/DelayedTask";

export class HowDoesItWork {
  kiosk: Kiosk;
  parent: Entity;
  backButtonEntity: Entity = new Entity();
  backButtonMat: Material = new Material();
  backButtonTexture: Texture;

  backgroundWidget: Entity = new Entity();
  backGroundMat: Material = new Material();
  backGroundTexture: Texture;

  backgroundImageEntity: Entity = new Entity();
  backgroundImageMat: Material = new Material();
  backgroundImageTexture: Texture;

  learnMoreClickBox: Entity = new Entity();

  // etherScanLinkClickBox: Entity = new Entity();
  // openSeaLinkClickBox: Entity = new Entity();
  // redeemLinkClickBox: Entity = new Entity();

  constructor(_kiosk: Kiosk, _parent: Entity) {
    this.kiosk = _kiosk;
    this.parent = new Entity();
    this.parent.setParent(_parent);
    this.parent.addComponent(new Transform({
      scale:new Vector3(0,0,0)
    }));

    // Back Arrow
    this.backButtonEntity = new Entity();
    this.backButtonEntity.addComponent(new PlaneShape());
    this.backButtonEntity.setParent(this.parent);
    this.backButtonEntity.addComponent(
      new Transform({
        position: new Vector3(-1.2, 0.95, -0.0035),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.07, 0.07, 0.01),
      })
    );
    this.backButtonEntity.addComponent(
      new OnPointerDown(
        () => {
          // Left align product title
          if (this.kiosk.productPage != undefined) {
            this.kiosk.productPage.productName.getComponent(
              Transform
            ).position.x = -1;
            this.kiosk.productPage.productName.getComponent(
              TextShape
            ).hTextAlign = "left";
          }
          this.hide();
        },
        {
          hoverText: "Back",
        }
      )
    );
    if (this.backButtonEntity.isAddedToEngine()) {
      engine.removeEntity(this.backButtonEntity);
    }

    this.backButtonMat = new Material();
    this.backButtonTexture = new Texture("images/kiosk/ui/back_arrow.png", {
      hasAlpha: true,
    });

    this.backButtonMat.albedoTexture = this.backButtonTexture;
    this.backButtonMat.emissiveIntensity = 0.5;
    this.backButtonMat.emissiveColor = Color3.White();
    this.backButtonMat.emissiveTexture = this.backButtonTexture;
    this.backButtonMat.transparencyMode = 2;
    this.backButtonEntity.addComponent(this.backButtonMat);

    // Add white header background
    this.backgroundWidget = new Entity();
    this.backgroundWidget.addComponent(new PlaneShape());
    this.backgroundWidget.setParent(this.parent);
    this.backgroundWidget.addComponent(
      new Transform({
        position: new Vector3(0, 0, -0.003),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(2.6, 2.1, 2),
      })
    );
    this.backGroundMat = new Material();
    this.backGroundTexture = new Texture(
      "images/kiosk/ui/widget_background_white.png",
      { hasAlpha: true }
    );

    this.backGroundMat.albedoTexture = this.backGroundTexture;
    this.backGroundMat.emissiveIntensity = 1;
    this.backGroundMat.emissiveColor = Color3.White();
    this.backGroundMat.emissiveTexture = this.backGroundTexture;
    this.backGroundMat.transparencyMode = 1;
    this.backgroundWidget.addComponent(this.backGroundMat);

    // Background image
    this.backgroundImageEntity = new Entity();
    const backgroundScale = 1.65;
    this.backgroundImageEntity.addComponent(new PlaneShape());
    this.backgroundImageEntity.setParent(this.parent);
    this.backgroundImageEntity.addComponent(
      new Transform({
        position: new Vector3(0, 0, -0.035),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(
          1.543 * backgroundScale,
          0.972 * backgroundScale,
          0.1
        ),
      })
    );

    this.backgroundImageMat = new Material();
    this.backgroundImageTexture = new Texture(
      "images/kiosk/ui/how_does_it_work.jpg",
      {
        hasAlpha: false,
      }
    );

    this.backgroundImageMat.albedoTexture = this.backgroundImageTexture;
    this.backgroundImageMat.emissiveIntensity = 0.5;
    this.backgroundImageMat.emissiveColor = Color3.White();
    this.backgroundImageMat.emissiveTexture = this.backgroundImageTexture;
    this.backgroundImageEntity.addComponent(this.backgroundImageMat);

    // Learn more click box
    this.learnMoreClickBox.setParent(this.parent);
    this.learnMoreClickBox.addComponent(new PlaneShape());
    this.learnMoreClickBox.addComponent(
      new Transform({
        position: new Vector3(-1.04, -0.64, -0.04),
        scale: new Vector3(0.27, 0.06, 0.01),
      })
    );

    this.learnMoreClickBox.addComponent(Kiosk.alphaMat as Material);
    this.learnMoreClickBox.addComponent(
      new OnPointerDown(
        () => {
          openExternalURL("https://www.bosonprotocol.io/technology/");
        },
        {
          hoverText: "Learn more",
        }
      )
    );

    // click boxs
    // this.etherScanLinkClickBox.setParent(this.parent);
    // this.etherScanLinkClickBox.addComponent(new PlaneShape());
    // this.etherScanLinkClickBox.addComponent(
    //   new Transform({
    //     position: new Vector3(-0.82, 0.13, -0.032),
    //     scale: new Vector3(0.75, 0.5, 0.01),
    //   })
    // );

    // this.etherScanLinkClickBox.addComponent(Kiosk.alphaMat as Material);
    // this.etherScanLinkClickBox.addComponent(
    //   new OnPointerDown(
    //     () => {
    //       openExternalURL("https://etherscan.io/");
    //     },
    //     {
    //       hoverText: "Etherscan",
    //     }
    //   )
    // );

    // this.openSeaLinkClickBox.setParent(this.parent);
    // this.openSeaLinkClickBox.addComponent(new PlaneShape());
    // this.openSeaLinkClickBox.addComponent(
    //   new Transform({
    //     position: new Vector3(0.01, 0.13, -0.032),
    //     scale: new Vector3(0.75, 0.5, 0.01),
    //   })
    // );

    // this.openSeaLinkClickBox.addComponent(Kiosk.alphaMat as Material);
    // this.openSeaLinkClickBox.addComponent(
    //   new OnPointerDown(
    //     () => {
    //       openExternalURL("https://opensea.io/");
    //     },
    //     {
    //       hoverText: "OpenSea",
    //     }
    //   )
    // );

    // this.redeemLinkClickBox.setParent(this.parent);
    // this.redeemLinkClickBox.addComponent(new PlaneShape());
    // this.redeemLinkClickBox.addComponent(
    //   new Transform({
    //     position: new Vector3(0.83, 0.13, -0.032),
    //     scale: new Vector3(0.75, 0.5, 0.01),
    //   })
    // );

    // this.redeemLinkClickBox.addComponent(Kiosk.alphaMat as Material);
    // this.redeemLinkClickBox.addComponent(
    //   new OnPointerDown(
    //     () => {
    //       openExternalURL("https://bosonapp.io/");
    //     },
    //     {
    //       hoverText: "Redeem",
    //     }
    //   )
    // );

    // Add spring
    this.parent.addComponent(new ScaleSpringComponent(120, 10));
  }

  public show() {
    Helper.showAllEntities([this.backgroundImageEntity, this.backButtonEntity]);

    // Center product title
    if (this.kiosk.productPage != undefined) {
      this.kiosk.productPage.productName.getComponent(Transform).position.x = 0;
      this.kiosk.productPage.productName.getComponent(TextShape).hTextAlign =
        "center";
    }
    this.parent.getComponent(ScaleSpringComponent).targetScale = new Vector3(
      1,
      1,
      1
    );
  }

  public hide() {
    new DelayedTask(() => {
      Helper.hideAllEntities([
        this.backButtonEntity,
        this.backgroundImageEntity,
      ]);
    }, 1);
    this.parent.getComponent(ScaleSpringComponent).targetScale = new Vector3(
      0,
      0,
      0
    );
  }
}

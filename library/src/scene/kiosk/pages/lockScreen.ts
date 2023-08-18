import { AbstractKiosk } from "../abstractKiosk";
import { ScaleSpringComponent } from "../animation/ScaleSpringComponent";
import { eGateStateEnum } from "../enums";
import { Helper } from "../helper";
import { Kiosk } from "../kiosk";
import { DelayedTask } from "../tasks/DelayedTask";
import { HowItWorksLink } from "../UIComponents/howItWorksLink";
import { LockComponent } from "../UIComponents/lockComponent";
import { TokenGatedOffer } from "../UIComponents/tokenGatedOffer";

export class LockScreen {
  productData: any = undefined;

  kiosk: Kiosk | AbstractKiosk;

  parent: Entity = new Entity();

  backgroundWidget: Entity = new Entity();
  backGroundMat: Material = new Material();
  backGroundTexture: Texture | undefined;

  productItemType: Entity = new Entity();
  productItemTypeText: TextShape | undefined;

  productName: Entity = new Entity();
  productNameText: TextShape | undefined;

  lockLogoEntity: Entity = new Entity();
  lockLogoMat: Material = new Material();
  lockLogoTexture: Texture | undefined;

  whiteBoxEntity: Entity = new Entity();
  whiteBoxMat: Material = new Material();

  proceedButtonEntity: Entity = new Entity();
  proceedButtonMat: Material = new Material();
  proceedButtonTexture: Texture | undefined;

  howItWorksLink: Entity;

  // Currency symbol
  currencySymbolImage: Entity = new Entity();
  currencySymbolMat: Material = new Material();

  // Product price
  productPrice: Entity = new Entity();
  productPriceText: TextShape | undefined;
  productDollarPrice: Entity = new Entity();
  productDollarPriceText: TextShape | undefined;

  // Gate information. Quest status, low price, informs of login etc
  gateInfo: Entity = new Entity();
  gateInfoText: TextShape;

  tokenGatedOffer: TokenGatedOffer | undefined;

  // close button

  closeButtonEntity: Entity = new Entity();
  closeButtonMat: Material = new Material();
  closeButtonTexture: Texture | undefined;

  // Lock Component
  public lockComponent: LockComponent | undefined;

  hideTask: DelayedTask;
  hideTaskFirstRun: boolean = true

  constructor(_kiosk: Kiosk | AbstractKiosk, _productData: any) {
    this.kiosk = _kiosk;

    // Data
    this.productData = _productData;

    // Parent
    this.parent = new Entity();
    this.parent.setParent(_kiosk.parent);
    this.parent.addComponent(
      new Transform({
        position: new Vector3(0, 2, 0),
        scale: new Vector3(0, 0, 0),
      })
    );

    // Background
    this.backgroundWidget = new Entity();
    this.backgroundWidget.addComponent(new PlaneShape());
    this.backgroundWidget.setParent(this.parent);
    this.backgroundWidget.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0.02),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(1.2, 2.4, 2),
      })
    );

    this.backGroundMat = new Material();
    this.backGroundTexture = new Texture(
      "images/kiosk/ui/widget_background.png",
      {
        hasAlpha: true,
      }
    );

    this.backGroundMat.albedoTexture = this.backGroundTexture;
    this.backGroundMat.emissiveIntensity = 1;
    this.backGroundMat.emissiveColor = Color3.White();
    this.backGroundMat.emissiveTexture = this.backGroundTexture;
    this.backGroundMat.transparencyMode = 1;
    this.backgroundWidget.addComponent(this.backGroundMat);

    // Close Button
    this.closeButtonEntity = new Entity();
    this.closeButtonEntity.addComponent(new PlaneShape());
    this.closeButtonEntity.setParent(this.parent);
    this.closeButtonEntity.addComponent(
      new Transform({
        position: new Vector3(0.5, 1.1, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.05, 0.05, 0.01),
      })
    );
    this.closeButtonEntity.addComponent(
      new OnPointerDown(
        () => {
          this.hide();
          if (this.kiosk != undefined) {
            this.kiosk.uiOpen = false;
            this.kiosk.showDisplayProduct();
          }
        },
        {
          hoverText: "Close",
        }
      )
    );

    this.closeButtonMat = new Material();
    this.closeButtonTexture = new Texture("images/kiosk/ui/close_btn.png", {
      hasAlpha: true,
    });

    this.closeButtonMat.albedoTexture = this.closeButtonTexture;
    this.closeButtonMat.emissiveIntensity = 0.5;
    this.closeButtonMat.emissiveColor = Color3.White();
    this.closeButtonMat.emissiveTexture = this.closeButtonTexture;
    this.closeButtonMat.transparencyMode = 2;
    this.closeButtonEntity.addComponent(this.closeButtonMat);

    // Product Type
    this.productItemType.setParent(this.parent);
    this.productItemType.addComponent(
      new Transform({
        position: new Vector3(0, 1.05, 0),
        scale: new Vector3(0.1, 0.1, 0.1),
      })
    );

    this.productItemTypeText = new TextShape(
      this.productData.metadata.product.offerCategory + " ITEM"
    );
    this.productItemTypeText.fontSize = 7;
    this.productItemType.addComponent(this.productItemTypeText);

    // Product Name
    this.productName.setParent(this.parent);
    this.productName.addComponent(
      new Transform({
        position: new Vector3(0, 0.95, 0),
        scale: new Vector3(0.1, 0.1, 0.1),
      })
    );
    this.productNameText = new TextShape(
      Helper.addNewLinesInString(this.productData.metadata.product.title, 32, 1)
    );
    this.productNameText.fontSize = 7;
    this.productNameText.vTextAlign = "top"
    this.productName.addComponent(this.productNameText);

    // Boson Logo
    this.lockLogoEntity = new Entity();
    this.lockLogoEntity.addComponent(new PlaneShape());
    this.lockLogoEntity.setParent(this.parent);
    this.lockLogoEntity.addComponent(
      new Transform({
        position: new Vector3(0, -0.9, 0),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.494, 0.180, 0.01),
      })
    );

    this.lockLogoMat = new Material();
    this.lockLogoTexture = new Texture("images/kiosk/ui/lock_logo.png", {
      hasAlpha: true,
    });

    this.lockLogoMat.albedoTexture = this.lockLogoTexture;
    this.lockLogoMat.emissiveIntensity = 1;
    this.lockLogoMat.emissiveColor = Color3.White();
    this.lockLogoMat.emissiveTexture = this.lockLogoTexture;
    this.lockLogoMat.transparencyMode = 1;
    this.lockLogoEntity.addComponent(this.lockLogoMat);

    // White Box
    this.whiteBoxEntity = new Entity();
    this.whiteBoxEntity.addComponent(new PlaneShape());
    this.whiteBoxEntity.setParent(this.parent);


    this.whiteBoxEntity.addComponent(
      new Transform({
        position: new Vector3(0, 0.2, 0),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(1, 0.8, 0.01),
      })
    )

    this.whiteBoxMat = new Material();
    this.whiteBoxMat.emissiveIntensity = 1;
    this.whiteBoxMat.emissiveColor = Color3.White();
    this.whiteBoxEntity.addComponent(this.whiteBoxMat);

    // Proceed Button
    this.proceedButtonEntity = new Entity();
    this.proceedButtonEntity.addComponent(new PlaneShape());
    this.proceedButtonEntity.setParent(this.parent);
    this.proceedButtonEntity.addComponent(
      new Transform({
        position: new Vector3(-0.226, -0.1, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.775 / 1.7, 0.224 / 1.7, 0.01),
      })
    );
    this.proceedButtonEntity.addComponent(
      new OnPointerDown(() => {
        this.hide();
        this.kiosk.showProduct(this.productData);
      })
    );

    this.proceedButtonMat = new Material();
    this.proceedButtonTexture = new Texture("images/kiosk/ui/proceed.png", {
      hasAlpha: false,
    });

    this.proceedButtonMat.albedoTexture = this.proceedButtonTexture;
    this.proceedButtonMat.emissiveIntensity = 0.5;
    this.proceedButtonMat.emissiveColor = Color3.White();
    this.proceedButtonMat.emissiveTexture = this.proceedButtonTexture;
    this.proceedButtonEntity.addComponent(this.proceedButtonMat);

    // Eth symbol
    this.currencySymbolImage.addComponent(new PlaneShape());
    this.currencySymbolImage.setParent(this.parent);
    this.currencySymbolImage.addComponent(
      new Transform({
        position: new Vector3(-0.41, 0.45, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.1, 0.1, 0.01),
      })
    );

    this.currencySymbolMat = new Material();
    this.currencySymbolMat.albedoTexture = Helper.getCurrencyTexture(
      this.kiosk.productCurrency
    );
    this.currencySymbolMat.emissiveIntensity = 1;
    this.currencySymbolMat.emissiveColor = Color3.White();
    this.currencySymbolMat.emissiveTexture = Helper.getCurrencyTexture(
      this.kiosk.productCurrency
    );
    this.currencySymbolMat.transparencyMode = 2;
    this.currencySymbolImage.addComponent(this.currencySymbolMat);

    // Product price
    const tokenDecimals = Helper.getTokenDecimals(
      this.productData.exchangeToken.address
    );
    this.productPriceText = new TextShape(
      Helper.priceTransform(this.productData.price, tokenDecimals)
    );
    this.productPriceText.color = Color3.Black();
    this.productPriceText.fontSize = 20;
    this.productPriceText.hTextAlign = "left";
    this.productPriceText.outlineWidth = 0.1;
    this.productPriceText.outlineColor = Color3.Black();
    this.productPrice.addComponent(this.productPriceText);
    this.productPrice.setParent(this.parent);
    this.productPrice.addComponent(
      new Transform({
        position: new Vector3(-0.33, 0.45, -0.002),
        scale: new Vector3(0.05, 0.05, 0.05),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    this.productDollarPriceText = new TextShape("Loading");
    this.productDollarPriceText.color = Color3.Gray();
    this.productDollarPriceText.fontSize = 10;
    this.productDollarPriceText.hTextAlign = "left";
    this.productDollarPriceText.outlineWidth = 0.1;
    this.productDollarPriceText.outlineColor = Color3.Gray();
    this.productDollarPrice.addComponent(this.productDollarPriceText);
    this.productDollarPrice.setParent(this.parent);
    this.productDollarPrice.addComponent(
      new Transform({
        position: new Vector3(-0.33, 0.37, -0.002),
        scale: new Vector3(0.05, 0.05, 0.05),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    // Gate
    this.gateInfoText = new TextShape("");
    this.gateInfoText.color = Color3.FromHexString("#556072");
    this.gateInfoText.fontSize = 10;
    this.gateInfoText.outlineWidth = 0.2;
    this.gateInfoText.outlineColor = Color3.FromHexString("#556072");
    this.gateInfo.addComponent(this.gateInfoText);
    this.gateInfo.setParent(this.parent);
    this.gateInfo.addComponent(
      new Transform({
        position: new Vector3(0.24, 0.325, -0.002),
        scale: new Vector3(0.05, 0.05, 0.05),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    this.setGating();

    if (this.kiosk.gatedTokens.length > 0) {
      this.tokenGatedOffer = new TokenGatedOffer(
        _kiosk,
        this.parent,
        new Transform()
      );

      this.lockComponent = new LockComponent(
        this.productData,
        this.parent,
        new Transform({
          position: new Vector3(-0.35, 0.15, -0.003),
          rotation: Quaternion.Euler(180, 180, 0),
          scale: new Vector3(0.15, 0.15, 0.01),
        })
      );
    }

    // How It Works
    this.howItWorksLink = new HowItWorksLink(
      this.kiosk,
      this.parent,
      new Transform({
        position: new Vector3(0.237, -0.1, -0.0025),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    // Add spring
    this.parent.addComponent(new ScaleSpringComponent(120, 10));

    this.hideTask = new DelayedTask(() => {
      if (this.hideTaskFirstRun) {
        return
      } else {
        Helper.hideAllEntities([
          this.backgroundWidget,
          this.productItemType,
          this.productName,
          this.lockLogoEntity,
          this.whiteBoxEntity,
          this.proceedButtonEntity,
          this.howItWorksLink,
          this.gateInfo,
          this.currencySymbolImage,
          this.productPrice,
          this.closeButtonEntity,
        ]);
        if (this.tokenGatedOffer != undefined) {
          this.tokenGatedOffer.hide();
        }
      }
    }, 0);

    // No gating formatting
    if (this.kiosk.gatedTokens.length < 1) {
      this.backgroundWidget.getComponent(Transform).scale.y = 1.8
      this.whiteBoxEntity.getComponent(Transform).scale.y = 0.5

      this.closeButtonEntity.getComponent(Transform).position.y -= 0.27
      this.productItemType.getComponent(Transform).position.y -= 0.27
      this.productName.getComponent(Transform).position.y -= 0.27

      this.currencySymbolImage.getComponent(Transform).position.y -= 0.1
      this.productPrice.getComponent(Transform).position.y -= 0.1
      this.productDollarPrice.getComponent(Transform).position.y -= 0.1

      this.proceedButtonEntity.getComponent(Transform).position.y += 0.15
      this.howItWorksLink.getComponent(Transform).position.y += 0.15
      this.lockLogoEntity.getComponent(Transform).position.y += 0.2
    }
  }

  setGating() {
    let gatingText = "";
    switch (this.kiosk.gateState) {
      case eGateStateEnum.noMessage:
        gatingText = "";
        break;
      case eGateStateEnum.login:
        gatingText = "Log In to view low\nprice availability";
        break;
      case eGateStateEnum.questInformation:
        gatingText = this.kiosk.customQuestInformation;
        break;
      case eGateStateEnum.questCompleted:
        gatingText = "Quest completed\nLow price unlocked";
        break;
    }

    if (this.gateInfoText != undefined) {
      this.gateInfoText.value = gatingText;
    }
  }

  show() {
    this.hideTask.cancel();

    Helper.showAllEntities([
      this.backgroundWidget,
      this.productItemType,
      this.productName,
      this.lockLogoEntity,
      this.whiteBoxEntity,
      this.proceedButtonEntity,
      this.howItWorksLink,
      this.gateInfo,
      this.currencySymbolImage,
      this.productPrice,
      this.closeButtonEntity,
    ]);

    if (this.tokenGatedOffer != undefined) {
      this.tokenGatedOffer.show();
    }

    // Set gate text
    if(this.kiosk.gatedTokens.length > 0){
      this.gateInfo.getComponent(Transform).position.y = 0.45
      this.gateInfo.getComponent(Transform).position.x = 0.2
      this.gateInfoText.fontSize = 14
      if(this.lockComponent?.locked){
        this.gateInfoText.value = "Locked"
      } else {
        this.gateInfoText.value = "Unlocked"
      }
    } else {
      this.gateInfoText.value = "Proceed to view\nproduct details"
      this.gateInfo.getComponent(Transform).position.y = 0.325
      this.gateInfo.getComponent(Transform).position.x = 0.24
      this.gateInfoText.fontSize = 10
    }

    this.parent.getComponent(ScaleSpringComponent).targetScale = new Vector3(
      1,
      1,
      1
    );
  }

  hide() {
    if (this.hideTask != undefined) {
      this.hideTask.restart(1);
    }

    this.parent.getComponent(ScaleSpringComponent).targetScale = new Vector3(
      0,
      0,
      0
    );
  }
}

import { Helper } from "./../helper";
import { Kiosk } from "./../kiosk";

export class DescriptionPage {
  kiosk: Kiosk;

  productData: any = undefined;
  parent: Entity;

  greyTab: Entity = new Entity();
  greyTabMat: Material = new Material();

  whiteBackgroundBox: Entity = new Entity();
  whiteBackgroundMat: Material = new Material();

  backButtonEntity: Entity = new Entity();
  backButtonMat: Material = new Material();
  backButtonTexture: Texture;

  //// Tabs ////

  // tab 1 - Product Description
  tab1: Entity = new Entity();
  tab1Text: TextShape;
  tab1ClickBox: Entity = new Entity();

  // tab 2 - About the creator
  tab2: Entity = new Entity();
  tab2Text: TextShape;
  tab2ClickBox: Entity = new Entity();

  // tab 3 - Shipping & Inventory
  tab3: Entity = new Entity();
  tab3Text: TextShape;
  tab3ClickBox: Entity = new Entity();

  // tab underline to show active tab
  tabUnderline: Entity = new Entity();
  tabUnderlineText: TextShape;

  //// Product description page ////

  // Product description title
  productDescriptionTitle: Entity = new Entity();
  productDescriptionTitleText: TextShape;

  // Product description
  productDataInfo: Entity = new Entity();
  productDataInfoText: TextShape;
  //// About the creator page ////

  // About the creator title
  aboutTheCreatorTitle: Entity = new Entity();
  aboutTheCreatorTitleText: TextShape;

  // Creator information
  aboutTheCreatorInfo: Entity = new Entity();
  aboutTheCreatorTextInfo: TextShape;

  //// Shipping & Inventory page ////

  // Shipping & Inventory titles
  ShippingAndInventoryTitle: Entity = new Entity();
  ShippingAndInventoryTitleText: TextShape;

  ShippingAndInventoryInfo: Entity = new Entity();
  ShippingAndInventoryInfoText: TextShape;

  ShippingAndInventoryShippingTitle: Entity = new Entity();
  ShippingAndInventoryShippingTitleText: TextShape;

  ShippingAndInventoryShippingInfo: Entity = new Entity();
  ShippingAndInventoryShippingInfoText: TextShape;

  constructor(_kiosk: Kiosk, _parent: Entity, _productData: any) {
    // Parent
    this.parent = new Entity();
    this.parent.setParent(_parent);
    this.parent.addComponent(new Transform());

    this.kiosk = _kiosk;
    this.productData = _productData;

    // White background Box
    this.whiteBackgroundBox.addComponent(new PlaneShape());
    this.whiteBackgroundBox.setParent(this.parent);
    this.whiteBackgroundBox.addComponent(
      new Transform({
        position: new Vector3(0, -0.1, -0.003),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(2.6, 1.9, 0.01),
      })
    );
    this.whiteBackgroundMat = new Material();
    this.whiteBackgroundMat.emissiveIntensity = 1;
    this.whiteBackgroundMat.emissiveColor = Color3.White();
    this.whiteBackgroundBox.addComponent(this.whiteBackgroundMat);

    // Grey Tab
    this.greyTab.addComponent(new PlaneShape());
    this.greyTab.setParent(this.parent);
    this.greyTab.addComponent(
      new Transform({
        position: new Vector3(0, 0.785, -0.0035),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(2.6, 0.15, 0.01),
      })
    );
    this.whiteBackgroundMat = new Material();
    this.whiteBackgroundMat.emissiveIntensity = 1;
    this.whiteBackgroundMat.emissiveColor = Color3.Gray();
    this.greyTab.addComponent(this.whiteBackgroundMat);

    // Back Arrow
    this.backButtonEntity = new Entity();
    this.backButtonEntity.addComponent(new PlaneShape());
    this.backButtonEntity.setParent(this.parent);
    this.backButtonEntity.addComponent(
      new Transform({
        position: new Vector3(-1.2, 0.95, -0.002),
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
          if (
            this.kiosk.productPage != undefined &&
            this.kiosk.productPage.lockComponent != undefined
          ) {
            this.kiosk.productPage?.lockComponent.show();
          }
        },
        {
          hoverText: "Back",
        }
      )
    );

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

    //// Tabs ////

    // tab 1 - Product Description
    this.tab1Text = new TextShape("Product Description");
    this.tab1Text.color = Color3.Black();
    this.tab1Text.fontSize = 6;
    this.tab1Text.outlineColor = Color3.Black();
    this.tab1Text.outlineWidth = 0.1;
    this.tab1.addComponent(this.tab1Text);
    this.tab1.setParent(this.parent);
    this.tab1.addComponent(
      new Transform({
        position: new Vector3(-0.9, 0.785, -0.004),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    this.tab1ClickBox.setParent(this.tab1);
    this.tab1ClickBox.addComponent(new PlaneShape());
    this.tab1ClickBox.addComponent(
      new Transform({
        scale: new Vector3(5.2, 1, 1),
      })
    );
    this.tab1ClickBox.addComponent(Kiosk.alphaMat as Material);
    this.tab1ClickBox.addComponent(
      new OnPointerDown(
        () => {
          this.showProductDescription();
        },
        {
          hoverText: "Product description",
        }
      )
    );

    // tab 2 - About the creator
    this.tab2Text = new TextShape("About the creator");
    this.tab2Text.color = Color3.Black();
    this.tab2Text.fontSize = 6;
    this.tab2Text.outlineColor = Color3.Black();
    this.tab2Text.outlineWidth = 0.1;
    this.tab2.addComponent(this.tab2Text);
    this.tab2.setParent(this.parent);
    this.tab2.addComponent(
      new Transform({
        position: new Vector3(-0.2, 0.785, -0.004),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    this.tab2ClickBox.setParent(this.tab2);
    this.tab2ClickBox.addComponent(new PlaneShape());
    this.tab2ClickBox.addComponent(
      new Transform({
        scale: new Vector3(5, 1, 1),
      })
    );
    this.tab2ClickBox.addComponent(Kiosk.alphaMat as Material);
    this.tab2ClickBox.addComponent(
      new OnPointerDown(
        () => {
          this.showAboutTheCreator();
        },
        {
          hoverText: "About the creator",
        }
      )
    );

    // tab 3 - Shipping & Inventory
    this.tab3Text = new TextShape("Shipping & Inventory");
    this.tab3Text.color = Color3.Black();
    this.tab3Text.fontSize = 6;
    this.tab3Text.outlineColor = Color3.Black();
    this.tab3Text.outlineWidth = 0.1;
    this.tab3.addComponent(this.tab3Text);
    this.tab3.setParent(this.parent);
    this.tab3.addComponent(
      new Transform({
        position: new Vector3(0.5, 0.785, -0.004),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    this.tab3ClickBox.setParent(this.tab3);
    this.tab3ClickBox.addComponent(new PlaneShape());
    this.tab3ClickBox.addComponent(
      new Transform({
        scale: new Vector3(5.5, 1, 1),
      })
    );
    this.tab3ClickBox.addComponent(Kiosk.alphaMat as Material);
    this.tab3ClickBox.addComponent(
      new OnPointerDown(
        () => {
          this.showShippingAndInventory();
        },
        {
          hoverText: "Shipping & Inventory",
        }
      )
    );

    // tab underline
    this.tabUnderlineText = new TextShape("______________");
    this.tabUnderlineText.color = Color3.Black();
    this.tabUnderlineText.fontSize = 8;
    this.tabUnderline.addComponent(this.tabUnderlineText);
    this.tabUnderline.setParent(this.parent);
    this.tabUnderline.addComponent(
      new Transform({
        position: new Vector3(0.5, 0.752, -0.004),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    //// Product description page ////
    this.productDescriptionTitleText = new TextShape("Product Data");
    this.productDescriptionTitleText.color = Color3.Black();
    this.productDescriptionTitleText.fontSize = 6;
    this.productDescriptionTitleText.outlineColor = Color3.Black();
    this.productDescriptionTitleText.outlineWidth = 0.2;
    this.productDescriptionTitleText.hTextAlign = "left";
    this.productDescriptionTitle.addComponent(this.productDescriptionTitleText);
    this.productDescriptionTitle.setParent(this.parent);
    this.productDescriptionTitle.addComponent(
      new Transform({
        position: new Vector3(-1.18, 0.55, -0.004),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );
    engine.removeEntity(this.productDescriptionTitle);

    this.productDataInfoText = new TextShape(
      Helper.addNewLinesInString(
      this.productData.metadata.product.description,
      85
      )
    );
    this.productDataInfoText.color = Color3.Black();
    this.productDataInfoText.fontSize = 6;
    this.productDataInfoText.outlineColor = Color3.Black();
    this.productDataInfoText.hTextAlign = "left";
    this.productDataInfoText.vTextAlign = "top";
    this.productDataInfoText.outlineWidth = 0.1;
    this.productDataInfo.addComponent(this.productDataInfoText);
    this.productDataInfo.setParent(this.parent);
    this.productDataInfo.addComponent(
      new Transform({
        position: new Vector3(-1.18, 0.35, -0.004),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );
    engine.removeEntity(this.productDataInfo);

    //// About the creator page ////
    this.aboutTheCreatorTitleText = new TextShape(
      "About the artist - " +
        this.productData.metadata.product.productV1Seller.name
    );
    this.aboutTheCreatorTitleText.color = Color3.Black();
    this.aboutTheCreatorTitleText.fontSize = 6;
    this.aboutTheCreatorTitleText.outlineColor = Color3.Black();
    this.aboutTheCreatorTitleText.outlineWidth = 0.2;
    this.aboutTheCreatorTitleText.hTextAlign = "left";
    this.aboutTheCreatorTitle.addComponent(this.aboutTheCreatorTitleText);
    this.aboutTheCreatorTitle.setParent(this.parent);
    this.aboutTheCreatorTitle.addComponent(
      new Transform({
        position: new Vector3(-1.18, 0.55, -0.004),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );
    engine.removeEntity(this.aboutTheCreatorTitle);

    this.aboutTheCreatorTextInfo = new TextShape(
      Helper.addNewLinesInString(
        this.productData.metadata.product.productV1Seller.description,
        85
      )
    );
    this.aboutTheCreatorTextInfo.color = Color3.Black();
    this.aboutTheCreatorTextInfo.fontSize = 6;
    this.aboutTheCreatorTextInfo.outlineColor = Color3.Black();
    this.aboutTheCreatorTextInfo.outlineWidth = 0.1;
    this.aboutTheCreatorTextInfo.hTextAlign = "left";
    this.aboutTheCreatorTextInfo.vTextAlign = "top";
    this.aboutTheCreatorInfo.addComponent(this.aboutTheCreatorTextInfo);
    this.aboutTheCreatorInfo.setParent(this.parent);
    this.aboutTheCreatorInfo.addComponent(
      new Transform({
        position: new Vector3(-1.18, 0.35, -0.004),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );
    engine.removeEntity(this.aboutTheCreatorInfo);

    //// Shipping & Inventory page ////
    this.ShippingAndInventoryTitleText = new TextShape("Inventory");
    this.ShippingAndInventoryTitleText.color = Color3.Black();
    this.ShippingAndInventoryTitleText.fontSize = 6;
    this.ShippingAndInventoryTitleText.outlineColor = Color3.Black();
    this.ShippingAndInventoryTitleText.outlineWidth = 0.2;
    this.ShippingAndInventoryTitleText.hTextAlign = "left";
    this.ShippingAndInventoryTitle.addComponent(
      this.ShippingAndInventoryTitleText
    );
    this.ShippingAndInventoryTitle.setParent(this.parent);
    this.ShippingAndInventoryTitle.addComponent(
      new Transform({
        position: new Vector3(-1.18, 0.55, -0.004),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );
    engine.removeEntity(this.ShippingAndInventoryTitle);

    this.ShippingAndInventoryInfoText = new TextShape(
      "Initial stock: " +
        this.productData.quantityInitial +
        "\n" +
        "Available stock: " +
        this.productData.quantityAvailable
    );
    this.ShippingAndInventoryInfoText.color = Color3.Black();
    this.ShippingAndInventoryInfoText.fontSize = 6;
    this.ShippingAndInventoryInfoText.outlineColor = Color3.Black();
    this.ShippingAndInventoryInfoText.outlineWidth = 0.1;
    this.ShippingAndInventoryInfoText.hTextAlign = "left";
    this.ShippingAndInventoryInfoText.vTextAlign = "top";
    this.ShippingAndInventoryInfo.addComponent(
      this.ShippingAndInventoryInfoText
    );
    this.ShippingAndInventoryInfo.setParent(this.parent);
    this.ShippingAndInventoryInfo.addComponent(
      new Transform({
        position: new Vector3(-1.18, 0.38, -0.004),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );
    engine.removeEntity(this.ShippingAndInventoryInfo);

    this.ShippingAndInventoryShippingTitleText = new TextShape(
      "Shipping information"
    );
    this.ShippingAndInventoryShippingTitleText.color = Color3.Black();
    this.ShippingAndInventoryShippingTitleText.fontSize = 6;
    this.ShippingAndInventoryShippingTitleText.outlineColor = Color3.Black();
    this.ShippingAndInventoryShippingTitleText.outlineWidth = 0.2;
    this.ShippingAndInventoryShippingTitleText.hTextAlign = "left";
    this.ShippingAndInventoryShippingTitle.addComponent(
      this.ShippingAndInventoryShippingTitleText
    );
    this.ShippingAndInventoryShippingTitle.setParent(this.parent);
    this.ShippingAndInventoryShippingTitle.addComponent(
      new Transform({
        position: new Vector3(-0.3, 0.55, -0.004),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );
    engine.removeEntity(this.ShippingAndInventoryShippingTitle);

    // Build up shipping text
    let shippingText =
      "Once redeemed expect a 2-4 week delivery worldwide\nfree shipping.\nTaxes & import duties are included in the price.\n\n\n";

    this.productData.metadata.shipping.supportedJurisdictions.forEach(
      (shipping: { label: string; deliveryTime: string }) => {
        shippingText += shipping.label + ": " + shipping.deliveryTime + "\n\n";
      }
    );

    this.ShippingAndInventoryShippingInfoText = new TextShape(shippingText);
    this.ShippingAndInventoryShippingInfoText.color = Color3.Black();
    this.ShippingAndInventoryShippingInfoText.fontSize = 6;
    this.ShippingAndInventoryShippingInfoText.outlineColor = Color3.Black();
    this.ShippingAndInventoryShippingInfoText.outlineWidth = 0.1;
    this.ShippingAndInventoryShippingInfoText.hTextAlign = "left";
    this.ShippingAndInventoryShippingInfoText.vTextAlign = "top";
    this.ShippingAndInventoryShippingInfo.addComponent(
      this.ShippingAndInventoryShippingInfoText
    );
    this.ShippingAndInventoryShippingInfo.setParent(this.parent);
    this.ShippingAndInventoryShippingInfo.addComponent(
      new Transform({
        position: new Vector3(-0.3, 0.45, -0.004),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );
    engine.removeEntity(this.ShippingAndInventoryShippingInfo);

    this.hide();
  }

  public updateStock(_intialStock: number, _currentStock: number) {
    if (this.ShippingAndInventoryInfoText != undefined) {
      this.ShippingAndInventoryInfoText.value =
        "Initial stock: " +
        _intialStock +
        "\n" +
        "Available stock: " +
        _currentStock;
    }
  }

  public show() {
    // Center product title
    if (this.kiosk.productPage != undefined) {
      this.kiosk.productPage.productName.getComponent(Transform).position.x = 0;
      this.kiosk.productPage.productName.getComponent(TextShape).hTextAlign =
        "center";
    }

    Helper.showAllEntities([
      this.whiteBackgroundBox,
      this.greyTab,
      this.tab1,
      this.tab2,
      this.tab3,
      this.tabUnderline,
      this.backButtonEntity,
    ]);

    // Automatically show tab 1
    this.showProductDescription();
  }

  public hide() {
    this.hideAllPages();

    Helper.hideAllEntities([
      this.whiteBackgroundBox,
      this.greyTab,
      this.tab1,
      this.tab2,
      this.tab3,
      this.tabUnderline,
      this.backButtonEntity,
    ]);
  }

  private moveUnderLineToTab(_tabnumber: number) {
    if (_tabnumber == 1) {
      this.tabUnderline.getComponent(Transform).position = new Vector3(
        -0.9,
        0.752,
        -0.004
      );
    } else if (_tabnumber == 2) {
      this.tabUnderline.getComponent(Transform).position = new Vector3(
        -0.2,
        0.752,
        -0.004
      );
    } else if (_tabnumber == 3) {
      this.tabUnderline.getComponent(Transform).position = new Vector3(
        0.5,
        0.752,
        -0.004
      );
    }
  }

  private showProductDescription() {
    this.hideAllPages();
    this.moveUnderLineToTab(1);
    Helper.showAllEntities([
      this.productDescriptionTitle,
      this.productDataInfo,
    ]);
  }

  private showAboutTheCreator() {
    this.hideAllPages();
    this.moveUnderLineToTab(2);
    Helper.showAllEntities([
      this.aboutTheCreatorTitle,
      this.aboutTheCreatorInfo,
    ]);
  }

  private showShippingAndInventory() {
    this.hideAllPages();
    this.moveUnderLineToTab(3);
    Helper.showAllEntities([
      this.ShippingAndInventoryTitle,
      this.ShippingAndInventoryInfo,
      this.ShippingAndInventoryShippingTitle,
      this.ShippingAndInventoryShippingInfo,
    ]);
  }

  private hideAllPages() {
    Helper.hideAllEntities([
      this.productDescriptionTitle,
      this.productDataInfo,
      this.aboutTheCreatorTitle,
      this.aboutTheCreatorInfo,
      this.ShippingAndInventoryTitle,
      this.ShippingAndInventoryInfo,
      this.ShippingAndInventoryShippingTitle,
      this.ShippingAndInventoryShippingInfo,
    ]);
  }
}

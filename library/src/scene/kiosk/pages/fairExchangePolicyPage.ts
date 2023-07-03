import { getEnvironment } from "../../../core-sdk";
import { AbstractKiosk } from "../absrtactKiosk";
import { Helper } from "../helper";
import { Kiosk } from "../kiosk";
import { Separator } from "../UIComponents/separator";

export class FairExchangePolicyPage {
  kiosk: Kiosk | AbstractKiosk;

  productData: any = undefined;
  parent: Entity;

  whiteBackgroundBox: Entity = new Entity();
  whiteBackgroundMat: Material = new Material();

  backButtonEntity: Entity = new Entity();
  backButtonMat: Material = new Material();
  backButtonTexture: Texture;

  Title: Entity = new Entity();
  TitleText: TextShape;

  Description: Entity = new Entity();
  DescriptionText: TextShape;

  InformationHeadings: Entity = new Entity();
  InformationHeadingsText: TextShape;

  InformationContent: Entity = new Entity();
  InformationContentText: TextShape;

  InformationContentLinks: Entity = new Entity();
  InformationContentLinksText: TextShape;

  LicenseClickBox: Entity = new Entity();
  CommerceClickBox: Entity = new Entity();

  constructor(_kiosk: Kiosk | AbstractKiosk, _parent: Entity, _productData: any) {
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

    // Title
    this.TitleText = new TextShape("Fair Exchange Policy");
    this.TitleText.color = Color3.Black();
    this.TitleText.fontSize = 6;
    this.TitleText.outlineColor = Color3.Black();
    this.TitleText.outlineWidth = 0.2;
    this.TitleText.hTextAlign = "left";
    this.Title.addComponent(this.TitleText);
    this.Title.setParent(this.parent);
    this.Title.addComponent(
      new Transform({
        position: new Vector3(-1.18, 0.75, -0.004),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    // Description
    this.DescriptionText = new TextShape(
      "Boson Exchange Policies combine protocol variables and the underlying contractual agreement of an\nexchange into a standardized policy, ensuring fair terms and protection for both buyer and seller."
    );
    this.DescriptionText.color = Color3.Black();
    this.DescriptionText.fontSize = 5;
    this.DescriptionText.outlineColor = Color3.Black();
    this.DescriptionText.hTextAlign = "left";
    this.DescriptionText.outlineWidth = 0.15;
    this.Description.addComponent(this.DescriptionText);
    this.Description.setParent(this.parent);
    this.Description.addComponent(
      new Transform({
        position: new Vector3(-1.18, 0.55, -0.004),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    // Headings and Content
    this.InformationHeadingsText = new TextShape(
      "Policy Name\n\nDispute Period\n\nEscalation Period\n\nRedeemable NFT Terms\n\nBuyer & Seller Agreement"
    );
    this.InformationHeadingsText.color = Color3.Black();
    this.InformationHeadingsText.fontSize = 5;
    this.InformationHeadingsText.outlineColor = Color3.Black();
    this.InformationHeadingsText.hTextAlign = "left";
    this.InformationHeadingsText.outlineWidth = 0.1;
    this.InformationHeadings.addComponent(this.InformationHeadingsText);
    this.InformationHeadings.setParent(this.parent);
    this.InformationHeadings.addComponent(
      new Transform({
        position: new Vector3(-1, 0.1, -0.004),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    this.InformationContentText = new TextShape(
      "Fair Exchange Policy v1.0" +
        "\n\nMin. " +
        this.productData.disputePeriodDuration / (60 * 60 * 24) +
        " days\n\nMin. " +
        Math.round(
          this.productData.disputeResolver.escalationResponsePeriod /
            (60 * 60 * 24)
        ) +
        " days"
    );

    this.InformationContentText.color = Color3.Black();
    this.InformationContentText.fontSize = 5;
    this.InformationContentText.outlineColor = Color3.Black();
    this.InformationContentText.hTextAlign = "right";
    this.InformationContentText.outlineWidth = 0.1;
    this.InformationContent.addComponent(this.InformationContentText);
    this.InformationContent.setParent(this.parent);
    this.InformationContent.addComponent(
      new Transform({
        position: new Vector3(1, 0.215, -0.004),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    this.InformationContentLinksText = new TextShape(
      "License Agreement v1\n\nCommerce Agreement v1"
    );
    
    this.InformationContentLinksText.color = Color3.Blue();
    this.InformationContentLinksText.fontSize = 5;
    this.InformationContentLinksText.outlineColor = Color3.Black();
    this.InformationContentLinksText.hTextAlign = "right";
    this.InformationContentLinksText.outlineWidth = 0.1;
    this.InformationContentLinks.addComponent(this.InformationContentLinksText);
    this.InformationContentLinks.setParent(this.parent);
    this.InformationContentLinks.addComponent(
      new Transform({
        position: new Vector3(1, -0.068, -0.004),
        scale: new Vector3(0.1, 0.1, 0.1),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    // Seperators
    for (let i = 0; i < 5; i++) {
      new Separator(
        this.parent,
        new Transform({
          position: new Vector3(0, 0.29 - i * 0.115, -0.005),
          rotation: Quaternion.Euler(180, 180, 0),
          scale: new Vector3(2, 0.007, 0.01),
        })
      );
    }

    //https://bosonapp.io/#/license/22d241-de3-ec76-2cff-6c21a6ef4bcb
    //https://bosonapp.io/#/contractualAgreement/210

    // Click boxes

    let URLBase = "";

    switch (getEnvironment()) {
      case "local":
      case "testing":
        URLBase = "https://interface-test.on.fleek.co/";
        break;
      case "staging":
        URLBase = "https://interface-staging.on.fleek.co/";
        break;
      case "production":
        URLBase = "https://bosonapp.io/";
        break;
    }

    this.LicenseClickBox.setParent(this.parent);
    this.LicenseClickBox.addComponent(new PlaneShape());
    this.LicenseClickBox.addComponent(
      new Transform({
        position: new Vector3(0.72, 0, -0.005),
        scale: new Vector3(0.6, 0.1, 1),
      })
    );

    this.LicenseClickBox.addComponent(Kiosk.getAlphaMat() as Material);
    this.LicenseClickBox.addComponent(
      new OnPointerDown(
        () => {
          if (this.kiosk.currentVariation != undefined) {
            openExternalURL(
              URLBase + "#/license/" + this.kiosk.currentVariation.offerUUID
            );
          } else {
            openExternalURL(
              URLBase + "/#/license/" + this.productData.metadata.uuid
            );
          }
        },
        {
          hoverText: "View License Agreement",
        }
      )
    );

    this.CommerceClickBox.setParent(this.parent);
    this.CommerceClickBox.addComponent(new PlaneShape());
    this.CommerceClickBox.addComponent(
      new Transform({
        position: new Vector3(0.72, -0.12, -0.005),
        scale: new Vector3(0.6, 0.1, 1),
      })
    );

    this.CommerceClickBox.addComponent(Kiosk.getAlphaMat() as Material);
    this.CommerceClickBox.addComponent(
      new OnPointerDown(
        () => {
          openExternalURL(
            URLBase + "#/contractualAgreement/" + this.kiosk.currentOfferID
          );
        },
        {
          hoverText: "View Commerce Agreement",
        }
      )
    );

    this.hide();
  }

  show() {
    // Center product title
    if (this.kiosk.productPage != undefined) {
      this.kiosk.productPage.productName.getComponent(Transform).position.x = 0;
      this.kiosk.productPage.productName.getComponent(TextShape).hTextAlign =
        "center";
    }

    Helper.showAllEntities([this.parent]);
  }

  hide() {
    Helper.hideAllEntities([this.parent]);
  }
}

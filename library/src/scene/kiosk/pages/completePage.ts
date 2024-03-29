import { OfferFieldsFragment } from "@bosonprotocol/core-sdk/dist/esm/subgraph";
import { getEnvironment } from "../../../core-sdk";
import { ScaleSpringComponent } from "../animation/ScaleSpringComponent";
import { Helper } from "../helper";
import { Separator } from "../UIComponents/separator";
import { toBigNumber } from "eth-connect";
import { ProductHandle } from "../productHandle";
import { Kiosk } from "../kiosk";

export class CompletePage {
  kiosk: ProductHandle;

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

  explorerUrlBase = "";
  openseaUrlBase = "";
  bosonDAppUrlBase = "";

  constructor(_kiosk: ProductHandle, _parent: Entity, _productData: any) {
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

    const { envName, configId } = getEnvironment();
    switch (envName) {
      case "local":
        this.bosonDAppUrlBase = "http://localhost:3000";
        break;
      case "testing":
        this.bosonDAppUrlBase = "https://interface-test.on.fleek.co";
        break;
      case "staging":
        this.bosonDAppUrlBase = "https://interface-staging.on.fleek.co";
        break;
      case "production":
        this.bosonDAppUrlBase = "https://bosonapp.io";
        break;
    }
    switch (configId) {
      case "local-31337-0":
      case "testing-80001-0":
      case "staging-80001-0":
        this.explorerUrlBase = "https://mumbai.polygonscan.com";
        this.openseaUrlBase = "https://testnets.opensea.io/assets/mumbai";
        break;
      case "testing-5-0":
      case "staging-5-0":
        this.explorerUrlBase = "https://goerli.etherscan.io";
        this.openseaUrlBase = "https://testnets.opensea.io/assets/goerli";
        break;
      case "production-137-0":
        this.explorerUrlBase = "https://polygonscan.com";
        this.openseaUrlBase = "https://opensea.io/assets/matic";
        break;
      case "production-1-0":
        this.explorerUrlBase = "https://etherscan.io";
        this.openseaUrlBase = "https://opensea.io/assets/ethereum";
        break;
    }

    this.etherScanLinkClickBox.addComponent(Kiosk.getAlphaMat() as Material);

    this.openSeaLinkClickBox.setParent(this.parent);
    this.openSeaLinkClickBox.addComponent(new PlaneShape());
    this.openSeaLinkClickBox.addComponent(
      new Transform({
        position: new Vector3(-0.097, -0.645, -0.0085),
        scale: new Vector3(0.52, 0.16, 0.01),
      })
    );

    this.openSeaLinkClickBox.addComponent(Kiosk.getAlphaMat() as Material);

    this.redeemLinkClickBox.setParent(this.parent);
    this.redeemLinkClickBox.addComponent(new PlaneShape());
    this.redeemLinkClickBox.addComponent(
      new Transform({
        position: new Vector3(0.77, -0.645, -0.0085),
        scale: new Vector3(0.52, 0.16, 0.01),
      })
    );

    this.redeemLinkClickBox.addComponent(Kiosk.getAlphaMat() as Material);
  }

  show(_success: boolean, data: any, productData: OfferFieldsFragment) {
    if (_success) {
      this.etherScanLinkClickBox.addComponentOrReplace(
        new OnPointerDown(
          () => {
            openExternalURL(this.explorerUrlBase + "/address/" + data.from);
          },
          {
            hoverText: "Polygonscan",
          }
        )
      );

      const tokenIdLog = data?.logs?.find(
        (log: any) =>
          log.topics[0] ===
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" &&
          log.topics[1] ===
            "0x0000000000000000000000000000000000000000000000000000000000000000"
      );

      let tokenIdHexString = tokenIdLog?.topics?.[3];
      // ensure the string starts with 0x for toBigNumber() to consider as an hex value
      tokenIdHexString =
        tokenIdHexString && tokenIdHexString.indexOf("0x") < 0
          ? "0x" + tokenIdHexString
          : tokenIdHexString;

      const tokenId = tokenIdHexString
        ? toBigNumber(tokenIdHexString).toString(10)
        : "?";

      this.openSeaLinkClickBox.addComponentOrReplace(
        new OnPointerDown(
          () => {
            log("openseaUrlBase", this.openseaUrlBase);
            log(
              "openseaUrl",
              this.openseaUrlBase +
                "/" +
                productData.seller.voucherCloneAddress +
                "/" +
                tokenId
            );
            openExternalURL(
              this.openseaUrlBase +
                "/" +
                productData.seller.voucherCloneAddress +
                "/" +
                tokenId
            );
          },
          {
            hoverText: "OpenSea",
          }
        )
      );

      const exchangeIdHexString = data?.logs?.find(
        (log: any) =>
          log.topics[0] ===
          "0x442279a0d0683a12971990518f9f3f874391650139a762c4e94b23b51f04d94f"
      );

      const exchangeId = exchangeIdHexString?.topics?.[3]
        ? parseInt(exchangeIdHexString.topics[3], 16).toString()
        : "?";

      const redemptionUrlLog = (productData?.metadata as any)?.attributes
        ? (productData.metadata as any).attributes.find(
            (attr: any) => attr.traitType === "Redeemable At"
          )
        : undefined;
      const redemptionUrl = redemptionUrlLog?.value
        ? redemptionUrlLog.value.replace(/\/+$/, "")
        : undefined;

      this.redeemLinkClickBox.addComponentOrReplace(
        new OnPointerDown(
          () => {
            openExternalURL(
              (redemptionUrl || this.bosonDAppUrlBase) +
                "/#/exchange/" +
                exchangeId
            );
          },
          {
            hoverText: "Redeem",
          }
        )
      );

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
        Helper.addNewLinesInString(data.toString(), 70, 8);

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

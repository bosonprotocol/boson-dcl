import { eGateTokenType } from "../enums";
import { Kiosk } from "../kiosk";
import { GatedToken } from "../gating/gatedToken";
import { Helper } from "../helper";
import { AbstractKiosk } from "../abstractKiosk";

export class TokenGatedOffer extends Entity {
  kiosk: Kiosk | AbstractKiosk;

  backgroundBox: Entity = new Entity();
  backgroundBoxMat: Material = new Material();

  tokenGatedOfferTitle: Entity = new Entity();
  tokenGatedOfferTitleText: TextShape;

  tokenGatedInfo: Entity = new Entity();
  tokenGatedInfoText: TextShape;

  requirementEntites: Entity[] = [];
  tokenEntities: Entity[] = [];

  static tokenTick: Texture;
  static tokenCross: Texture;
  static tokenTickMat: Material;
  static tokenCrossMat: Material;

  parent: Entity;

  constructor(_kiosk: Kiosk | AbstractKiosk, _parent: Entity, _transform: Transform) {
    super();

    this.parent = new Entity();
    this.parent.setParent(_parent);
    this.parent.addComponent(_transform);

    this.kiosk = _kiosk;

    this.setParent(this.parent);

    if (TokenGatedOffer.tokenTick == undefined) {
      TokenGatedOffer.tokenTick = new Texture(
        "images/kiosk/ui/token_tick.png",
        {
          hasAlpha: true,
        }
      );
      TokenGatedOffer.tokenCross = new Texture(
        "images/kiosk/ui/token_cross.png",
        {
          hasAlpha: true,
        }
      );

      TokenGatedOffer.tokenTickMat = new Material();
      TokenGatedOffer.tokenTickMat.albedoTexture = TokenGatedOffer.tokenTick;
      TokenGatedOffer.tokenTickMat.emissiveIntensity = 1;
      TokenGatedOffer.tokenTickMat.emissiveColor = Color3.White();
      TokenGatedOffer.tokenTickMat.emissiveTexture = TokenGatedOffer.tokenTick;
      TokenGatedOffer.tokenTickMat.transparencyMode = 1;

      TokenGatedOffer.tokenCrossMat = new Material();
      TokenGatedOffer.tokenCrossMat.albedoTexture = TokenGatedOffer.tokenCross;
      TokenGatedOffer.tokenCrossMat.emissiveIntensity = 1;
      TokenGatedOffer.tokenCrossMat.emissiveColor = Color3.White();
      TokenGatedOffer.tokenCrossMat.emissiveTexture =
        TokenGatedOffer.tokenCross;
      TokenGatedOffer.tokenCrossMat.transparencyMode = 1;
    }

    // Grey Tab
    this.backgroundBox.addComponent(new PlaneShape());
    this.backgroundBox.setParent(this);
    this.backgroundBox.addComponent(
      new Transform({
        position: new Vector3(0, 0.15, -0.001),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.9, 0.3, 0.01),
      })
    );
    this.backgroundBoxMat = new Material();
    this.backgroundBoxMat.emissiveIntensity = 0.3;
    this.backgroundBoxMat.albedoColor = Color3.FromHexString("#09182C");
    this.backgroundBoxMat.emissiveColor = Color3.FromHexString("#09182C");
    this.backgroundBox.addComponent(this.backgroundBoxMat);

    // tokenGatedOffer title
    this.tokenGatedOfferTitle.setParent(this);
    this.tokenGatedOfferTitle.addComponent(
      new Transform({
        position: new Vector3(-0.01, 0.25, -0.002),
        scale: new Vector3(0.1, 0.1, 0.1),
      })
    );
    this.tokenGatedOfferTitleText = new TextShape("Token Gated Offer");
    this.tokenGatedOfferTitleText.fontSize = 4;
    this.tokenGatedOfferTitleText.outlineWidth = 0.1;
    this.tokenGatedOfferTitleText.outlineColor = Color3.White();
    this.tokenGatedOfferTitleText.color = Color3.White();
    this.tokenGatedOfferTitle.addComponent(this.tokenGatedOfferTitleText);

    // tokenGatedOffer info
    this.tokenGatedInfo.setParent(this);
    this.tokenGatedInfo.addComponent(
      new Transform({
        position: new Vector3(-0.172, 0.17, -0.002),
        scale: new Vector3(0.1, 0.1, 0.1),
      })
    );

    let tokenPluralString = "token";
    if (this.kiosk.gatedTokens.length > 1) {
      tokenPluralString += "s";
    }

    this.tokenGatedInfoText = new TextShape(
      "You need to own the following " + tokenPluralString + " to\nCommit:"
    );
    this.tokenGatedInfoText.fontSize = 3;
    this.tokenGatedInfoText.outlineColor = Color3.White();
    this.tokenGatedInfoText.color = Color3.White();
    this.tokenGatedInfoText.hTextAlign = "left";
    this.tokenGatedInfo.addComponent(this.tokenGatedInfoText);

    this.kiosk.gatedTokens.forEach((token: GatedToken, index: number) => {
      const requirementEntity: Entity = new Entity();
      requirementEntity.addComponent(new PlaneShape());
      requirementEntity.setParent(this);
      requirementEntity.addComponent(
        new Transform({
          position: new Vector3(-0.16, 0.098 - 0.035 * index, -0.002),
          scale: new Vector3(0.03, 0.03, 0.1),
          rotation: Quaternion.Euler(180, 180, 0),
        })
      );

      if (token.meetsRequirement) {
        requirementEntity.addComponent(TokenGatedOffer.tokenTickMat);
      } else {
        requirementEntity.addComponent(TokenGatedOffer.tokenCrossMat);
      }

      this.requirementEntites.push(requirementEntity);

      const tokenEntity = new Entity();
      tokenEntity.setParent(this);
      tokenEntity.addComponent(
        new Transform({
          position: new Vector3(0.13, 0.08 - 0.035 * index, -0.002),
          scale: new Vector3(0.1, 0.1, 0.1),
        })
      );

      const tokenText = new TextShape(token.name);
      tokenText.fontSize = 3;
      tokenText.outlineColor = Color3.White();
      tokenText.color = Color3.White();
      tokenText.hTextAlign = "left";
      tokenText.vTextAlign = "top";
      tokenText.textWrapping = true;
      tokenText.width = 5;
      tokenEntity.addComponent(tokenText);

      this.tokenEntities.push(tokenEntity);
    });
  }

  public updateGatedTokensUI() {
    this.kiosk.gatedTokens.forEach((token: GatedToken, index: number) => {
      if (token.meetsRequirement) {
        this.requirementEntites[index].addComponentOrReplace(
          TokenGatedOffer.tokenTickMat
        );
      } else {
        this.requirementEntites[index].addComponentOrReplace(
          TokenGatedOffer.tokenCrossMat
        );
      }
    });
  }

  public hide() {
    Helper.hideAllEntities([
      this.backgroundBox,
      this.tokenGatedOfferTitle,
      this.tokenGatedInfo,
    ]);
    this.requirementEntites.forEach((entity) => {
      Helper.hideAllEntities([entity]);
    });
  }

  public show() {
    Helper.showAllEntities([
      this.backgroundBox,
      this.tokenGatedOfferTitle,
      this.tokenGatedInfo,
    ]);
    this.requirementEntites.forEach((entity) => {
      Helper.showAllEntities([entity]);
    });
  }
}

import { AbstractKiosk } from "../absrtactKiosk";
import { Helper } from "../helper";
import { Kiosk } from "../kiosk";

export class Option {
  id: string;
  type: string;
  option: string;

  constructor(_id: string, _type: string, _option: string) {
    this.id = _id;
    this.type = _type;
    this.option = _option;
  }
}

export class Variation {
  offerID: number;
  offerUUID: string;

  initialStock: number;
  availableStock: number;

  option1: Option;
  option2: Option;

  constructor(
    _offerID: number,
    _offerUUID: string,
    _initialStock: number,
    _availableStock: number,
    _option1: Option,
    _option2: Option
  ) {
    this.offerID = _offerID;
    this.offerUUID = _offerUUID;
    this.initialStock = _initialStock;
    this.availableStock = _availableStock;

    this.option1 = _option1;
    this.option2 = _option2;
  }
}

export class VariationComponent {
  kiosk: Kiosk | AbstractKiosk;

  currentVariation: Variation = new Variation(
    -1,
    "",
    -1,
    -1,
    new Option("", "", ""),
    new Option("", "", "")
  ); // Blank intialisation

  uniqueOption1: Option[] = [];
  uniqueOption2: Option[] = [];

  filteredOption2: Option[] = [];

  option1VariationIndex = 0;
  option2VariationIndex = 0;

  // Options
  variationPrevMat: Material = new Material();
  variationPrevTexture: Texture | undefined;
  variationNextMat: Material = new Material();
  variationNextTexture: Texture | undefined;

  // Option 1
  option1VariationTypeName: Entity = new Entity();
  option1VariationTypeNameText: TextShape = new TextShape();
  option1VariationOptionName: Entity = new Entity();
  option1VariationOptionNameText: TextShape = new TextShape("Loading");
  option1VariationPrevEntity: Entity = new Entity();
  option1VariationNextEntity: Entity = new Entity();

  // Option 2
  option2VariationTypeName: Entity = new Entity();
  option2VariationTypeNameText: TextShape = new TextShape();
  option2VariationOptionName: Entity = new Entity();
  option2VariationOptionNameText: TextShape = new TextShape("Loading");
  option2VariationPrevEntity: Entity = new Entity();
  option2VariationNextEntity: Entity = new Entity();

  // UI
  constructor(_kiosk: Kiosk | AbstractKiosk, _transform: Transform, _parent: Entity) {
    this.kiosk = _kiosk;

    this.variationPrevMat = new Material();
    this.variationPrevTexture = new Texture("images/kiosk/ui/prev_option.png", {
      hasAlpha: true,
    });
    this.variationPrevMat.albedoTexture = this.variationPrevTexture;
    this.variationPrevMat.emissiveIntensity = 1;
    this.variationPrevMat.emissiveColor = Color3.White();
    this.variationPrevMat.emissiveTexture = this.variationPrevTexture;
    this.variationPrevMat.transparencyMode = 1;
    this.variationNextMat = new Material();
    this.variationNextTexture = new Texture("images/kiosk/ui/next_option.png", {
      hasAlpha: true,
    });
    this.variationNextMat.albedoTexture = this.variationNextTexture;
    this.variationNextMat.emissiveIntensity = 1;
    this.variationNextMat.emissiveColor = Color3.White();
    this.variationNextMat.emissiveTexture = this.variationNextTexture;
    this.variationNextMat.transparencyMode = 1;

    // Option 1
    this.option1VariationPrevEntity = new Entity();
    this.option1VariationPrevEntity.addComponent(new PlaneShape());
    this.option1VariationPrevEntity.setParent(_parent);
    this.option1VariationPrevEntity.addComponent(
      new Transform({
        position: new Vector3(0.1 + 0.07, 0.44, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.04, 0.04, 0.01),
      })
    );
    this.option1VariationPrevEntity.addComponent(
      new OnPointerDown(
        () => {
          this.option1Previous();
        },
        {
          hoverText: "Previous",
        }
      )
    );

    this.option1VariationPrevEntity.addComponent(this.variationPrevMat);

    this.option1VariationNextEntity = new Entity();
    this.option1VariationNextEntity.addComponent(new PlaneShape());
    this.option1VariationNextEntity.setParent(_parent);
    this.option1VariationNextEntity.addComponent(
      new Transform({
        position: new Vector3(0.45, 0.44, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.04, 0.04, 0.01),
      })
    );
    this.option1VariationNextEntity.addComponent(
      new OnPointerDown(
        () => {
          this.option1Next();
        },
        {
          hoverText: "Next",
        }
      )
    );
    this.option1VariationNextEntity.addComponent(this.variationNextMat);

    this.option1VariationOptionNameText.color = Color3.Black();
    this.option1VariationOptionNameText.fontSize = 10;
    this.option1VariationOptionName.addComponent(
      this.option1VariationOptionNameText
    );
    this.option1VariationOptionName.setParent(_parent);
    this.option1VariationOptionName.addComponent(
      new Transform({
        position: new Vector3(0.32, 0.445, -0.002),
        scale: new Vector3(0.05, 0.05, 0.05),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    this.option1VariationTypeNameText.color = Color3.Black();
    this.option1VariationTypeNameText.fontSize = 10;
    this.option1VariationTypeNameText.outlineColor = Color3.Black();
    this.option1VariationTypeNameText.outlineWidth = 0.2;
    this.option1VariationTypeName.addComponent(
      this.option1VariationTypeNameText
    );
    this.option1VariationTypeName.setParent(_parent);
    this.option1VariationTypeName.addComponent(
      new Transform({
        position: new Vector3(0.32, 0.52, -0.002),
        scale: new Vector3(0.05, 0.05, 0.05),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    // Option 2
    this.option2VariationPrevEntity = new Entity();
    this.option2VariationPrevEntity.addComponent(new PlaneShape());
    this.option2VariationPrevEntity.setParent(_parent);
    this.option2VariationPrevEntity.addComponent(
      new Transform({
        position: new Vector3(0.67, 0.44, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.04, 0.04, 0.01),
      })
    );
    this.option2VariationPrevEntity.addComponent(
      new OnPointerDown(
        () => {
          this.option2Previous();
        },
        {
          hoverText: "Previous",
        }
      )
    );

    this.option2VariationPrevEntity.addComponent(this.variationPrevMat);

    this.option2VariationNextEntity = new Entity();
    this.option2VariationNextEntity.addComponent(new PlaneShape());
    this.option2VariationNextEntity.setParent(_parent);
    this.option2VariationNextEntity.addComponent(
      new Transform({
        position: new Vector3(0.95, 0.44, -0.002),
        rotation: Quaternion.Euler(180, 180, 0),
        scale: new Vector3(0.04, 0.04, 0.01),
      })
    );
    this.option2VariationNextEntity.addComponent(
      new OnPointerDown(
        () => {
          this.option2Next();
        },
        {
          hoverText: "Next",
        }
      )
    );
    this.option2VariationNextEntity.addComponent(this.variationNextMat);

    this.option2VariationOptionNameText.color = Color3.Black();
    this.option2VariationOptionNameText.fontSize = 10;
    this.option2VariationOptionName.addComponent(
      this.option2VariationOptionNameText
    );
    this.option2VariationOptionName.setParent(_parent);
    this.option2VariationOptionName.addComponent(
      new Transform({
        position: new Vector3(0.82, 0.445, -0.002),
        scale: new Vector3(0.05, 0.05, 0.05),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );

    this.option2VariationTypeNameText.color = Color3.Black();
    this.option2VariationTypeNameText.fontSize = 10;
    this.option2VariationTypeNameText.outlineColor = Color3.Black();
    this.option2VariationTypeNameText.outlineWidth = 0.2;
    this.option2VariationTypeName.addComponent(
      this.option2VariationTypeNameText
    );
    this.option2VariationTypeName.setParent(_parent);
    this.option2VariationTypeName.addComponent(
      new Transform({
        position: new Vector3(0.82, 0.52, -0.002),
        scale: new Vector3(0.05, 0.05, 0.05),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    );
  }

  show() {
    this.setValues(1);
    this.setImageArrowVisibility();
  }

  calculateOptions() {
    this.kiosk.variations.forEach((variation) => {
      // Option 1
      let match = false;
      this.uniqueOption1.forEach((option) => {
        if (option.option == variation.option1.option) {
          match = true;
        }
      });
      if (!match) {
        this.uniqueOption1.push(variation.option1);
      }

      // Option 2
      match = false;
      this.uniqueOption2.forEach((option) => {
        if (option.option == variation.option2.option) {
          match = true;
        }
      });
      if (!match) {
        this.uniqueOption2.push(variation.option2);
      }
    });

    if (this.uniqueOption1.length > 0) {
      this.option1VariationTypeNameText.value = this.uniqueOption1[0].type;
    }

    if (this.uniqueOption1.length > 0) {
      this.option2VariationTypeNameText.value = this.uniqueOption2[0].type;
    }
  }

  setValues(opionChanged: number) {
    // Set unique options if undefined
    if (this.uniqueOption1.length == 0 && this.uniqueOption2.length == 0) {
      this.calculateOptions();
    }

    // Find variation that matches options
    let variation: Variation;

    if (this.currentVariation == undefined) {
      this.currentVariation = this.kiosk.variations[0];
    }

    this.currentVariation.option1 =
      this.uniqueOption1[this.option1VariationIndex];
    this.filterOption2();

    // set option on current variation by index
    this.currentVariation.option2 =
      this.filteredOption2[this.option2VariationIndex];

    variation = this.currentVariation;

    this.kiosk.variations.forEach((_variation) => {
      if (
        variation.option1.id == _variation.option1.id &&
        variation.option2.id == _variation.option2.id
      ) {
        variation = _variation;
      }
    });

    // If we cant find one then just match on the option that was changed
    if (variation == undefined) {
      if (opionChanged == 1) {
        this.kiosk.variations.forEach((_variation) => {
          if (variation.option1.id == _variation.option1.id) {
            if (variation != undefined) {
              variation = _variation;
            }
          }
        });
        this.option2VariationIndex = 0;
      } else {
        this.kiosk.variations.forEach((_variation) => {
          if (variation.option2.id == _variation.option2.id) {
            if (variation != undefined) {
              variation = _variation;
            }
          }
        });
        this.option1VariationIndex = 0;
      }
    }

    this.kiosk.currentOfferID = variation.offerID.toString();

    this.option1VariationOptionNameText.value = variation.option1.option;
    this.option2VariationOptionNameText.value = variation.option2.option;

    this.kiosk.currentVariation = variation;

    this.kiosk.productPage?.updateStock(
      variation.initialStock as number,
      variation.availableStock as number
    );

    this.setImageArrowVisibility();
  }

  private option1Next() {
    this.option1VariationIndex++;

    if (this.option1VariationIndex >= this.uniqueOption1.length) {
      this.option1VariationIndex = this.uniqueOption1.length - 1;
    }

    this.setImageArrowVisibility();
    this.setValues(1);
  }

  private option1Previous() {
    this.option1VariationIndex--;

    if (this.option1VariationIndex < 0) {
      this.option1VariationIndex = 0;
    }

    this.setImageArrowVisibility();
    this.setValues(1);
  }

  private option2Next() {
    this.option2VariationIndex++;

    if (this.option2VariationIndex >= this.filteredOption2.length) {
      this.option2VariationIndex = this.filteredOption2.length - 1;
    }

    this.setImageArrowVisibility();
    this.setValues(2);
  }

  private option2Previous() {
    this.option2VariationIndex--;

    if (this.option2VariationIndex < 0) {
      this.option2VariationIndex = 0;
    }

    this.setImageArrowVisibility();
    this.setValues(2);
  }

  private setImageArrowVisibility() {
    // Option 1
    if (this.option1VariationIndex == 0) {
      Helper.hideAllEntities([this.option1VariationPrevEntity]);
    } else {
      Helper.showAllEntities([this.option1VariationPrevEntity]);
    }

    if (this.option1VariationIndex >= this.uniqueOption1.length - 1) {
      Helper.hideAllEntities([this.option1VariationNextEntity]);
    } else {
      Helper.showAllEntities([this.option1VariationNextEntity]);
    }

    // Option 2
    if (this.option2VariationIndex == 0) {
      Helper.hideAllEntities([this.option2VariationPrevEntity]);
    } else {
      Helper.showAllEntities([this.option2VariationPrevEntity]);
    }

    if (this.option2VariationIndex >= this.filteredOption2.length - 1) {
      Helper.hideAllEntities([this.option2VariationNextEntity]);
    } else {
      Helper.showAllEntities([this.option2VariationNextEntity]);
    }
  }

  private filterOption2() {
    this.filteredOption2 = [];

    // See if any options 2's match our option 1 and add them
    this.kiosk.variations.forEach((_variation) => {
      if (_variation.option1.option == this.currentVariation.option1.option) {
        // Add to filtered option2
        let alreadyExists = false;
        this.filteredOption2.forEach((option2) => {
          if (option2.option == _variation.option2.option) {
            alreadyExists = true;
          }
        });
        if (!alreadyExists) {
          this.filteredOption2.push(_variation.option2);
        }
      }
    });
  }
}

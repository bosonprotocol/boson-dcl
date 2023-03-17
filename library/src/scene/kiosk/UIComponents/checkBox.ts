export class CheckBox extends Entity {
  static checkedImage: Texture;
  static unCheckedImage: Texture;

  checked = false;

  constructor(
    _parent: Entity,
    _transform: Transform,
    _hover: string,
    _callBack: (arg0: boolean) => void
  ) {
    super();

    if (CheckBox.checkedImage == undefined) {
      CheckBox.checkedImage = new Texture(
        "images/kiosk/ui/check_box_checked.png"
      );
      CheckBox.unCheckedImage = new Texture("images/kiosk/ui/check_box.png");
    }

    this.setParent(_parent);
    this.addComponent(_transform);
    this.addComponent(new PlaneShape());

    this.addComponent(
      new OnPointerDown(
        () => {
          this.checked = !this.checked;
          this.setImage();
          _callBack(this.checked);
        },
        {
          hoverText: _hover,
        }
      )
    );

    this.addComponent(new Material());

    this.setImage();
  }

  setImage() {
    let texture: Texture;
    if (this.checked) {
      texture = CheckBox.checkedImage;
    } else {
      texture = CheckBox.unCheckedImage;
    }
    const material: Material = this.getComponent(Material);

    material.albedoTexture = texture;
    material.emissiveTexture = texture;
    material.transparencyMode = 2;
    material.emissiveColor = Color3.White();
    material.emissiveIntensity = 0.5;
  }
}

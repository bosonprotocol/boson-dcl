export class QuestionMark extends Entity {
  static questionMarkMaterial: Material;

  constructor(_parent: Entity, _transform: Transform, _hoverText: string) {
    super();

    if (QuestionMark.questionMarkMaterial == undefined) {
      QuestionMark.questionMarkMaterial = new Material();
      QuestionMark.questionMarkMaterial.transparencyMode = 2;
      QuestionMark.questionMarkMaterial.albedoTexture = new Texture(
        "images/kiosk/ui/question_mark.png"
      );
    }

    this.setParent(_parent);
    this.addComponent(new PlaneShape());
    this.addComponent(_transform);
    this.addComponent(QuestionMark.questionMarkMaterial);
    this.addComponent(
      new OnPointerDown(
        () => {
          // Purposely empty
        },
        {
          hoverText: _hoverText,
        }
      )
    );
  }
}

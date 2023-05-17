import { HowDoesItWork } from "../pages/howDoesItWork";
import { Kiosk } from "../kiosk";

export class HowItWorksLink extends Entity {
  viewHowItWorksText: TextShape;
  viewHowItWorksClickBox: Entity = new Entity();
  howDoesItWorkPage: HowDoesItWork;

  constructor(_kiosk: Kiosk, _parent: Entity, _transform: Transform) {
    super();

    this.howDoesItWorkPage = new HowDoesItWork(_kiosk, _parent);

    this.viewHowItWorksText = new TextShape("How it works?");
    this.viewHowItWorksText.color = Color3.Blue();
    this.viewHowItWorksText.fontSize = 4;
    this.viewHowItWorksText.outlineColor = Color3.Blue();
    this.viewHowItWorksText.outlineWidth = 0.25;
    this.addComponent(this.viewHowItWorksText);
    this.setParent(_parent);
    this.addComponent(_transform);

    this.viewHowItWorksClickBox.setParent(this);
    this.viewHowItWorksClickBox.addComponent(new PlaneShape());
    this.viewHowItWorksClickBox.addComponent(
      new Transform({
        scale: new Vector3(4, 1, 1),
      })
    );

    this.viewHowItWorksClickBox.addComponent(Kiosk.getAlphaMat() as Material);
    this.viewHowItWorksClickBox.addComponent(
      new OnPointerDown(
        () => {
          this.howDoesItWorkPage.show();
        },
        {
          hoverText: "How it works?",
        }
      )
    );
  }
}

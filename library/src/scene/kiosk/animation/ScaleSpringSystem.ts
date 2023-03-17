/* imports */

import { ScaleSpringComponent } from "./ScaleSpringComponent";

/* system definition */

export class ScaleSpringSystem implements ISystem {
  /* field definitions */

  static instance: ScaleSpringSystem;

  // component group
  allSprings: ComponentGroup = engine.getComponentGroup(ScaleSpringComponent);

  /* methods */

  static ensureInstance(): ScaleSpringSystem {
    if (
      ScaleSpringSystem.instance === undefined ||
      ScaleSpringSystem.instance === null
    ) {
      ScaleSpringSystem.instance = new ScaleSpringSystem();
      engine.addSystem(ScaleSpringSystem.instance);
    }
    return ScaleSpringSystem.instance;
  }

  /* implementation of ISystem */

  // called every frame
  update(_deltaTime: number) {
    // prevent bad delta time values
    if (_deltaTime < 0 || _deltaTime > 1 / 12) {
      return;
    }
    _deltaTime = Math.min(_deltaTime, 1 / 15);

    // iterate all spring components
    this.allSprings.entities.forEach((entity) => {
      // get the transform for the spring
      const transform: Transform = entity.getComponent(Transform);
      if (transform === undefined || transform === null) {
        // No transform
        // skip
      } else {
        // get the spring component
        const spring = entity.getComponent(ScaleSpringComponent);

        // check for a sync request
        if (
          spring.sync &&
          spring.targetScale !== undefined &&
          spring.targetScale !== null
        ) {
          spring.sync = false;
          spring.velocity = Vector3.Zero();
          transform.scale = spring.targetScale.clone();
        }

        // apply the spring physics
        const dif = spring.targetScale.subtract(transform.scale);
        const acc = dif.scale(spring.force * _deltaTime);
        const dec = spring.velocity.scale(spring.dampening * _deltaTime);
        spring.velocity = spring.velocity.add(acc).subtract(dec);

        // update the transform
        transform.scale = transform.scale.add(
          spring.velocity.scale(_deltaTime)
        );
        if (!spring.allowNegativeScale) {
          transform.scale.x = Math.max(0, transform.scale.x);
          transform.scale.y = Math.max(0, transform.scale.y);
          transform.scale.z = Math.max(0, transform.scale.z);
        }
      }
    });
  }
}

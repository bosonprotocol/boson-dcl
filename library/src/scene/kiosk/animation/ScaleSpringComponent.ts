/* component definition */

@Component("ScaleSpringComponent")
export class ScaleSpringComponent {
  /* field definitions */

  // general
  targetScale: Vector3 = Vector3.Zero();

  // physics configuration
  force: number;
  dampening: number;
  allowNegativeScale = false;

  // physics runtime
  velocity: Vector3;

  // flags
  sync = false;

  /* constructor */

  constructor(_force: number, _dampening: number) {
    // populate the configuration parameters
    this.force = _force;
    this.dampening = _dampening;

    // initialise runtime fields
    this.velocity = Vector3.Zero();
  }
}

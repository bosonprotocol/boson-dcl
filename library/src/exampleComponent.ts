/**
 * @public
 * @returns Some example component
 */
// @Component('exampleComponent')
export class ExampleComponent {
  constructor(public testing: boolean) {
  }
}


/**
 * @public
 * @returns Some constant
 * This is constan variable
 */
export const constant = 'constant'

/**
 * @public
 * @returns Some value
 * This is a public function that does something
 */
export function someFn() {
  return 'some-value'
}
import { constant, someFn, ExampleComponent } from "@bosonprotocol/boson-dcl";

export function useBoson() {
  const exampleComponent = new ExampleComponent(true);
  log("Hello Boson Protocol World", constant, someFn(), exampleComponent.testing);
}
import * as ecs from 'decentraland-ecs'

type Ecs = { self: typeof ecs }
/**
 * Override @Component for testing purpose.
 */
const Component = (ecs as any as Ecs).self.Component
;(globalThis as any).Component = Component

import { ProductHandle } from '@bosonprotocol/boson-dcl'

/* 
#DCECOMP
{
  "class": "BosonProduct",
  "component": "BosonProduct",
  "category": "Custom",
  "properties": [
        {
            "name": "productUUID",
            "type": "string"
        },
        {
            "name": "environment",
            "type": "string",
            "default": "production"
        }
    ]
}
*/

@Component('BosonProduct')
export class BosonProduct {
  public productUUID: string = ''
  public environment: string = ''

  init(entity: Entity) {
    log('BosonProduct:: init()')
    new ProductHandle(entity, this.productUUID)
  }
}


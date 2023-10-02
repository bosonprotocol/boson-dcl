<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@bosonprotocol/boson-dcl](./boson-dcl.md) &gt; [ProductHandle](./boson-dcl.producthandle.md)

## ProductHandle class


<b>Signature:</b>

```typescript
export declare class ProductHandle extends Entity 
```
<b>Extends:</b> Entity

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(\_parent, \_sellerId, \_productUUID, gateState)](./boson-dcl.producthandle._constructor_.md) |  | Constructs a new instance of the <code>ProductHandle</code> class |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [allBalances](./boson-dcl.producthandle.allbalances.md) | <code>static</code> | object |  |
|  [billboardParent](./boson-dcl.producthandle.billboardparent.md) |  | Entity |  |
|  [connectedToWeb3](./boson-dcl.producthandle.connectedtoweb3.md) |  | boolean |  |
|  [coreSDK](./boson-dcl.producthandle.coresdk.md) | <p><code>protected</code></p><p><code>static</code></p> | CoreSDK |  |
|  [currentItemIndex](./boson-dcl.producthandle.currentitemindex.md) |  | number |  |
|  [currentOfferID](./boson-dcl.producthandle.currentofferid.md) |  | string |  |
|  [currentVariation](./boson-dcl.producthandle.currentvariation.md) |  | Variation \| undefined |  |
|  [customQuestInformation](./boson-dcl.producthandle.customquestinformation.md) |  | string |  |
|  [gatedTokens](./boson-dcl.producthandle.gatedtokens.md) |  | GatedToken\[\] |  |
|  [gateState](./boson-dcl.producthandle.gatestate.md) |  | [eGateStateEnum](./boson-dcl.egatestateenum.md) |  |
|  [initialised](./boson-dcl.producthandle.initialised.md) | <p><code>protected</code></p><p><code>static</code></p> | boolean |  |
|  [lockScreen](./boson-dcl.producthandle.lockscreen.md) |  | LockScreen \| undefined |  |
|  [maxItemIndex](./boson-dcl.producthandle.maxitemindex.md) |  | number |  |
|  [offer](./boson-dcl.producthandle.offer.md) |  | OfferFieldsFragment \| undefined |  |
|  [onPointerDown](./boson-dcl.producthandle.onpointerdown.md) |  | OnPointerDown |  |
|  [parent](./boson-dcl.producthandle.parent.md) |  | Entity |  |
|  [productCurrency](./boson-dcl.producthandle.productcurrency.md) |  | [eCurrency](./boson-dcl.ecurrency.md) |  |
|  [productData](./boson-dcl.producthandle.productdata.md) |  | OfferFieldsFragment \| undefined |  |
|  [productName](./boson-dcl.producthandle.productname.md) |  | Entity |  |
|  [productNameText](./boson-dcl.producthandle.productnametext.md) |  | TextShape \| undefined |  |
|  [productOverrideData](./boson-dcl.producthandle.productoverridedata.md) |  | { mainImageIndex?: number; imageSizes?: { \[key: number\]: { height: number; width: number; }; }; override?: { productName?: string; productDescription?: string; sellerName?: string; sellerDescription?: string; }; } \| undefined |  |
|  [productPage](./boson-dcl.producthandle.productpage.md) |  | ProductPage \| undefined |  |
|  [productUUID](./boson-dcl.producthandle.productuuid.md) |  | string |  |
|  [sellerId](./boson-dcl.producthandle.sellerid.md) |  | string |  |
|  [uiOpen](./boson-dcl.producthandle.uiopen.md) |  | boolean |  |
|  [userData](./boson-dcl.producthandle.userdata.md) | <p><code>protected</code></p><p><code>static</code></p> | UserData |  |
|  [variations](./boson-dcl.producthandle.variations.md) |  | Variation\[\] |  |
|  [walletAddress](./boson-dcl.producthandle.walletaddress.md) | <p><code>protected</code></p><p><code>static</code></p> | string |  |
|  [waveAnimationSystem](./boson-dcl.producthandle.waveanimationsystem.md) | <code>static</code> | WaveAnimationSystem \| undefined |  |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [checkForGatedTokens()](./boson-dcl.producthandle.checkforgatedtokens.md) | <code>protected</code> |  |
|  [createdGatedTokens(\_offer)](./boson-dcl.producthandle.createdgatedtokens.md) |  |  |
|  [init(coreSDK, userData, walletAddress, allBalances)](./boson-dcl.producthandle.init.md) | <code>static</code> |  |
|  [loadOffer(\_data)](./boson-dcl.producthandle.loadoffer.md) |  |  |
|  [loadProduct()](./boson-dcl.producthandle.loadproduct.md) |  |  |
|  [setUpSystems()](./boson-dcl.producthandle.setupsystems.md) | <code>protected</code> |  |
|  [showDisplayProduct()](./boson-dcl.producthandle.showdisplayproduct.md) |  |  |
|  [showLockScreen()](./boson-dcl.producthandle.showlockscreen.md) |  |  |
|  [showProduct(\_product)](./boson-dcl.producthandle.showproduct.md) |  |  |
|  [unlock(\_tokenCount, \_tokenAddress)](./boson-dcl.producthandle.unlock.md) |  |  |
|  [update(\_dt)](./boson-dcl.producthandle.update.md) |  |  |
|  [updateProductPrice()](./boson-dcl.producthandle.updateproductprice.md) |  |  |

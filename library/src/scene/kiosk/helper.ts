import * as boson from "../../core-sdk"
import { eCurrency } from "./enums";
import { DelayedTask } from "./tasks/DelayedTask";

export class CurrencyTexture {
    texture: Texture
    currency: eCurrency

    constructor(_texture: Texture, _currency: eCurrency) {
        this.texture = _texture
        this.currency = _currency
    }
}

export class CurrencyPrice {
    tokenID: string
    price: number = -1 // Cost in dollars per 1 whole token
    currency: eCurrency
    name: string

    constructor(_tokenID: string, _currency: eCurrency) {
        this.tokenID = _tokenID
        this.currency = _currency
        this.name = Helper.getCurrencyLabel(_currency)
    }
}

export class Helper {

    //static UNISWAP_API_URL:string = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

    static ethPrice: number = -1 // Cost in dollars per 1 whole token

    static currencyTextures: CurrencyTexture[] = [
        new CurrencyTexture(new Texture("images/UI/currency/mana.png", { hasAlpha: true }), eCurrency.mana),
        new CurrencyTexture(new Texture("images/UI/currency/eth.png", { hasAlpha: true }), eCurrency.eth),
        new CurrencyTexture(new Texture("images/UI/currency/matic.png", { hasAlpha: true }), eCurrency.matic),
        new CurrencyTexture(new Texture("images/UI/currency/weth.png", { hasAlpha: true }), eCurrency.weth),
        new CurrencyTexture(new Texture("images/UI/currency/boson.png", { hasAlpha: true }), eCurrency.boson),
        new CurrencyTexture(new Texture("images/UI/currency/usdc.png", { hasAlpha: true }), eCurrency.usdc),
        new CurrencyTexture(new Texture("images/UI/currency/tether.png", { hasAlpha: true }), eCurrency.usdt),
        new CurrencyTexture(new Texture("images/UI/currency/dai.png", { hasAlpha: true }), eCurrency.dai),
        new CurrencyTexture(new Texture("images/UI/currency/usd.png", { hasAlpha: true }), eCurrency.usd)
    ]

    static currencyPrices: CurrencyPrice[] = [
        new CurrencyPrice("0x0f5d2fb29fb7d3cfee444a200298f468908cc942",eCurrency.mana),
        new CurrencyPrice("0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",eCurrency.matic),
        new CurrencyPrice("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",eCurrency.weth),
        new CurrencyPrice("0xc477d038d5420c6a9e0b031712f61c5120090de9",eCurrency.boson),
        new CurrencyPrice("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",eCurrency.usdc),
        new CurrencyPrice("0xdac17f958d2ee523a2206206994597c13d831ec7",eCurrency.usdt),
        new CurrencyPrice("0x6b175474e89094c44da98b954eedeac495271d0f",eCurrency.dai)
    ]

    public static hideAllEntities(_entities: Entity[]) {
        _entities.forEach(entity => {
            if (entity.isAddedToEngine()) {
                engine.removeEntity(entity)
            }
        });
    }

    public static showAllEntities(_entities: Entity[]) {
        _entities.forEach(entity => {
            engine.addEntity(entity)
        });
    }

    public static priceTransform(_value: string): string {
        return (parseFloat(_value) / 1000000000000000000).toString()
    }

    public static nPriceTransform(_value: number): number {
        return _value / 1000000000000000000
    }

    public static addNewLinesInString(_text: string, _maxCharacters: number) {
        if(_text==undefined){
            return ""
        }

        if (_text.length <= _maxCharacters) {
            return _text // No need to add new lines
        }

        let formattedText: string = ""

        let index: number = 0
        while (_text.length > 0) {

            let differenceFromMax: number = _maxCharacters * index - _text.length

            if (differenceFromMax <= 0) {
                differenceFromMax = 0
            }

            formattedText += _text.slice(_maxCharacters * index, (_maxCharacters) + (_maxCharacters * index) - differenceFromMax) + "\n"
            if (index * _maxCharacters >= _text.length) {
                break
            }
            index++
        }

        return formattedText
    }

    public static getIPFSImageTexture(_value: string): Texture {
        if(_value != undefined){
            return (new Texture("https://gray-permanent-fly-490.mypinata.cloud/ipfs/" + _value.split("ipfs://")[1],{hasAlpha:true})) // "?img-width=400&img-height=800&img-fit=scale-pad"  // extended params can be used here
        } else {
            return new Texture("")
        }
    }

    public static getCurrencyTexture(currency: eCurrency): Texture {
        for (let i: number = 0; i < Helper.currencyTextures.length; i++) {
            if (Helper.currencyTextures[i].currency == currency) {
                return Helper.currencyTextures[i].texture
            }
        }
        log("Error - no texture for currency")
        return new Texture("") // Missing texture
    }

    public static getProductCurrency(_currencyName: string): eCurrency {
        switch (_currencyName.toLowerCase()) {
            case "eth":
                return eCurrency.eth
            case "matic":
                return eCurrency.matic
            case "weth":
                return eCurrency.weth
            case "mana":
                return eCurrency.mana
            case "boson":
                return eCurrency.boson
            case "usdc":
                return eCurrency.usdc
            case "usdt":
                return eCurrency.usdt
            case "dai":
                return eCurrency.dai
            case "usd":
                return eCurrency.usd
        }

        log("Error - no currency matched")
        return eCurrency.none
    }

    public static getCurrencySymbol(_eCurrency: eCurrency): string {
        switch (_eCurrency) {

            case eCurrency.eth:
                return "eth"
            case eCurrency.matic:
                return "matic"
            case eCurrency.weth:
                return "weth"
            case eCurrency.mana:
                return "mana"
            case eCurrency.boson:
                return "boson"
            case eCurrency.usdc:
                return "usdc"
            case eCurrency.usdt:
                return "usdt"
            case eCurrency.dai:
                return "dai"
            case eCurrency.usd:
                return "usd"

        }

        log("Error - no currency matched")
        return ""
    }

    public static getCurrencyLabel(_eCurrency: eCurrency): string {
        switch (_eCurrency) {
            case eCurrency.eth:
                return "Ethereum"
            case eCurrency.matic:
                return "Matic"
            case eCurrency.weth:
                return "Wrapped Ethereum"
            case eCurrency.mana:
                return "Mana"
            case eCurrency.boson:
                return "Boson Protocol"
            case eCurrency.usdc:
                return "USD Coin"
            case eCurrency.usdt:
                return "Tether"
            case eCurrency.dai:
                return "Dai"
            case eCurrency.usd:
                return "United States Dollar"
        }

        return ""
    }

    public static passTemplate(_template: TemplateStringsArray): TemplateStringsArray {
        return _template
    }

    public static refreshPrices() {
        let template: TemplateStringsArray = Helper.passTemplate`
        {
            pools(
              where: {
                  token0_: { symbol: "WETH" }
                  token1_: { symbol: "USDT" }
              }
              orderBy: volumeUSD
              orderDirection: desc
            ) {
              token0 {
                symbol
              }
              token0Price
              token1 {
                symbol
              }
              token1Price
            }
        }
          `

        boson.getEthPrice(template).then((data) => {
            Helper.ethPrice = data.pools[0].token1Price
            Helper.getAllTokenPrices()
        })
    }

    public static getAllTokenPrices(){
        Helper.currencyPrices.forEach(currencyPrice => {
            Helper.getTokenData(currencyPrice)
        });
    }

    public static getTokenData(_currencyPrice:CurrencyPrice){
        let template: TemplateStringsArray = Helper.passTemplate`
        query($token0:String) {
            token(id: $token0) {
              name
              symbol
              derivedETH
            }
          }
          `
        boson.getTokenData(template,_currencyPrice.tokenID).then((data) => {
            Helper.currencyPrices.forEach(currencyPrice => {
                if(data.token!=null){
                    if(currencyPrice.tokenID == _currencyPrice.tokenID){
                        currencyPrice.price = data.token.derivedETH*Helper.ethPrice
                    }
                }
            });
        })
    }

}
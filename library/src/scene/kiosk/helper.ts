import { toBigNumber } from "eth-connect";
import * as boson from "../../core-sdk";
import { eCurrency } from "./enums";

export class CurrencyTexture {
  texture: Texture;
  currency: eCurrency;

  constructor(_texture: Texture, _currency: eCurrency) {
    this.texture = _texture;
    this.currency = _currency;
  }
}

export class CurrencyPrice {
  tokenID: string;
  price = -1; // Cost in dollars per 1 whole token
  currency: eCurrency;
  name: string;

  constructor(_tokenID: string, _currency: eCurrency) {
    this.tokenID = _tokenID;
    this.currency = _currency;
    this.name = Helper.getCurrencyLabel(_currency);
  }
}

export class Helper {
  static ethPrice = -1; // Cost in dollars per 1 whole token

  static currencyTextures: CurrencyTexture[] = [
    new CurrencyTexture(
      new Texture("images/kiosk/ui/currency/mana.png", { hasAlpha: true }),
      eCurrency.mana
    ),
    new CurrencyTexture(
      new Texture("images/kiosk/ui/currency/eth.png", { hasAlpha: true }),
      eCurrency.eth
    ),
    new CurrencyTexture(
      new Texture("images/kiosk/ui/currency/matic.png", { hasAlpha: true }),
      eCurrency.matic
    ),
    new CurrencyTexture(
      new Texture("images/kiosk/ui/currency/weth.png", { hasAlpha: true }),
      eCurrency.weth
    ),
    new CurrencyTexture(
      new Texture("images/kiosk/ui/currency/boson.png", { hasAlpha: true }),
      eCurrency.boson
    ),
    new CurrencyTexture(
      new Texture("images/kiosk/ui/currency/usdc.png", { hasAlpha: true }),
      eCurrency.usdc
    ),
    new CurrencyTexture(
      new Texture("images/kiosk/ui/currency/tether.png", { hasAlpha: true }),
      eCurrency.usdt
    ),
    new CurrencyTexture(
      new Texture("images/kiosk/ui/currency/dai.png", { hasAlpha: true }),
      eCurrency.dai
    ),
    new CurrencyTexture(
      new Texture("images/kiosk/ui/currency/usd.png", { hasAlpha: true }),
      eCurrency.usd
    ),
  ];

  static currencyPrices: CurrencyPrice[] = [
    new CurrencyPrice(
      "0x0f5d2fb29fb7d3cfee444a200298f468908cc942",
      eCurrency.mana
    ),
    new CurrencyPrice(
      "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
      eCurrency.matic
    ),
    new CurrencyPrice(
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      eCurrency.weth
    ),
    new CurrencyPrice(
      "0xc477d038d5420c6a9e0b031712f61c5120090de9",
      eCurrency.boson
    ),
    new CurrencyPrice(
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      eCurrency.usdc
    ),
    new CurrencyPrice(
      "0xdac17f958d2ee523a2206206994597c13d831ec7",
      eCurrency.usdt
    ),
    new CurrencyPrice(
      "0x6b175474e89094c44da98b954eedeac495271d0f",
      eCurrency.dai
    ),
  ];

  public static getTokenDecimals(tokenAddress: string): number {
    switch (tokenAddress.toLowerCase()) {
      case "0xe6b8a5cf854791412c1f6efc7caf629f5df1c747".toLowerCase(): //USDC mumbai
      case "0x2791bca1f2de4661ed88a30c99a7a9449aa84174".toLowerCase(): //USDC polygon
      case "0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832".toLowerCase(): //USDT mumbai
      case "0xc2132D05D31c914a87C6611C10748AEb04B58e8F".toLowerCase(): //USDT polygon
        return 6;
    }
    return 18;
  }

  public static hideAllEntities(_entities: Entity[]) {
    _entities.forEach((entity) => {
      if (entity.isAddedToEngine()) {
        engine.removeEntity(entity);
      }
    });
  }

  public static showAllEntities(_entities: Entity[]) {
    _entities.forEach((entity) => {
      engine.addEntity(entity);
    });
  }

  public static priceTransform(_value: string, decimals = 18): string {
    const bnValue = toBigNumber(_value).div(toBigNumber("10").pow(decimals));
    return bnValue.toString();
  }

  public static nPriceTransform(_value: string, decimals = 18): number {
    const bnValue = toBigNumber(_value).div(toBigNumber("10").pow(decimals));
    return bnValue.toNumber();
  }

  public static addNewLinesInString(
    _text: string,
    _maxCharacters: number,
    _maxLines: number
  ) {
    if (_text == undefined) {
      return "";
    }

    if (_text.length <= _maxCharacters) {
      return _text; // No need to add new lines
    }

    let formattedText = "";
    let countBack = 0;
    let previousCountBack = 0;
    let currentLines = 0;

    let index = 0;
    while (_text.length > 0 && currentLines < _maxLines) {
      let differenceFromMax: number = _maxCharacters * index - _text.length;

      if (differenceFromMax <= 0) {
        differenceFromMax = 0;
      }

      //Check to see if we are at a space
      let lettersToSearch = _maxCharacters;
      previousCountBack = countBack;
      while (
        _text.charAt(
          _maxCharacters +
            _maxCharacters * index -
            differenceFromMax -
            countBack
        ) != " " &&
        lettersToSearch > 0
      ) {
        countBack += 1;
        lettersToSearch--;
      }
      if (lettersToSearch != 0) {
        // Found a space
        countBack -= 1; // Don't bring the space with you
      } else {
        // No space found so bring the whole block of text
        countBack = 0;
      }

      let numberOfLineBreaks = 0;

      if (currentLines < _maxLines) {
        const textToAdd = _text.slice(
          _maxCharacters * index - previousCountBack,
          _maxCharacters +
            _maxCharacters * index -
            differenceFromMax -
            countBack
        );
        formattedText += textToAdd + "\n";

        // If the text we are adding has line breaks already add them onto the counter
        numberOfLineBreaks = textToAdd.split(/^/gm).length;
        if (numberOfLineBreaks > 0) {
          numberOfLineBreaks -= 1;
        }
      }

      currentLines += numberOfLineBreaks + 1;

      if (currentLines >= _maxLines) {
        formattedText = formattedText.slice(0, formattedText.length - 2);
        formattedText += "...";
      }

      if (index * _maxCharacters - countBack >= _text.length) {
        break;
      }
      index++;
    }

    return formattedText;
  }

  public static getIPFSImageTexture(_value: string): Promise<Texture> {
    const url: string =
      "https://gray-permanent-fly-490.mypinata.cloud/ipfs/" +
      _value.split("ipfs://")[1];

    return new Promise<Texture>((resolve) => {
      fetch(url).then(
        (response) => {
          log(response);
          if (response.status == 400) {
            resolve(new Texture("images/kiosk/ui/waitingForImage.png"));
          }
          resolve(new Texture(url));
        },
        () => {
          resolve(new Texture("images/kiosk/ui/waitingForImage.png"));
        }
      );
    });
  }

  public static getCurrencyTexture(currency: eCurrency): Texture {
    for (let i = 0; i < Helper.currencyTextures.length; i++) {
      if (Helper.currencyTextures[i].currency == currency) {
        return Helper.currencyTextures[i].texture;
      }
    }
    log("Error - no texture for currency");
    return new Texture(""); // Missing texture
  }

  public static getProductCurrency(_currencyName: string): eCurrency {
    switch (_currencyName.toLowerCase()) {
      case "eth":
        return eCurrency.eth;
      case "matic":
        return eCurrency.matic;
      case "weth":
        return eCurrency.weth;
      case "mana":
        return eCurrency.mana;
      case "boson":
        return eCurrency.boson;
      case "usdc":
        return eCurrency.usdc;
      case "usdt":
        return eCurrency.usdt;
      case "dai":
        return eCurrency.dai;
      case "usd":
        return eCurrency.usd;
    }

    log("Error - no currency matched");
    return eCurrency.none;
  }

  public static getCurrencySymbol(_eCurrency: eCurrency): string {
    switch (_eCurrency) {
      case eCurrency.eth:
        return "eth";
      case eCurrency.matic:
        return "matic";
      case eCurrency.weth:
        return "weth";
      case eCurrency.mana:
        return "mana";
      case eCurrency.boson:
        return "boson";
      case eCurrency.usdc:
        return "usdc";
      case eCurrency.usdt:
        return "usdt";
      case eCurrency.dai:
        return "dai";
      case eCurrency.usd:
        return "usd";
    }

    log("Error - no currency matched");
    return "";
  }

  public static getCurrencyLabel(_eCurrency: eCurrency): string {
    switch (_eCurrency) {
      case eCurrency.eth:
        return "Ethereum";
      case eCurrency.matic:
        return "Matic";
      case eCurrency.weth:
        return "Wrapped Ethereum";
      case eCurrency.mana:
        return "Mana";
      case eCurrency.boson:
        return "Boson Protocol";
      case eCurrency.usdc:
        return "USD Coin";
      case eCurrency.usdt:
        return "Tether";
      case eCurrency.dai:
        return "Dai";
      case eCurrency.usd:
        return "United States Dollar";
    }

    return "";
  }

  public static passTemplate(
    _template: TemplateStringsArray
  ): TemplateStringsArray {
    return _template;
  }

  public static refreshPrices() {
    try {
      const template: TemplateStringsArray = Helper.passTemplate`
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
        `;
      boson
        .getEthPrice(template)
        .then((data) => {
          Helper.ethPrice = data.pools[0].token1Price;
          Helper.getAllTokenPrices();
        })
        .catch((e) => {
          log(e);
        });
    } catch (e) {
      log(e);
    }
  }

  public static getAllTokenPrices() {
    Helper.currencyPrices.forEach((currencyPrice) => {
      Helper.getTokenData(currencyPrice);
    });
  }

  public static getTokenData(_currencyPrice: CurrencyPrice) {
    try {
      const template: TemplateStringsArray = Helper.passTemplate`
      query($token0:String) {
          token(id: $token0) {
            name
            symbol
            derivedETH
          }
        }
        `;
      boson
        .getTokenData(template, _currencyPrice.tokenID)
        .then((data) => {
          if (
            data.token &&
            data.token.derivedETH &&
            Number(data.token.derivedETH)
          ) {
            Helper.currencyPrices.forEach((currencyPrice) => {
              if (currencyPrice.tokenID == _currencyPrice.tokenID) {
                currencyPrice.price =
                  Number(data.token.derivedETH) * Helper.ethPrice;
              }
            });
          } else {
            log(
              `WARNING: Token data for ${JSON.stringify(
                _currencyPrice
              )} not available on Uniswap_v3`
            );
            Helper.useCryptoCompare(_currencyPrice);
          }
        })
        .catch((e) => {
          Helper.useCryptoCompare(_currencyPrice);
          throw e;
        });
    } catch (e) {
      log(e);
    }
  }

  public static useCryptoCompare(_currencyPrice: CurrencyPrice) {
    try {
      const timestamp = Date.now();
      const symbol = Helper.getCurrencySymbol(_currencyPrice.currency);
      const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=USD&limit=1&toTs=${timestamp}`;
      fetch(url).then(
        (response) => {
          if (response.status == 400) {
            response.text().then((e) => {
              throw e;
            });
          }
          response.json().then((respJson: any) => {
            if (respJson.Response === "Success") {
              const value = respJson?.Data?.Data?.[0].close;
              if (isNaN(value)) {
                throw respJson;
              }
              log(
                `Found ${symbol} currency price using cryptocompare API: ${value}`
              );
              Helper.currencyPrices.forEach((currencyPrice) => {
                if (currencyPrice.tokenID == _currencyPrice.tokenID) {
                  currencyPrice.price = Number(value);
                }
              });
            } else {
              throw respJson;
            }
          });
        },
        (reason) => {
          throw reason;
        }
      );
    } catch (e) {
      log(
        `Unable to get token price for ${_currencyPrice.name} using cryptocompare API`,
        e
      );
    }
  }
}

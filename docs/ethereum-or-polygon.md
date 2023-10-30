[![banner](assets/banner.png)](https://bosonprotocol.io)

< [Boson Protocol Metaverse Toolkit - Decentraland Library](../README.md)

# Choosing which blockchain (Ethereum or Polygon) are you going to use for Boson Protocol

Your choice between [Ethereum](https://ethereum.org/en/) and [Polygon](https://polygon.technology/polygon-pos) must consider different points, detailed here after:
| | Ethereum | Polygon |
| - | - | - |
| ***transaction fees*** | Choosing Ethereum means your scene's users will pay transaction fees to operate with Boson Protocol. These fees may be significant (ex: ~$5), to be compared with the price of the items being purchased. | Choosing Polygon means the transaction fees will be much lower than on Ethereum (ex: $0.02) and the transactions are confirmed quicker. However, at least for the transactions operated from Decentraland, you will have to use a *meta-transactions relayer** and You will pay the gas fees, instead of your users.
***payment currencies*** | Users will commit to Boson Protocol products, paying in Ether (native currency) or ERC20 tokens on Ethereum | users will commit to Boson Protocol products, paying in MATIC (native currency) or ERC20 tokens on Polygon, meaning they will have to bridge their funds from Ethereum to Polygon, if not done yet.
***token-gated offers*** (Boson Protocol allows you to create token-gated products, meaning that only users that owns specific tokens (ERC20 or NFT ERC721/ERC1155) can commit to them.) | The token (ERC20 or NFT ERC721/ERC1155) used for the token-gating condition must be an Ethereum token | The token (ERC20 or NFT ERC721/ERC1155) used for the token-gating condition must be a Polygon token
***meta-transactions*** (in Decentraland, the user wallet is forced to be connected to Ethereum, meaning that, to interact with another blockchain, transactions need to be relayed - we called them *meta-transactions**) | on Ethereum, use of *meta-transaction** is not required | in Decentraland, use of *meta-transaction** is required on the deployed scenes to interact with smart contracts on another chain than Ethereum. However, during development, the scene's local preview can run without meta-transaction. We advice the scene builder to subscribe to [Biconomy](biconomy.io) that provides a meta-transaction relayer service (also called gas-less transactions). A proper configuration needs to be done to setup the relaying service, and this configuration needs to be passed on ***boson-dcl*** when initializing - see [Configure the Meta-transactions Relay using Biconomy](./biconomy.md).




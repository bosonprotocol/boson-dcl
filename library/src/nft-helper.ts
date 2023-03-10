import * as eth from "eth-connect"
import { abis } from "@bosonprotocol/common"

let specifiedRequestManager: eth.RequestManager
let specifiedWalletAddress: string
let specifiedInventory: any

export enum NFTType {
    ERC20,
    ERC721,
    ERC1155
}

async function checkL2(contractId: string, tokenId: string | undefined, nftType: NFTType): Promise<number> {
    try {
        let abi
        if (nftType == NFTType.ERC721) {
            abi = abis.ERC721EnumerableABI
        }
        else if (nftType == NFTType.ERC20) {
            abi = abis.ERC20ABI
            tokenId = undefined
        }
        else {
            abi = abis.ERC1155ABI
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const contract: any = await new eth.ContractFactory(specifiedRequestManager, abi).at(contractId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any

        let rtn = 0
        if (tokenId) {
            rtn = await contract.balanceOf(specifiedWalletAddress, tokenId)
        }
        else {
            rtn = await contract.balanceOf(specifiedWalletAddress)
            const decimals: number = await contract.decimals()
            rtn = (rtn/ Math.pow(10, decimals))

        }
        return rtn
    }
    catch (e) {
        log(e)
        return 0
    }
}

function urnMatchesContractAndBlock(urn: string, contractAndBlock: string): boolean {
    const urnArr: string[] = urn.split(":")
    if (urnArr.length < 2) {
        return false
    }
    const urnBlock: string | undefined = urnArr.pop()
    const urnContract: string | undefined = urnArr.pop()
    const rtn: boolean = (urnContract + ":" + urnBlock) == contractAndBlock
    return rtn
}

async function checkWearables(contractId: string, tokenId: string): Promise<number> {
    let rtn = 0
    const inventory = specifiedInventory

    for (let inventoryIndex = 0; inventoryIndex < inventory.length; inventoryIndex++) {
        const wearableUrn: string = inventory[inventoryIndex]
        log("inventory wearable: " + wearableUrn)
        if (urnMatchesContractAndBlock(wearableUrn.toLowerCase(), contractId.toLowerCase() + ":" + tokenId.toLowerCase())) {
            rtn += 1
        }
    }
    return rtn
}

export async function hasNft(walletAddress: string, contractId: string, tokenId: string, nftType: NFTType, requestManager: eth.RequestManager, inventory: any): Promise<number> {
    // no chain information so check all, likliest first
    specifiedRequestManager = requestManager
    specifiedWalletAddress = walletAddress
    specifiedInventory = inventory
    let result = await checkWearables(contractId, tokenId)
        .catch(() => {
            return 0
        })
        .then((result: number) => {
            return result
        })

    if (result) {
        return result
    }
    result = await checkL2(contractId, tokenId, nftType)
        .catch(() => {
            return 0
        })
        .then((result: number) => {
            return result
        })

    return result
}

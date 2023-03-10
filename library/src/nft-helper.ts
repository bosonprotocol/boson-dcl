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

async function checkL1(contractId: string, tokenId: string, nftType: NFTType) {
    try {
        const factory = new eth.ContractFactory(specifiedRequestManager, nftType == NFTType.ERC721 ? abis.ERC721EnumerableABI : abis.ERC1155ABI)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const contract: any = (await factory.at(contractId))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let value: any
        if (tokenId) {
            if (nftType == NFTType.ERC721) {
                value = await contract.ownerOf(tokenId)
                if (value.toLowerCase() == specifiedWalletAddress.toLowerCase()) {
                    return true
                }
                else {
                    return false
                }
            }
            else {
                value = await contract.balanceOf(specifiedWalletAddress, tokenId)
                if (value > 0) {
                    return true
                }
                else {
                    return false
                }
            }

        }
        else {
            value = await contract.balanceOf(specifiedWalletAddress)
            if (value > 0) {
                return true
            }
            else {
                return false
            }
        }

    } catch (error) {
        log(error)
        return false
    }
}

async function checkL2(contractId: string, tokenId: string, nftType: NFTType) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const contract: any = await new eth.ContractFactory(specifiedRequestManager, nftType == NFTType.ERC721 ? abis.ERC721EnumerableABI : abis.ERC1155ABI).at(contractId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let value: any
        if (tokenId) {
            if (nftType == NFTType.ERC721) {
                value = await contract.ownerOf(tokenId)
                if (value.toLowerCase() == specifiedWalletAddress.toLowerCase()) {
                    return true
                }
                else {
                    return false
                }
            }
            else {
                value = await contract.balanceOf(specifiedWalletAddress, tokenId)
                if (value > 0) {
                    return true
                }
                else {
                    return false
                }
            }

        }
        else {
            value = await contract.balanceOf(specifiedWalletAddress)
            if (value > 0) {
                return true
            }
            else {
                return false
            }
        }
    }
    catch (e) {
        log(e)
        return false
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

async function checkWearables(contractId: string, tokenId: string) {
    let rtn = false
    const inventory = specifiedInventory

    for (let inventoryIndex = 0; inventoryIndex < inventory.length; inventoryIndex++) {
        const wearableUrn: string = inventory[inventoryIndex]
        if (urnMatchesContractAndBlock(wearableUrn.toLowerCase(), contractId.toLowerCase() + ":" + tokenId.toLowerCase())) {
            rtn = true
            break
        }
    }
    return rtn
}

export async function hasNft(walletAddress: string, contractId: string, tokenId: string, nftType: NFTType, requestManager: eth.RequestManager, inventory: any): Promise<boolean> {
    // no chain information so check all, likliest first
    specifiedRequestManager = requestManager
    specifiedWalletAddress = walletAddress
    specifiedInventory = inventory
    let result = await checkWearables(contractId, tokenId)
        .catch(() => {
            return false
        })
        .then((result: boolean) => {
            return result ? true : false
        })

    if (result) {
        return result
    }
    result = await checkL2(contractId, tokenId, nftType)
        .catch(() => {
            return false
        })
        .then((result: boolean) => {
            return result ? true : false
        })

    if (result) {
        return result
    }
    result = await checkL1(contractId, tokenId, nftType)
        .catch(() => {
            return false
        })
        .then((result: boolean) => {
            return result ? true : false
        })

    return result
}

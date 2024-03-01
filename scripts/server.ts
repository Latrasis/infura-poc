export const dynamic = 'force-dynamic' // defaults to auto
import { OpenSeaSDK, Chain } from "opensea-js";
import hre, { ethers } from 'hardhat'
import express from 'express'
import cors from 'cors'

import { ZeroAddress, type AddressLike, type BigNumberish } from "ethers";
import { ERC721__factory, Escrow, Escrow__factory } from "../typechain-types";

const INFURA_KEY = process.env["INFURA_KEY"]
const OPENSEA_KEY = process.env["OPENSEA_KEY"]
const PRIVATE_KEY = process.env["PRIVATE_KEY"]

const TOKEN_COLLATERAL = process.env["TOKEN_COLLATERAL"] ?? "USDT"
const TOKEN_DECIMALS = parseInt(process.env["TOKEN_DECIMALS"] ?? "0")

const MIN_COLLATERAL = parseInt(process.env["MIN_COLLATERAL"] ?? "10")
const MAX_COLLATERAL = parseInt(process.env["MAX_COLLATERAL"] ?? "1000000") 
const PERCENT_COLLATERAL = parseInt(process.env["COLLATERAL"] ?? "1")

async function topUp(to: AddressLike, value: BigNumberish) {
    let [owner,] = await ethers.getSigners()
    console.log(owner)
    return owner.sendTransaction({ to, value })
}

async function main() {
    const app = express()
    app.use(cors())
    
    let signer = await ethers.provider.getSigner()
    let network = await ethers.provider.getNetwork()
    if (!signer || network.name !== "mainnet") throw 'No Signer'

    let provider = new ethers.InfuraProvider("mainnet", undefined, INFURA_KEY);
    const openseaSDK = new OpenSeaSDK(provider, {
        chain: Chain.Mainnet,
        apiKey: OPENSEA_KEY,
    });

    let mainnet_deployments = await import(`../ignition/deployments/mainnet/deployed_addresses.json`)
        .then(r => JSON.parse(r) as { "Escrow#Escrow"?: AddressLike } | undefined)
        .catch(() => undefined)

    if (mainnet_deployments && ethers.isAddress(mainnet_deployments["Escrow#Escrow"])) {
        let escrow = await ethers.getContractAt("Escrow", mainnet_deployments["Escrow#Escrow"], signer)

        while (true) {
            /// Get Last Review Event
            let latestBlock = await provider.getBlockNumber()
            let blockOnDeployment: number = escrow.deploymentTransaction()?.blockNumber ?? 0;
            let lastblockReview: number = blockOnDeployment;
    
            for (let i = 1; i*10 > latestBlock - blockOnDeployment; i *= 2) {
                let events = await escrow.queryFilter(escrow.filters.onReview, -10*i, (i-1)*-10)
                if (events.length > 0) {
                    lastblockReview = events[events.length - 1].blockNumber
                    break;
                }
            }
            
            // Catchup
            let events = await escrow.queryFilter(escrow.filters["onERC721Transfer(address,address,address,uint256,bytes)"], lastblockReview, latestBlock)
            let approvedBatch: Escrow.LoanReviewStruct[] = []
            for (let event of events) {
                let [nft, operator, from, tokenId, data] = event.args
                
                let res = await openseaSDK.api.getNFT(nft, tokenId.toString(), Chain.Mainnet)
                let bestOffer = await openseaSDK.api.getBestOffer(res.nft.collection, tokenId.toString())
                let hasToken = bestOffer.protocol_data.parameters.offer.some(r => r.token == TOKEN_COLLATERAL)
                
                if (hasToken) {
                    let sampleCollateral = BigInt(bestOffer.price.current.value) * BigInt(10 ** bestOffer.price.current.decimals) * BigInt(PERCENT_COLLATERAL) / BigInt(100)
                    let maxCollateral = BigInt(MAX_COLLATERAL) * BigInt(10 ** TOKEN_DECIMALS)
                    let minCollateral = BigInt(MIN_COLLATERAL) * BigInt(10 ** TOKEN_DECIMALS)
                    if (sampleCollateral < maxCollateral && sampleCollateral >= minCollateral) {
                        console.log(`Approved`, event.eventName, await event.getTransactionReceipt(), event.args)
                        approvedBatch.push({
                            nft,
                            tokenId,
                            spender: operator,
                            token: TOKEN_COLLATERAL,
                            value: sampleCollateral
                        })
                    }
                }
            }
            
            let tx = await escrow._reviewLoans(approvedBatch)
            let reciept = await provider.waitForTransaction(tx.hash, 10)
            lastblockReview = reciept?.blockNumber!
            
            await provider.waitForBlock(latestBlock + 30)
        }
    }
    
    app.get('/api/v1/mainnet/account/:account/tokens', async (req, res) => {
        let nfts = await openseaSDK.api.getNFTsByAccount(req.params.account)
        return res.json({ nfts })
    })

    console.log("Server Listening at localhost:4444")
    app.listen(4444)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

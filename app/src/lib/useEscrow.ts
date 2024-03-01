import { AddressLike, ethers } from "ethers"

import { Escrow__factory, Escrow, TestNft__factory, TestNft } from "./typechain-types"

import { useState } from "react"
import { useSDK } from "@metamask/sdk-react"
import { useEffect } from "react"

export function useEscrow() {
    let { account } = useSDK()
    let EscrowFactory = new Escrow__factory()
    let TestNftFactory = new TestNft__factory()

    let [escrow, setEscrow] = useState<string | undefined>()
    let [nfts, setNfts] = useState<{[nft: string]: string[]}>({})
    let [userNfts, setUserNfts] = useState<[nft: string, string][]>([])


    useEffect(() => {
        if (escrow) {
            let provider = new ethers.BrowserProvider(window.ethereum!);
            let e = Escrow__factory.connect(escrow, provider)
            let filter = e.filters.onERC721Transfer(undefined, account)
        }
    }, [])
    
    const deployEscrow = async (chainId: string) => {
        let deployed: { "Escrow#Escrow"?: string } | undefined;
        try {
            deployed = await import(`./deployments/chain-${BigInt(chainId).toString()}/deployed_addresses.json`).then(r => JSON.parse(r))
        } catch (e) {
            console.warn('no deployments found for escrow')
        }
        if (deployed?.["Escrow#Escrow"]) {
            setEscrow(deployed["Escrow#Escrow"])
            return;
        }
        let provider = new ethers.BrowserProvider(window.ethereum!);
        let deployTx = await EscrowFactory.getDeployTransaction()
        let signer = await provider.getSigner()
        let res = await signer.sendTransaction(deployTx)
        let addr = ethers.getCreateAddress(res)
        setEscrow(addr)
    }

    const sendToEscrow = async (nftAddr: string, tokenId: string) => {
        let provider = new ethers.BrowserProvider(window.ethereum!);
        let signer = await provider.getSigner()
        let nft = TestNft__factory.connect(nftAddr, signer)
        await nft["safeTransferFrom(address,address,uint256,bytes)"](signer.address!, escrow!, tokenId, "")
        setUserNfts(nfts => [...nfts, [nftAddr, tokenId]])
    } 

    const deployNft = async (name: string, symbol: string) => {
        let provider = new ethers.BrowserProvider(window.ethereum!);
        let deployTx = await TestNftFactory.getDeployTransaction(name, symbol)
        let signer = await provider.getSigner()
        let res = await signer.sendTransaction(deployTx)
        let addr = ethers.getCreateAddress(res)
        let nft = TestNft__factory.connect(addr, signer)
        setNfts(nfts => ({...nfts, ...{[addr]: [] }}))
    }

    const mintToken = async (addr: string, tokens: number[]) => {
        let provider = new ethers.BrowserProvider(window.ethereum!);
        let signer = await provider.getSigner()
        let nft = TestNft__factory.connect(addr, signer)

        await nft.testMint(tokens)
        let next = [...nfts[addr], ...tokens.map(r => r.toString(16))]
        setNfts(nfts => ({...nfts, ...{[addr]: next }}))
    }

    return {
        deployNft,
        deployEscrow,
        sendToEscrow,
        mintToken,
        nfts: Object.entries(nfts).map(([nft, tokens]) => ({
            addr: nft,
            nft: TestNft__factory.connect(nft, new ethers.BrowserProvider(window.ethereum!)),
            tokens 
        })),
        escrow: escrow ? Escrow__factory.connect(escrow!) : undefined
    }
}
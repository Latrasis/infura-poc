import { AddressLike, ZeroAddress, ethers } from "ethers"

import { Escrow__factory, Escrow, TestNft__factory, TestNft, SafeERC20__factory, IERC20__factory } from "./typechain-types"

import { useState } from "react"
import { useSDK } from "@metamask/sdk-react"
import { useEffect } from "react"
import { produce } from 'immer'

export function useEscrow() {
  let { account, chainId } = useSDK()
  let EscrowFactory = new Escrow__factory()
  let TestNftFactory = new TestNft__factory()

  let [escrow, setEscrow] = useState<string | undefined>()
  let [nfts, setNfts] = useState<{
    [nft: string]: {
      name: string,
      tokens: {
        [tokenId: string]: Escrow.TokenLoanStruct,
      }
    }
  }>({})

  useEffect(() => {
    if (escrow && account && chainId) {
      let jsonRpcUrl = chainId == "0x539" ? "http://127.0.0.1:8545" : "http://127.0.0.1:4444/api/infura";
      let rpcProvider = new ethers.JsonRpcProvider(jsonRpcUrl)
      let e = Escrow__factory.connect(escrow, rpcProvider)

      e.addListener("onReview", async () => {
        for (let nft in nfts) {
          let lockedTokens = await e.lockedTokens(nft, account!)
          let updateLoans = await Promise.all(lockedTokens.map(async tokenId => [tokenId, await e.loan(nft, account!, tokenId)] as const))

          setNfts(
            produce(draft => {
              for (let [tokenId, loan] of updateLoans) {
                draft[nft].tokens[tokenId.toString()] = loan
              }
            })
          )
        }
      })
      return () => { e.removeAllListeners() };
    }
  }, [escrow])

  // useEffect(() => {
  //     let provider = new ethers.BrowserProvider(window.ethereum!);
  //     let jsonRpcUrl = provider._network.chainId == BigInt("0x539") ? "http://127.0.0.1:8545" : "http://127.0.0.1:4444/api/infura";
  //     let rpcProvider = new ethers.JsonRpcProvider(jsonRpcUrl)

  // }, [account])

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
    await nft["safeTransferFrom(address,address,uint256)"](signer.address!, escrow!, tokenId)

    setNfts(
      produce(draft => {
        draft[nftAddr].tokens[tokenId].exists = true
      })
    )
  }

  const withdrawEscrow = async (nftAddr: string, tokenId: string) => {
    let provider = new ethers.BrowserProvider(window.ethereum!);
    let signer = await provider.getSigner()

    
    
    // Get Token Loan
    let e = Escrow__factory.connect(escrow!, signer)

    let loanInfo = await e.loan(nftAddr, account!, tokenId)
    let loanToken = IERC20__factory.connect(loanInfo.token, signer)
    
    await loanToken.approve(escrow!, loanInfo.loan)
    await e.withdraw(nftAddr, tokenId)
    let state = await e.loan(nftAddr, account!, tokenId)

    setNfts(
      produce(draft => {
        draft[nftAddr].tokens[tokenId] = state
      })
    )
  }

  const deployNft = async (name: string, symbol: string) => {
    let provider = new ethers.BrowserProvider(window.ethereum!);
    let deployTx = await TestNftFactory.getDeployTransaction(name, symbol)
    let signer = await provider.getSigner()
    let res = await signer.sendTransaction(deployTx)
    let addr = ethers.getCreateAddress(res).toLowerCase()

    setNfts(produce(s => {
      s[addr] = { tokens: {}, name }
    }))
  }

  const mintToken = async (addr: string, tokens: number[]) => {
    let provider = new ethers.BrowserProvider(window.ethereum!);
    let signer = await provider.getSigner()
    let nft = TestNft__factory.connect(addr, signer)

    await nft.testMint(tokens)

    setNfts(
      produce((s) => {
        for (let token of tokens) {
          s[addr].tokens[BigInt(token).toString()] = { exists: false, loan: 0, token: "" }
        }
      })
    )
  }

  return {
    deployNft,
    deployEscrow,
    sendToEscrow,
    withdrawEscrow,
    mintToken,
    nfts,
    escrow: escrow ? Escrow__factory.connect(escrow!) : undefined
  }
}
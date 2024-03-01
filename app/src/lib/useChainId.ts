import { useEffect, useState } from "react";

export function useChainId() {
  let [chainId, setChainId] = useState<`0x${string}` | undefined>()
  const connect = async (target: "0x1" | "0x539" | "" | string) => {
    if (window.ethereum) {
      if (chainId !== target) {
        if (target === "0x539") {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [
                {
                  chainId: "0x539"
                }
              ]
            })
            setChainId(target)
          } catch (e) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x539",
                  chainName: "hardhat",
                  rpcUrls: [
                    "http://127.0.0.1:8545/"
                  ],
                  nativeCurrency: {
                    name: "xETH",
                    symbol: "xETH",
                    decimals: 18
                  }
                }
              ]
            });
          }
        }
        if (target === "0x1") {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [
                {
                  chainId: "0x1"
                }
              ]
            })
          } catch (e) {
            console.error("unable to connect to mainnet")
          }
        }
      }
      // Reload Page
      window.location.reload()
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_chainId' })
        .then(r => {
          setChainId(r as `0x${string}`)
        })
    }
  }, [])

  useEffect(() => {
    let l = window.ethereum?.on("chainChanged", () => window.location.reload())
    return () => { new Promise(r => l?.removeListener("chainChanged", r)) }
  }, [])

  return { chainId, connect }
}
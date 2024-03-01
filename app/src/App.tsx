import { useEffect, useState } from 'react'
import { useSDK } from "@metamask/sdk-react";
import { ethers } from 'ethers'
import { useChainId } from './lib/useChainId';

import { ComboBox, ComboBoxProps } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { Input } from './components/ui/input';
import { useEscrow } from './lib/useEscrow';

const APP_OPTION: ComboBoxProps["values"] = [
  { value: "0x1", label: "mainnet" },
  { value: "0x539", label: "hardhat" },
  { value: "", label: "Choose Network " }
]

export default function App() {
  const { sdk, connected, balance, balanceProcessing, provider, account } = useSDK();
  const { chainId, connect } = useChainId()
  const { escrow, deployEscrow, deployNft, nfts, mintToken, sendToEscrow } = useEscrow()

  const [newNft, setnewNft] = useState("")
  const [newNftId, setnewNftId] = useState(1)

  const reqTopup = async () => {
    try {
      if (chainId == "0x539") {
        let devProvider = new ethers.JsonRpcProvider('http://127.0.0.1:8545')
        let prevBalance = await devProvider.getBalance(account!)
        let target = ethers.parseEther("100")
        if (prevBalance < ethers.parseEther("100")) {
          const value = target - prevBalance;
          let devSigner = await devProvider.getSigner()
          await devSigner.sendTransaction({ to: account, value })
        }
      }
    } catch (err) {
      console.warn('falied to topup...', err)
    }
  }

  let [token, setToken] = useState<string|undefined>()
  let [nft, setNft] = useState<string|undefined>()
  let nftTokensIndex = nfts.findIndex(r => r.addr.toLowerCase() == nft)
  let targetNft = nfts[nftTokensIndex]

  useEffect(() => {
    reqTopup()
  }, [])

  return (
    <div className="App">
      <ComboBox value={chainId ?? ""} values={APP_OPTION} setValue={id => connect(id)}></ComboBox>
      {account && (
        <div>
          <>
            {account && `Connected account: ${account}`}
            {(!escrow && chainId) && <Button onClick={() => deployEscrow(chainId)}>Deploy Escrow</Button>}
            {escrow && <>
              <p>Escrow: {escrow.target as string}</p>
              <Button onClick={() => deployNft("sample", "SAMPLE")}>Deploy Nft</Button>
              <ComboBox value={nft} values={nfts.map(r => ({ value: r.addr.toLowerCase(), label: r.addr }))} setValue={r => setNft(r)}></ComboBox>
              <br></br>
              <Button onClick={() => mintToken(targetNft.addr, [targetNft.tokens.length + 1])}>Mint Token</Button>
              <ComboBox value={token} values={targetNft?.tokens?.map(r => ({ value: r, label: r})) ?? [] } setValue={r => setToken(r.toString())}></ComboBox>

              { token && <Button onClick={() => sendToEscrow(targetNft.addr, token!)}>Send {token}</Button> }

            </>
            }
          </>
        </div>
      )}
    </div>
  )
}
import { useEffect, useState } from 'react'
import { useSDK } from "@metamask/sdk-react";
import { ethers } from 'ethers'
import { useChainId } from './lib/useChainId';

import { ComboBox, ComboBoxProps } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { Input } from './components/ui/input';
import { useEscrow } from './lib/useEscrow';
import { Card, CardContent, CardHeader } from './components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';

const APP_OPTION: ComboBoxProps["values"] = [
  { value: "0x1", label: "mainnet" },
  { value: "0x539", label: "hardhat" },
  { value: "", label: "Choose Network " }
]

export default function App() {
  const { sdk, connected, balance, balanceProcessing, provider, account } = useSDK();
  const { chainId, connect } = useChainId()
  const { escrow, deployEscrow, deployNft, nfts, mintToken, sendToEscrow, withdrawEscrow } = useEscrow()

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

  let [token, setToken] = useState<string | undefined>()
  let [nft, setNft] = useState<string | undefined>()

  useEffect(() => { reqTopup() }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-xl mx-auto ">
        <CardHeader>
          {account && `Connected account: ${account}`}
          {!account && 'No account found'}
        </CardHeader>
        <CardContent>
          {!account && <>
            <h1 className="text-2xl font-bold text-gray-800">Welcome!</h1>
            <p className="text-gray-600">Please connect to a network to start.</p>
            <ComboBox value={chainId} values={APP_OPTION} setValue={id => connect(id)}></ComboBox>
          </>}
          {account && connected && (
            <div>
              <>
                {(!escrow && chainId) && (
                  <Button
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => deployEscrow(chainId)}
                  >
                    Deploy Escrow
                  </Button>
                )}
                {escrow && <p>Escrow: {escrow.target as string}</p>}
              </>
            </div>
          )}
        </CardContent>
      </Card >

      {escrow && <>
        <Card className="max-w-xl mx-auto my-3">
          <CardContent>
            <Table>
              <TableCaption>List of Owned/Locked Tokens</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nft</TableHead>
                  <TableHead>TokenId</TableHead>
                  <TableHead>Locked</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  Object.entries(nfts).flatMap(([addr, r]) => Object.entries(r.tokens).map(([rt, l]) => (
                    <TableRow key={addr + rt}>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{rt}</TableCell>
                      <TableCell>{l.exists ? 'Locked' : 'Not Locked'}</TableCell>
                      <TableCell>Not Available</TableCell>
                    </TableRow>
                  )))
                }
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="max-w-xl mx-auto my-3">
          <CardHeader>Deploy Nft</CardHeader>
          <CardContent className='flex flex-row'>
            <Input type="string" placeholder='Nft Name' value={newNft} onChange={(r) => setnewNft(r.target.value)}></Input>
            <Input type="string" placeholder='Nft Symbol' value={newNft.toUpperCase().slice(0, 3)} readOnly></Input>
            <Button onClick={() => {
              deployNft(newNft, newNft.toUpperCase().slice(0, 3))
              setnewNft('')
            }}>
              Deploy Nft
            </Button>
          </CardContent>
        </Card>

        <Card className="max-w-xl mx-auto my-3">
          <CardHeader>Mint Token</CardHeader>
          <CardContent className="flex flex-row">
            <ComboBox value={nft} values={Object.entries(nfts).map(([addr, r]) => ({ value: addr.toLowerCase(), label: r.name }))} setValue={r => setNft(r)}></ComboBox>
            <Button onClick={() => mintToken(nft!, [Object.keys(nfts[nft!].tokens).length + 1])} disabled={!nft}>Mint Token</Button>
          </CardContent>
        </Card>

        <Card className="max-w-xl mx-auto my-3">
          <CardHeader>Lock Token</CardHeader>
          <CardContent>
            <ComboBox value={nft} values={Object.entries(nfts).map(([addr, r]) => ({ value: addr.toLowerCase(), label: r.name }))} setValue={r => setNft(r)}></ComboBox>
            <ComboBox value={token} values={Object.entries(nfts[nft!]?.tokens ?? {})?.map(([r,]) => ({ value: r, label: r })) ?? []} setValue={r => setToken(r.toString())}></ComboBox>
            {nft && token && <Button onClick={() => sendToEscrow(nft!, token!)}>Send {token}</Button>}
          </CardContent>
        </Card>

        <Card className="max-w-xl mx-auto my-3">
          <CardHeader>Unlock Token</CardHeader>
          <CardContent>
            <ComboBox value={nft} values={Object.entries(nfts).map(([addr, r]) => ({ value: addr.toLowerCase(), label: r.name }))} setValue={r => setNft(r)}></ComboBox>
            <ComboBox value={token} values={Object.entries(nfts[nft!]?.tokens ?? {})?.map(([r,]) => ({ value: r, label: r })) ?? []} setValue={r => setToken(r.toString())}></ComboBox>
            {nft && token && <Button onClick={() => withdrawEscrow(nft!, token!)}>Send {token}</Button>}
          </CardContent>
        </Card>
      </>
      }
    </div >
  )
}
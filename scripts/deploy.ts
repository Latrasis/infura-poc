import { ethers } from "hardhat";
import { OpenSeaSDK, Chain } from "opensea-js";

const INFURA_KEY = process.env["INFURA_KEY"]
const OPENSEA_KEY = process.env["OPENSEA_KEY"]
const PRIVATE_KEY = process.env["PRIVATE_KEY"]
const COLLATERAL: number = parseInt(process.env["COLLATERAL"] ?? "10");

async function main() {

  if (!PRIVATE_KEY) {
    throw 'Missing private key'
  }
  if (!INFURA_KEY) {
    throw 'Missing INFURA key'
  }
  if (!OPENSEA_KEY) {
    throw 'Missing OPENSEA key'
  }

  const escrow = await ethers.deployContract("Escrow", [], {});
  await escrow.waitForDeployment();

  console.log(
    `Escrow deployed at ${await escrow.getAddress()}`
  );

  console.log(
    `Listening to Escrow events`
  )

  // This example provider won't let you make transactions, only read-only calls:
  const walletWithProvider = new ethers.Wallet(PRIVATE_KEY, ethers.provider);

  const openseaSDK = new OpenSeaSDK(walletWithProvider, {
    chain: Chain.Mainnet,
    apiKey: OPENSEA_KEY,
  });

  escrow.addListener("onERC721Transfer", async (nftAddr,
    operator,
    from,
    tokenId,
    data) => {
      let { nft } = await openseaSDK.api.getNFT(nftAddr, tokenId);
      let offer = await openseaSDK.api.getBestOffer(nft.collection, nft.identifier)
      let token = offer.protocol_data.parameters.offer[0].token
      let value = offer.protocol_data.parameters.offer[0].startAmount

      let debt = parseInt(value) * COLLATERAL/100

      await escrow._reviewLoan(nftAddr, tokenId, operator, token, debt)
      console.log(`Allowed loan on ${debt} based on market value ${value}, NFT: ${nftAddr}, ID: ${tokenId}`)
  })

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

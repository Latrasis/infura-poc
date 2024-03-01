import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition-ethers";

import 'dotenv/config'

const prod = (process.env.PRIVATE_KEY && process.env.INFURA_KEY) ? {
  mainnet: {
    url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
    accounts: [process.env.PRIVATE_KEY]
  },
}: {};

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ...prod
  }
};

export default config;

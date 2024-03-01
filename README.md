# PoC Infura App

This project demonstrates a basic implementation of an Nft Escrow App using Metamask and Infura.

# Instructions

```shell
# Create *.env.local and add keys
cp .env.example .env.local

# Install, you can also use pnpm
npm install

# Deploy Escrow (Optional)
npm run deploy_escrow
# Serve App
npm run app
```

## Project Structure

- `app/`
  - Frontend App
  - Example Use of Metamask SDK
  - Includes a network switch (`hardhat`/`mainnet`)
  - `typechain-types` copied over from root project
- `scripts/`
  - `server.ts`
    - Example use of Ethers/Infura Provider
    - Listens on port 4444 as a infura service to protect private keys
    - Provides example small mainnet api
    - Collects logs on ERC721Reciever events from the Escrow to fascilitate
      price lookups
- `contracts/`:
   - `Escrow.sol`
      - Minimal Escrow implementation, and `ERC721Reciever`
      - Events:
        -  `OnReview`
            - Used as checkpoint for batched reviewed transfers
            - Allows the node to quickly find lastBlock which last review batch was completed 
        - `onErc721Transfer`
          - Each event is batched and reviewed within `_reviewLoans`
          - A corresponding value is found and a maximum loan is given via designated `ERC20` token




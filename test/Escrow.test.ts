import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import { ethers } from "hardhat";
  
  describe("Escrow", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deploy() {
      // Contracts are deployed using the first signer/account by default
      const [owner, otherAccount] = await ethers.getSigners();
  
      const Escrow = await ethers.getContractFactory("Escrow");
      const escrow = await Escrow.deploy();
  
      return { escrow, owner, otherAccount };
    }
  
    describe("Deployment", function () {
      it("Should set the right unlockTime", async function () {
        const { escrow, owner } = await loadFixture(deploy);
  
        expect(await escrow.owner()).to.equal(owner.address);
      });
    })
  });
  
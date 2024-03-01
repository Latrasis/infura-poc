import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TestNft", (m) => {
  const testNft = m.contract("TestNft", ["test", "TST"]);

  return { testNft };
});
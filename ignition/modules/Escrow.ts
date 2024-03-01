import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Escrow", (m) => {
  const escrow = m.contract("Escrow", []);

  return { escrow };
});
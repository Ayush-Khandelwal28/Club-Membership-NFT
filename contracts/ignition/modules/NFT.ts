import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NFTModule = buildModule("ClubNFT", (m) => {

  const NFTContract = m.contract("ClubNFT");

  return { NFTContract };
});

export default NFTModule;

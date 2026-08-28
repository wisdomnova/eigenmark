const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment of ProofChainRegistry");

  const ProofChainRegistry = await ethers.getContractFactory("ProofChainRegistry");
  const registry = await ProofChainRegistry.deploy();

  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log(`ProofChainRegistry successfully deployed to address: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

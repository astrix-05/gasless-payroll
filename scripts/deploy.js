const { ethers } = require("hardhat");
const { saveDeployment } = require("./utils/save-deployment");
const { verify } = require("./utils/verify");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy USDT mock for testnet
  const USDT = await ethers.getContractFactory("USDTMock");
  const usdt = await USDT.deploy();
  await usdt.waitForDeployment();
  console.log("USDT deployed to:", await usdt.getAddress());

  // Deploy WhitechainPayment contract
  const WhitechainPayment = await ethers.getContractFactory("WhitechainPayment");
  const payment = await WhitechainPayment.deploy(await usdt.getAddress());
  await payment.waitForDeployment();
  console.log("WhitechainPayment deployed to:", await payment.getAddress());

  // Deploy ENSv2 Permissioned Registry (if not already deployed)
  // Note: ENSv2 is deployed on Sepolia testnet, we don't need to deploy it again
  // But we may need to deploy a custom resolver for our use case
  const ENSv2Resolver = await ethers.getContractFactory("ENSv2PermissionedResolver");
  const resolver = await ENSv2Resolver.deploy();
  await resolver.waitForDeployment();
  console.log("ENSv2Resolver deployed to:", await resolver.getAddress());

  // Save deployment addresses
  await saveDeployment({
    usdt: await usdt.getAddress(),
    payment: await payment.getAddress(),
    resolver: await resolver.getAddress()
  });

  // Verify contracts on testnet
  if (process.env.VERIFY === "true") {
    await verify(await usdt.getAddress(), []);
    await verify(await payment.getAddress(), [await usdt.getAddress()]);
    await verify(await resolver.getAddress(), []);
  }

  console.log("Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
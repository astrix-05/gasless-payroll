const fs = require("fs");
const path = require("path");

async function saveDeployment(deployment) {
  const deploymentsDir = path.join(__dirname, "..", "deployments");

  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const network = process.env.HARDHAT_NETWORK || "hardhat";
  const deploymentFile = path.join(deploymentsDir, `${network}.json`);

  let deployments = {};
  if (fs.existsSync(deploymentFile)) {
    deployments = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  }

  deployments = { ...deployments, ...deployment };
  fs.writeFileSync(deploymentFile, JSON.stringify(deployments, null, 2));
  console.log(`Deployment saved to ${deploymentFile}`);
}

module.exports = { saveDeployment };
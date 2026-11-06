const { ethers } = require("hardhat");

async function verify(address, args) {
  try {
    await ethers.verify(address, args);
    console.log(`Verified ${address}`);
  } catch (error) {
    console.error(`Verification failed for ${address}:`, error.message);
  }
}

module.exports = { verify };
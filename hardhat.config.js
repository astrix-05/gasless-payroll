require("@nomicfoundation/hardhat-toolbox");
require("dotenv/config");

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    whitechainSepolia: {
      url: process.env.WHITECHAIN_SEPOLIA_RPC || "https://rpc.testnet.whitechain.io",
      chainId: 1874,
      accounts: [PRIVATE_KEY]
    },
    whitechainMainnet: {
      url: process.env.WHITECHAIN_MAINNET_RPC || "https://rpc.mainnet.whitechain.io",
      chainId: 1875,
      accounts: [PRIVATE_KEY]
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC || "",
      chainId: 11155111,
      accounts: [PRIVATE_KEY]
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./tests",
    artifacts: "./artifacts"
  }
};
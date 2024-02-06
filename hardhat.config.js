require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1337
    },
    sepolia: {
      url: process.env.SEPOLIA_TESTNET_RPC_URL,
      accounts: [process.env.TESTNET_PRIVATE_KEY]
    },
    redbelly: {
      url: process.env.REDBELLY_DEVNET_RPC_URL,
      accounts: [process.env.TESTNET_PRIVATE_KEY]
    }
  },
  paths: {
    artifacts: "./frontend/app/artifacts"
  }
};

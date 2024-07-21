require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

const {PRIVATE_KEY } = process.env;

module.exports = {
  defaultNetwork: "amoy",
  networks: {
    hardhat: {
    },
    amoy: {
      url: "https://rpc.ankr.com/polygon_amoy",
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
}


require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-storage-layout");

module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: "https://ropsten.infura.io/v3/c78b9b37c9e146689c1199dbf4904057",
      },
    },
  },
  solidity: "0.4.21",
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
    outputSelection: {
      "*": {
        "*": ["storageLayout"],
      },
    },
  },
};

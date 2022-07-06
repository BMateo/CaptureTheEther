require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");

module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: "https://speedy-nodes-nyc.moralis.io/69e5a6d7dc8571dc88d12837/eth/ropsten/archive",
      },
    },
  },
  solidity: "0.4.21",
};

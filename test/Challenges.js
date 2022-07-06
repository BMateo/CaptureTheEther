const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Capture The Ether", function () {
  it.skip("Guess The Secret Number", async function () {
    const Contract = await ethers.getContractAt(
      "GuessTheSecretNumberChallenge",
      "0xe5D07A2789fC30c9A471d0aBe055A6e18059dc2e"
    );

    const Guesser = await ethers.getContractFactory("Guesser");
    const guesser = await Guesser.deploy();
    await guesser.deployed();

    let answerHash =
      "0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365";

    console.log(await guesser.guessAnswer()); //170

    await Contract.guess(await guesser.guessAnswer(), {
      value: "1000000000000000000",
    });
    expect(await Contract.isComplete()).to.be.true;
  });

  it("Guess The Random Number", async function () {
    const Contract = await ethers.getContractAt(
      "GuessTheRandomNumberChallenge",
      "0xd628E60ad0d54e1A307ae253c63C6B57d29992a5"
    );

    let slot0 = await web3.eth.getStorageAt(Contract.address, 0);

    console.log(await Contract.isComplete());
  });
});

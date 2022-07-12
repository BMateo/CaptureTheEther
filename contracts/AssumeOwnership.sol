pragma solidity ^0.4.21;

/**
    The contract doesnt have a constructor
    Anyone can call AssumeOwmershipChallenge()
 */
contract AssumeOwnershipChallenge {
    address owner;
    bool public isComplete;

    function AssumeOwmershipChallenge() public {
        owner = msg.sender;
    }

    function authenticate() public {
        require(msg.sender == owner);

        isComplete = true;
    }
}
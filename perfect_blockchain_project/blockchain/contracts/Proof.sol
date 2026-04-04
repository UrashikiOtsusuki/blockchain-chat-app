
pragma solidity ^0.8.0;

contract Proof {
    string[] public hashes;

    function storeHash(string memory _hash) public returns(uint){
        hashes.push(_hash);
        return hashes.length-1;
    }

    function getHash(uint id) public view returns(string memory){
        return hashes[id];
    }
}

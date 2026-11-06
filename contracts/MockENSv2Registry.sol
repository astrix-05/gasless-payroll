// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockENSv2Registry {
    mapping(bytes32 => bool) public isSubnameRegistered;
    mapping(bytes32 => address) public subnameOwner;
    mapping(bytes32 => address) public subnameResolver;
    mapping(bytes32 => mapping(string => string)) private textRecords;

    function registerSubname(
        bytes32 subname,
        address owner,
        address resolver,
        uint256,
        uint256,
        uint256
    ) external returns (bytes32) {
        isSubnameRegistered[subname] = true;
        subnameOwner[subname] = owner;
        subnameResolver[subname] = resolver;
        return subname;
    }

    function setTextRecord(bytes32 subname, string calldata key, string calldata value) external {
        textRecords[subname][key] = value;
    }

    function getTextRecord(bytes32 subname, string calldata key) external view returns (string memory) {
        return textRecords[subname][key];
    }
}

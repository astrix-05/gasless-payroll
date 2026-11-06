// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MockENSv2Registry is IERC721 {
    string public name = "ENSv2Registry";
    string public symbol = "ENSv2";

    mapping(bytes32 => bool) public isSubnameRegistered;
    mapping(bytes32 => address) public subnameOwner;
    mapping(bytes32 => address) public subnameResolver;
    mapping(bytes32 => mapping(string => string)) public textRecords;

    function registerSubname(
        bytes32 subname,
        address owner,
        address resolver,
        uint256 expiry,
        uint256 dataExpiry,
        uint256 permissions
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

    function isSubnameRegistered(bytes32 subname) external view returns (bool) {
        return isSubnameRegistered[subname];
    }

    function ownerOf(bytes32 subname) external view returns (address) {
        return subnameOwner[subname];
    }

    function resolverOf(bytes32 subname) external view returns (address) {
        return subnameResolver[subname];
    }

    // IERC721 interface stubs
    function ownerOf(uint256 id) external view returns (address) {
        return address(0);
    }

    function balanceOf(address owner) external view returns (uint256) {
        return 0;
    }

    function ownerOf(address owner, bytes32 name) external view returns (address) {
        return subnameOwner[name];
    }

    function supportsInterface(bytes4 interfaceId) external pure override returns (bool) {
        return interfaceId == 0x01ffc9a7; // ERC165
    }

    function name() external view returns (string memory) {
        return name;
    }

    function symbol() external view returns (string memory) {
        return symbol;
    }
}
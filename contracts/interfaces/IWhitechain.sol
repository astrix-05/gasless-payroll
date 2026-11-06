// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IWhitechain {
    function createInvoice(
        uint256 amount_,
        uint256 daysValid_,
        bytes32 ensSubname_,
        address _relayer
    ) external returns (bytes32 invoiceId);

    function makePayment(bytes32 invoiceId_, uint256 amount, bytes32 permitSignature_) external payable;

    function releasePayment(bytes32 invoiceId_) external;

    function registerContractor(bytes32 ensSubname) external;

    function getENSv2Subname(address contractor) external view returns (bytes32);
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract WhitechainPayment {
    // USDT address on Whitechain Sepolia
    address public constant USDT_ADDRESS = 0xcedfB56113143d55b2358b8CFbB0dEB5Ad2f55a7;

    // --- Events ---
    event InvoiceCreated(bytes32 indexed invoiceId, address contractor, uint256 amount, bytes32 indexed ensSubname);
    event PaymentReceived(bytes32 indexed invoiceId, uint256 amount, address payer);
    event InvoiceReleased(bytes32 indexed invoiceId, uint256 amount, address contractor);
    event ContractorRegistered(address indexed contractor, bytes32 indexed ensSubname);

    // --- Invoice structure ---
    struct Invoice {
        address payable contractor;
        uint256 amount;
        uint256 deadline;
        uint256 paidAmount;
        bool released;
        bytes32 ensSubname;
    }

    // --- Mappings ---
    mapping(bytes32 => Invoice) public invoices;
    mapping(address => bytes32) public invoiceIds;

    constructor() {}

    // ==== Invoice Lifecycle ====

    /// @dev Create a new invoice with escrow
    function createInvoice(
        uint256 amount_,
        uint256 daysValid_,
        bytes32 ensSubname_
    ) external returns (bytes32 invoiceId) {
        require(amount_ > 0, "Amount must be positive");
        require(daysValid_ > 0, "Must have valid period");

        invoiceId = keccak256(abi.encodePacked(msg.sender, block.timestamp));

        invoices[invoiceId] = Invoice({
            contractor: payable(msg.sender),
            amount: amount_,
            deadline: block.timestamp + (daysValid_ * 1 days),
            paidAmount: 0,
            released: false,
            ensSubname: ensSubname_
        });

        emit InvoiceCreated(invoiceId, msg.sender, amount_, ensSubname_);
    }

    /// @dev Make USDT payment on an invoice
    function makePayment(bytes32 invoiceId_, uint256 amount) external {
        Invoice storage invoice = invoices[invoiceId_];
        require(!invoice.released, "Invoice already released");
        require(amount > 0, "Amount must be positive");
        require(block.timestamp <= invoice.deadline, "Invoice expired");

        invoice.paidAmount += amount;

        emit PaymentReceived(invoiceId_, amount, msg.sender);
    }

    /// @dev Release payment to contractor after deadline
    function releasePayment(bytes32 invoiceId_) external {
        Invoice storage invoice = invoices[invoiceId_];
        require(!invoice.released, "Invoice already released");
        require(block.timestamp > invoice.deadline, "Payment deadline not reached");
        require(invoice.paidAmount >= invoice.amount, "Payment insufficient");

        invoice.released = true;
        emit InvoiceReleased(invoiceId_, invoice.amount, invoice.contractor);
    }

    /// @dev Register contractor with ENSv2 subname
    function registerContractor(bytes32 ensSubname) external {
        bytes32 invoiceId = invoiceIds[msg.sender];
        if (invoiceId != bytes32(0)) {
            invoices[invoiceId].ensSubname = ensSubname;
        }
        emit ContractorRegistered(msg.sender, ensSubname);
    }

    /// @dev Get ENSv2 subname for a contractor
    function getENSv2Subname(address contractor) external view returns (bytes32) {
        bytes32 invoiceId = invoiceIds[contractor];
        return invoiceId != bytes32(0) ? invoices[invoiceId].ensSubname : bytes32(0);
    }
}
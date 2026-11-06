# Gasless Stablecoin Payroll

A drop-in payroll/invoicing solution that combines:
- Gasless USDT payments on Whitechain Sepolia via EIP-3009 permits
- World ID verification (Passport/Selfie) for contractor identity
- ENSv2 subnames for contributor reputation and payment history

## Prize eligibility
- **Whitechain**: Gasless USDT payments on Whitechain Sepolia (chain ID 1874)
- **World ID**: Identity verification with real credential choice
- **ENSv2**: Subname integration for contributor identity

## Features

### Contractor Onboarding
- World ID verification (Proof of Human, Passport/NFC, or Selfie Check)
- One-time identity gate before any payment flow
- Alternative rejection path demoed (expired verification, cancelled)

### Payment Flow
- Invoice creation with USDT amount and payment terms
- Gasless payment via merchant relayer using EIP-3009 permits
- Onchain payment tracking with payment gateway fee split
- Recurring payroll, renewals, and refunds supported

### Contributor Identity
- ENSv2 subname (e.g., `contractor.dao.eth`) for each verified contractor
- Permissioned text records: payment history, reputation, contact
- Subname ownership transfer and revocation support

## Tech Stack
- Whitechain Sepolia (chain ID 1874) for payments
- ENSv2 (hierarchical registry, permissioned resolver)
- World IDKit (Passport/Selfie credential options)
- EIP-3009 relayer for gasless payments
- React/Next.js frontend (mobile-first)

## Demo Workflow

1. **Contractor Verification** — Scan World ID QR code, get verified instantly, `contractor.dao.eth` name reserved.
2. **Invoice Creation** — Contractor creates invoice via UI, smart contract holds USDT in escrow.
3. **Gasless Payment** — Merchant pays via relayer without gas, contractor receives payment on Whitechain.
4. **Contributor Profile** — ENSv2 subname linked to payment history/reputation.

## Setup Instructions

### Prerequisites
- Node.js 18+
- Git
- Whitechain Sepolia RPC endpoint
- ENSv2 deployed on Sepolia
- World ID testnet credentials

### Local Development
```bash
# Clone the repo
git clone /Users/astrix_05/gasless-payroll .
cd gasless-payroll

# Install dependencies
npm install

# Start local development
npm run dev
```

### Deployment
```bash
# Testnet deployment
npm run deploy:testnet

# Production deployment
npm run deploy:mainnet
```

## Project Structure

```
.
├── contracts/
│   ├── Invoice.sol                    # Escrow + payment logic
│   ├── WhitechainPayment.sol         # EIP-3009 relayer
│   └── interfaces/
│       └── IWhitechain.sol          # Interface definitions
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WorldIDVerification.jsx  # IDKit integration
│   │   │   ├── InvoiceForm.jsx          # Invoice creation UI
│   │   │   ├── PaymentStatus.jsx        # Payment tracking
│   │   │   └── ContributorProfile.jsx   # ENSv2 subname view
│   │   ├── pages/
│   │   │   ├── index.jsx                # Home / contractor flow
│   │   │   ├── invoice.jsx              # Invoice creation
│   │   │   └── merchant.jsx            # Merchant dashboard
│   │   ├── hooks/
│   │   │   └── useWorldID.jsx          # World ID verification hooks
│   │   └── utils/
│   │       ├── whitechain.js            # Whitechain interactions
│   │       ├── ensv2.js                 # ENSv2 interactions
│   │       └── worldid.js               # World ID utilities
├── scripts/
│   ├── deploy.js                       # Contract deployment scripts
│   └── test/                           # Local test utilities
├── docs/
│   ├── FEEDBACK.md                     # Whitechain feedback
│   └── CROPS.md                        # Censorship resistant structure
├── tests/
│   ├── contract/
│   │   ├── Invoice.test.js             # Unit tests for Invoice.sol
│   │   └── whitechain.test.js          # Payment flow tests
│   └── integration/
│       ├── worldid.test.js             # IDKit integration tests
│       └── ensv2.test.js               # ENSv2 integration tests
├── package.json
├── README.md
└── CONTRIBUTING.md
```

## License
MIT
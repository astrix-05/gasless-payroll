# Demo Script: Gasless Stablecoin Payroll

## Objective
Demonstrate complete workflow: World ID verification → ENSv2 subname → Gasless USDT payment → Contractor release

## Timing Breakdown (2-4 minutes)

### Scene 1: Setup (15 seconds)
- Open app → "Gasless Stablecoin Payroll"
- Show merchant dashboard with pending invoices

### Scene 2: Contractor Verification via World ID (20 seconds)
- Navigate to contractor verification screen
- Show World ID verification button
- Complete verification (demo shows simulated success)
- Show confirmation: Verified as real human via Proof of Human credential

### Scene 3: ENSv2 Subname Generation (10 seconds)
- Show ENSv2 subname auto-generated: `contractor001.dao.eth`
- Subname stored with payment history permissioned text records

### Scene 4: Invoice Creation (15 seconds)
- Contractor creates invoice via UI
- Specify amount: e.g., $5,000 USDT
- Specify validity: 30 days
- Specify ENS subname

### Scene 5: Gasless Payment via EIP-3009 (30 seconds)
- Merchant navigates to Merchant Dashboard
- Selects pending invoice
- Clicks "Process Gasless Payment (EIP-3009)"
- System generates EIP-3009 permit signature
- Payment processed — no gas paid by merchant
- Transaction confirmed on Whitechain Sepolia (chain ID 1874)
- USDT transferred to contractor minus 1% fee

### Scene 6: Payment Release & ENSv2 Update (15 seconds)
- Payment released after deadline
- Contractor profile updated with ENSv2 subname
- Payment history stored in permissioned ENSv2 text records

### Scene 7: Alternative Paths (10 seconds)
- Show denial path: Click "Alternative Path: Denied" → verification rejected
- Show expired/cancelled path
- Contractor still sees invoices but cannot create new ones until verified

## Technical Requirements
- Whitechain Sepolia testnet (chain ID 1874)
- USDT test tokens: 0xcedfB56113143d55b2358b8CFbB0dEB5Ad2f55a7
- ENSv2 on Sepolia
- World ID testnet simulator
- Relayer configured for gasless EIP-3009 payments
- Demo video < 3 minutes

## Submission Checklist
- [ ] Public GitHub repo with setup instructions
- [ ] Demo video < 3 minutes showing gasless payment flow
- [ ] WHITECHAIN_FEEDBACK.md completed (from docs/FEEDBACK.md)
- [ ] CROPS.md explaining censorship resistance, open source, privacy, security, accountability
- [ ] ENSv2 subname usage demonstrated in video
- [ ] World ID integration with credential selection and alternative path shown
- [ ] Gasless payment via EIP-3009 demonstrated with permit signature
- [ ] USDT payment tracked on Whitechain testnet
- [ ] FEEDBACK.md for World ID completed

## Resources
- Whitechain Docs: https://docs.whitechain.io
- World IDKit: https://docs.world.org/world-id/idkit
- ENSv2: https://docs.ens.domains/ensv2
- EIP-3009: https://eips.ethereum.org/EIPS/eip-3009
- EIP-712: https://eips.ethereum.org/EIPS/eip-712

---
*Demo script prepared for ETHGlobal Mumbai 2026 hackathon submission*
# CROPS Analysis: Gasless Stablecoin Payroll

## C: Censorship Resistant

### What Users Control
- Domain control: Frontend can be served from any domain
- Backend: Minimal server dependencies (can run on decentralized hosting)
- Payments: Onchain settlement via Whitechain

### What Happens If It Goes Away
- User can run their own backend/relayer
- Frontend is static, can be decentralized

## O: Open Source

### License
- MIT License

### User Ability to Build/Run
- Yes, developers can build and run from the repo

## P: Private

### What Third Parties Learn
- **User**: Wallet addresses (onchain, expected), IP addresses (via server), browser info
- **Server**: Wallet addresses, payment amounts, timing
- **Analytics**: Should be disabled in client for privacy

### Privacy Measures
- No analytics/tracking in client
- Sensitive data on user device

## S: Secure

### Key Management
- User-controlled keys
- Merchant relayer controlled keys
- No key custody by platform

### User Data
- Payment data on user device or decentralized storage
- Identity via World ID (zero-knowledge proofs)

## A: Accountable

### Audit Trail
- All payments onchain via Whitechain
- All identity via World ID nullifiers
- All subnames via ENSv2

### Dispute Resolution
- Onchain evidence of payment
- World ID credential verification records

---
*This document explains how the project maintains C, R, O, P, S properties for ETHGlobal Mumbai submission*
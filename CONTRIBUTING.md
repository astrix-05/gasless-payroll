# Contributing to Gasless Stablecoin Payroll

## Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

## Development Setup

### Prerequisites
- Node.js 18+
- Git
- npm or yarn

### Local Setup
```bash
git clone <repo-url>
cd gasless-payroll
cp .env.example .env
npm install
```

### Running Tests
```bash
# Contract tests
npm test

# Integration tests
npm run test:integration
```

### Starting Development
```bash
npm run dev
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Run tests
5. Submit a pull request

## Coding Standards
- Use ESLint for JavaScript/React
- Use Prettier for code formatting
- Use Solidity linter for contracts
- Write tests for all new features
- Update documentation

## Reporting Issues
Use GitHub issues with clear description and steps to reproduce.
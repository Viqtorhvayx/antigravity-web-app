# Hedera DeFi DApp: Save, Lend, Borrow

An industrial-grade decentralized application built for the Hedera Testnet ecosystem. This platform enables high-fidelity financial operations including time-locked saving, points-based lending, and reputation-driven borrowing.

**Developed by: Viqtorhvayx**

## Features

### 1. Saving & Locking
- **Multi-Asset Support:** HBAR, USDT, and USDC.
- **HBAR Staking Advantage:** 0.3% yield increase for every 3-week period of HBAR locking.
- **Early Withdrawal Penalty:** Strict 5% deduction for withdrawals made before the preset unlock date.

### 2. Lending (Liquidity Provision)
- **Points Reputation System:** Earn points based on liquidity volume and duration.
- **Convertible Yield:** Points can be converted into protocol yield rewards.

### 3. Borrowing (Reputation XP)
- **XP Scaling:** Borrower reputation (0-100 XP) determines LTV (50% to 85%) and loan duration.
- **Blacklist Protection:** Users falling below 15 XP are barred from borrowing until cooldown requirements are met.
- **Collateral:** Secure HBAR loans using stablecoins as collateral.

## Tech Stack

- **Smart Contracts:** Solidity 0.8.19 (Hedera EVM compatible)
- **Frontend:** Next.js 14, Tailwind CSS, Lucide React
- **Wallet Integration:** MetaMask (via Wagmi) & HashPack (via HashConnect)
- **Network:** Hedera Testnet

## Getting Started

### Prerequisites
- Node.js 18+
- Hedera Testnet Account (Get one at [portal.hedera.com](https://portal.hedera.com))
- MetaMask or HashPack wallet

### Installation
```bash
git clone <repository-url>
cd hedera-defi-dapp
npm install
```

### Smart Contract Deployment
1. Configure your `.env` file with your Hedera Testnet private key and account ID.
2. Deploy using Hardhat:
```bash
npx hardhat run scripts/deploy.js --network hedera_testnet
```

### Frontend Development
```bash
npm run dev
```

## Security & Design
- **Industrial Design:** Form follows function. Minimalist dark mode UI.
- **Visual Intelligence:** Circular gauges for XP and battery levels for Health Factors.
- **Modular Logic:** Decoupled vault, pool, and reputation modules.

## License
MIT License. Created by Viqtorhvayx.

# Forter - Information Finance Protocol

> **🎉 Smart Contracts Deployed - January 21, 2025**
>
> **Status**: ✅ **DEPLOYED to Base Sepolia Testnet**
> **Next**: Frontend integration with new contracts

---

## Executive Summary

Forter adalah **Information Finance Protocol** - platform Web3 yang mengubah informasi kredibel menjadi aset finansial. Kami bukan prediction market untuk gambling - kami adalah infrastruktur **permissionless** untuk memverifikasi, memonetisasi, dan membangun reputasi berbasis analisis yang akurat.

**Core Innovation**: Permissionless News + Independent Pool mechanism:

1. **Anyone can create NEWS** - Prediksi/statement dengan timeline jelas (permissionless)
2. **Anyone can create POOL** - Analisis dengan reasoning + own stake pool per news
3. **Stake on specific pool** - Back reasoning yang paling kredibel (Setuju/Tidak Setuju)

**Tagline**: "Stake on Credibility, Not Luck"

---

## 📡 Deployed Contract Addresses

> **Network**: Base Sepolia Testnet
> **Deploy Date**: January 21, 2025

### Environment Variables (Frontend)
```bash
# Copy these to your .env.local or .env file
NEXT_PUBLIC_TOKEN_ADDRESS=0x6Cf43885F95F269F51b1122657F3FBF18eC7F43A
NEXT_PUBLIC_REPUTATION_NFT_ADDRESS=0x4bA16F71dAb1229B53e1f564d92D3C6b8A8f986A
NEXT_PUBLIC_GOVERNANCE_ADDRESS=0x3581C4a29eA317A5eeE5d7015eBBDE457E3d9D5B
NEXT_PUBLIC_FORTER_ADDRESS=0xAa151A662DDCE2cd1A8DfaB5F0efbB1fb139FBeb
NEXT_PUBLIC_STAKINGPOOL_ADDRESS=0x71A3fe1BbE61cb6d79927008560127fe4c656e77
```

### Contract Details

| Contract | Address | Purpose |
|----------|---------|---------|
| **Token (USDC)** | `0x6Cf43885F95F269F51b1122657F3FBF18eC7F43A` | Staking token (6 decimals) |
| **ReputationNFT** | `0x4bA16F71dAb1229B53e1f564d92D3C6b8A8f986A` | Soulbound NFT for reputation |
| **Governance** | `0x3581C4a29eA317A5eeE5d7015eBBDE457E3d9D5B` | DAO governance contract |
| **Forter (Main)** | `0xAa151A662DDCE2cd1A8DfaB5F0efbB1fb139FBeb` | Core protocol contract |
| **StakingPool** | `0x71A3fe1BbE61cb6d79927008560127fe4c656e77` | Pool staking & rewards |

### Quick Setup

1. **Copy environment variables** to your frontend `.env.local`
2. **Update contract configuration** in `src/config/contracts.ts`
3. **Verify connection** with wallet and test staking functionality
4. **Check deployed contracts** on [Base Sepolia Explorer](https://sepolia.basescan.org/)

---

## How It Works

### Architecture Overview

```
┌─────────────────────────────────────────┐
│ NEWS (User-created, permissionless)     │
│ "ETH akan ke $5000 desember ini"        │
│ Resolution: Dec 31, 2024                │
│ Creator: @alice                         │
└─────────────────────────────────────────┘
              ↓
    ┌─────────────────┐
    │ Multiple POOLS  │ (Independent)
    └─────────────────┘
              ↓
┌──────────────────────────────────────────┐
│ POOL 1 by @bob                           │
│ Position: YES                            │
│ Reasoning: "Setuju karena ETF approval"  │
│                                          │
│ Stakes:                                  │
│ - Setuju: $1000 (10 users)              │
│ - Tidak Setuju: $200 (3 users)          │
│                                          │
│ Resolution: Same as NEWS (Dec 31)        │
│ If ETH ≥ $5000 → "Setuju" wins          │
└──────────────────────────────────────────┘
```

### User Flow

1. **Create NEWS** - Permissionless prediction dengan timeline jelas
2. **Create POOL** - Analisis dengan reasoning + evidence + stake
3. **Stake on Pools** - Back specific reasoning (Setuju/Tidak Setuju)
4. **Resolution** - Oracle verification pada tanggal yang ditentukan
5. **Rewards** - Auto-distribute 20% creator / 80% stakers

### Key Features

- ✅ **Permissionless Creation** - Siapapun bisa buat NEWS dan POOLS
- ✅ **Independent Pools** - Setiap pool punya stake pool sendiri
- ✅ **Auto-Distribute Rewards** - No manual claim needed
- ✅ **Reputation NFTs** - Soulbound tokens untuk credibility tracking
- ✅ **Point-Based System** - Dengan stake weight multipliers
- ✅ **Type-Safe Enums** - Better security & clarity

---

## Tokenomics & Incentives

### Reward Distribution

> **Updated: January 21, 2025** - New 20/80 split with auto-distribute

```
Single Pool Total Stakes (100%)
    │
    ├── Platform Fee (2%)
    │
    └── Reward Pool (98%)
         │
         ├── Pool Creator (20% of remaining) ✨ AUTO-DISTRIBUTED
         │    └── If pool position CORRECT
         │    └─ Creator is EXCLUDED from staker pool
         │
         └─ Winning Stakers (80% of remaining) ✨ AUTO-DISTRIBUTED
              ├── "Setuju" stakers (if pool correct)
              └─ OR "Tidak Setuju" stakers (if pool wrong)
```

**Key Changes:**
- Creator gets **20%** instead of 70% (fairer for stakers)
- Stakers get **80%** instead of 30% (better incentive)
- **Auto-distribute**: Rewards sent directly to wallets on resolution
- **No double-dipping**: Creator excluded from winning staker pool calculations

### Fee Structure

- Platform Fee: 2% dari total pool
- Minimum Stake: $0.5 USDC (testnet) / $5 USDC (mainnet)
- No withdrawal fees

### Staking Token

- **Staking Token**: USDC on Base network
- **No Platform Token**: Fokus pada utility, bukan speculation

---

## Dynamic Reputation NFT System

### Reputation Tiers (Point-Based)

| Tier | Points Required | Min Pools | Badge | Benefits |
|------|----------------|-----------|-------|----------|
| **Novice** | 0-199 | 0 | 🥉 Bronze | Basic access |
| **Analyst** | 200-499 | 0 | 🥈 Silver | Standard visibility |
| **Expert** | 500-999 | 5+ | 🥇 Gold | Featured in leaderboard |
| **Master** | 1,000-4,999 | 10+ | 💎 Diamond | Priority display |
| **Legend** | 5,000+ | 20+ | 👑 Crown | Elite status |

### Point Calculation

```
Total Reputation Points = Σ (Pool Points × Stake Multiplier)

Pool Points:
├─ Correct prediction: +100 points
└─ Wrong prediction: -30 points

Stake Multiplier (based on pool total stake):
├─ < $100:       1.0x (no bonus)
├─ $100-$499:    1.5x (small pool bonus)
├─ $500-$999:    2.0x (medium pool bonus)
├─ $1,000-$4,999: 2.5x (large pool bonus)
└─ $5,000+:      3.0x (whale pool bonus)
```

### NFT Features

- **Soulbound (Non-transferable)** - Tied to wallet address
- **Dynamic Metadata** - Updates based on performance
- **Visual Badges** - Tier-based appearance changes
- **On-Chain Credibility** - Portable reputation across Web3

---

## Technical Architecture

### Smart Contracts

1. **Forter.sol** - Core protocol contract
   - News & Pool creation
   - Resolution logic
   - Auto-distribute rewards

2. **StakingPool.sol** - Staking & rewards management
   - Pool staking mechanism
   - Reward distribution
   - User stake tracking

3. **ReputationNFT.sol** - Reputation system
   - Point-based calculation
   - Tier management
   - Soulbound NFT minting

4. **ForterGovernance.sol** - DAO governance
   - Protocol parameters
   - Voting mechanism
   - Fee management

### Frontend Stack

- **Next.js 14** - React framework dengan App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **RainbowKit + Wagmi** - Wallet integration
- **Zustand** - State management

### Integration Points

- **Base Network** - L2 for low fees & fast transactions
- **Farcaster** - Social identity & distribution
- **IPFS** - NFT metadata storage
- **PostgreSQL** - Off-chain data storage

---

## Quick Start Guide

### Prerequisites

- Node.js 20+
- Base Sepolia ETH & USDC (testnet)
- Wallet (MetaMask, Rainbow, etc.)

### Local Development

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd forter-news
   pnpm install
   ```

2. **Setup Environment**
   ```bash
   cp frontend/.env.example frontend/.env.local
   # Copy contract addresses from above section
   ```

3. **Run Frontend**
   ```bash
   cd frontend
   pnpm dev
   ```

4. **Connect Wallet & Test**
   - Switch to Base Sepolia network
   - Connect your wallet
   - Test creating NEWS and POOLS
   - Try staking on existing pools

### Deployment Verification

```bash
# Check contract ownership
cast call 0x8973eA30b89d8937c9DD77FAD7e669f9caD4085b "owner()"

# Check governance parameters
cast call 0xD154a97e2D4B229e9f3aa162dC4e840B4e0Ef786 "minStakeAmount()"

# Verify token decimals (should be 6 for USDC)
cast call 0xEb32CBB8ff13c5878D13A1476b0a0CF384c20681 "decimals()"
```

---

## Development Roadmap

### ✅ Phase 0: MVP (December 2024) - COMPLETED

- ✅ Core smart contracts
- ✅ Basic UI dengan market browsing
- ✅ Mock oracle resolution
- ✅ 8 curated demo markets

### ✅ Phase 1: Testnet Launch (Q1 2025) - COMPLETED

- ✅ Live testnet deployment on Base Sepolia
- ✅ Smart contracts with auto-distribute rewards
- ✅ Reputation NFT system deployed
- ✅ DAO governance system deployed
- 🔄 Frontend integration with new contracts
- 🔄 User testing dengan testnet USDC

### 🔄 Phase 2: Mainnet Beta (Q2 2025)

- 🔄 Mainnet deployment dengan limited markets
- 🔄 AI news aggregator untuk semi-automated resolution
- 🔄 Enhanced reputation system
- 🔄 Mobile-responsive design

### 🔮 Phase 3: Scale (Q3-Q4 2025)

- 🔮 Chainlink oracle integration
- 🔮 Community-created markets
- 🔮 Advanced analytics dan API
- 🔮 Cross-chain expansion plans

---

## Key Differentiators

### Information Finance vs Prediction Markets

| Aspect | Traditional Prediction Market | Forter (Information Finance) |
|--------|------------------------------|------------------------------|
| **Purpose** | Bet on outcomes | Fund credible analysis |
| **Incentive** | Win bets | Earn yield on verified insights |
| **Users** | Speculators | Analysts, researchers, informed investors |
| **Core Value** | Entertainment + speculation | Knowledge discovery + accountability |

### Permissionless Pools Architecture

**Traditional Model:** ❌
- 1 market = 1 shared pool
- All compete in same pot
- No differentiation between reasoning

**Forter Model:** ✅
- 1 news = multiple independent pools
- Each pool = unique position + reasoning
- Multiple perspectives coexist

---

## Risk Mitigation

### Quality Control

- **Minimum Stake Requirements** - Prevent spam with skin in the game
- **Reasoning Quality Score** - Algorithmic filtering
- **Reputation System** - Tier-based visibility
- **Community Reporting** - Decentralized moderation

### Technical Risks

- **Smart Contract Audits** - Professional security reviews
- **Multi-sig Controls** - Secure fund management
- **Oracle Integration** - Reliable resolution sources
- **Emergency Functions** - Safety mechanisms

---

## Get Involved

### For Developers

- Check `sc/CONTRACT_REVISION_SUMMARY.md` for technical details
- Review smart contracts on [Base Sepolia Explorer](https://sepolia.basescan.org/)
- Contribute to frontend development

### For Analysts

- Join our early analyst program
- Build on-chain reputation
- Earn from accurate analysis

### For Users

- Connect wallet and test on Base Sepolia
- Explore existing NEWS and POOLS
- Start staking on credible analysis

---

## Links & Resources

- **Explorer**: [Base Sepolia Explorer](https://sepolia.basescan.org/)
- **Contracts**: See deployed addresses above
- **Documentation**: `sc/` directory for technical details
- **Frontend**: Next.js application in `frontend/` directory

---

## License

MIT License - see LICENSE file for details

---

**Transform noise into signal, speculation into analysis, dan anonymity into accountability.**

*Forter is not just a product - it's a permissionless primitive for the information economy.*
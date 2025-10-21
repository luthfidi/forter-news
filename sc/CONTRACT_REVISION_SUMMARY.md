# 🔧 Smart Contract Revision Summary

> **Revision Date:** 2025-01-21
> **Status:** ✅ COMPLETE - Ready for Testing
> **Next Steps:** Compile with `forge build` and test

---

## 📝 Overview

All smart contracts have been revised to implement:
1. ✅ **Auto-distribute rewards** (no manual claim needed)
2. ✅ **20% creator / 80% staker reward split**
3. ✅ **Point-based reputation system with stake weight**
4. ✅ **Type-safe enums** (NewsStatus, Outcome, Position)

---

## 🔄 Changes by Contract

### **1. Forter.sol** - Main Protocol Contract

#### **A. Data Type Improvements**
**Added Enums:**
```solidity
enum NewsStatus { Active, Resolved }
enum Outcome { None, YES, NO }
enum Position { YES, NO }
```

**Changed:**
- ❌ `bool isResolved` → ✅ `NewsStatus status`
- ❌ `bool outcome` → ✅ `Outcome outcome`
- ❌ `bool position` → ✅ `Position position`

#### **B. Auto-Distribute Reward System**
**New Functions:**
- `_resolvePoolsAndDistributeRewards()` - Resolves and auto-distributes
- `_distributePoolRewards()` - Handles 20/80 split logic
- `_distributeToStakers()` - Distributes to winning stakers

**Reward Distribution Logic:**
```solidity
// When pool is CORRECT:
├─ Protocol Fee: 2% of total pool
├─ Creator Reward: 20% of remaining (auto-sent)
└─ Stakers Pool: 80% of remaining
    └─ Split proportionally among winning stakers (EXCLUDE creator)

// When pool is WRONG:
├─ Protocol Fee: 2% of total pool
├─ Creator Reward: 0% (creator gets nothing)
└─ Disagree Stakers: 98% of total pool
    └─ Split proportionally among disagree stakers
```

**Key Feature:** Creator stake is EXCLUDED from winning staker pool calculations (no double-dipping).

#### **C. Updated Events**
```solidity
event CreatorRewardDistributed(
    uint256 indexed newsId,
    uint256 indexed poolId,
    address indexed creator,
    uint256 amount
);

event StakerRewardDistributed(
    uint256 indexed newsId,
    uint256 indexed poolId,
    address indexed staker,
    uint256 amount
);

event Resolved(uint256 indexed newsId, uint8 outcome, address resolvedBy);
event PoolCreated(..., Position position, ...);
```

#### **D. Updated View Functions**
- `getNewsInfo()` - Returns `NewsStatus` and `Outcome` enums
- `getPoolInfo()` - Returns `Position` enum

---

### **2. StakingPool.sol** - Staking Management

#### **A. Removed Manual Claim System**
**Removed:**
- ❌ `claimRewards()` function
- ❌ `calculateRewards()` function
- ❌ `hasClaimedReward` mapping

**Added:**
- ✅ `rewardDistributed` mapping (tracks auto-distribution)
- ✅ `markStakeAsDistributed()` function (called by Forter)

#### **B. Auto-Distribution Support**
```solidity
function markStakeAsDistributed(
    uint256 newsId,
    uint256 poolId,
    address user
) external onlyOwner {
    // Mark stake as distributed
    Stake storage userStake = stakes[newsId][poolId][user];
    userStake.isWithdrawn = true;
    rewardDistributed[newsId][poolId][user] = true;
}
```

**Purpose:** Called by `Forter.sol` after auto-distributing rewards to prevent double-distribution.

---

### **3. ReputationNFT.sol** - Point-Based Reputation

#### **A. New Data Structures**
```solidity
struct UserReputation {
    uint256 reputationPoints;      // NEW! Point-based score
    uint256 lastUpdated;
    uint256 totalPredictions;
    uint256 correctPredictions;
    uint256 totalStakeInPools;    // NEW! Track total stake
}

struct PoolRecord {
    bool isCorrect;
    uint256 poolTotalStake;       // For stake weight calculation
    uint256 timestamp;
}
```

#### **B. Point Calculation System**
**Formula:**
```
Total Reputation Points = Σ (Base Points × Stake Multiplier)

Base Points:
├─ Correct prediction: +100 points
└─ Wrong prediction: -30 points

Stake Multiplier (based on pool total stake):
├─ < $100:   1.0x (100)
├─ $100-499: 1.5x (150)
├─ $500-999: 2.0x (200)
├─ $1K-4.9K: 2.5x (250)
└─ $5K+:     3.0x (300)
```

**Example:**
```
Analyst A creates 3 pools:
├─ Pool 1: Correct, $50 stake   → +100 × 1.0x = +100 points
├─ Pool 2: Correct, $800 stake  → +100 × 2.0x = +200 points
└─ Pool 3: Wrong, $200 stake    → -30 × 1.5x  = -45 points
────────────────────────────────────────────────────────
Total: 255 points → Tier: Analyst
```

#### **C. Tier System with Minimum Pool Requirements**
```solidity
function _calculateTier(uint256 points, uint256 totalPools) internal view returns (uint256) {
    // Tier 0: Novice (no requirements)
    if (points < 200 || totalPools == 0) return 0;

    // Tier 1: Analyst (200+ points)
    if (points < 500) return 1;

    // Tier 2: Expert (500+ points, min 5 pools)
    if (points < 1000) {
        return totalPools >= 5 ? 2 : 1;
    }

    // Tier 3: Master (1000+ points, min 10 pools)
    if (points < 5000) {
        return totalPools >= 10 ? 3 : 2;
    }

    // Tier 4: Legend (5000+ points, min 20 pools)
    return totalPools >= 20 ? 4 : 3;
}
```

**Tier Requirements:**
| Tier | Points | Min Pools | Example |
|---|---|---|---|
| Novice 🥉 | 0-199 | 0 | New user |
| Analyst 🥈 | 200-499 | 0 | 2-3 correct pools |
| Expert 🥇 | 500-999 | 5 | 5-8 correct pools with medium stakes |
| Master 💎 | 1,000-4,999 | 10 | 10+ correct pools with good accuracy |
| Legend 👑 | 5,000+ | 20 | 20+ correct high-stake pools |

#### **D. New Main Function**
```solidity
function recordPoolWithStake(
    address user,
    bool correct,
    uint256 poolTotalStake
) external onlyOwner {
    // 1. Record prediction
    // 2. Add to pool history
    // 3. Recalculate reputation points with stake weight
    // 4. Auto-mint NFT if first pool
}
```

**Replaces:** `recordPrediction()` and `increaseReputation()`

---

## 🎯 Key Design Decisions

### **1. Auto-Distribute Everything**
**Rationale:**
- ✅ Best UX - users see rewards instantly in wallet
- ✅ Gas acceptable on Base (cheap L2)
- ✅ Perfect for testnet testing
- ✅ Simpler for users (no claim step)

**Trade-off:** Higher gas cost for admin (but acceptable on Base)

### **2. 20% Creator / 80% Stakers Split**
**Rationale:**
- ✅ Incentivizes high-quality pool creation (20% reward)
- ✅ Fair for stakers (80% of winnings)
- ✅ Creator excluded from staker pool (no double-dipping)

**Example:**
```
Pool: $1,000 total
Outcome: Creator CORRECT
────────────────────────────
Protocol Fee: $20 (2%)
Remaining: $980

Creator: $196 (20% of $980)
Stakers: $784 (80% of $980)
  └─ Split among agree stakers (EXCLUDING creator's stake)
```

### **3. Point-Based Reputation with Stake Weight**
**Rationale:**
- ✅ Rewards analysts who stake more (skin in the game)
- ✅ Prevents spam (low-stake pools give fewer points)
- ✅ Encourages volume + quality
- ✅ Fairer than pure accuracy %

**Example:**
```
Analyst A: 100% accuracy, 1 pool, $10 stake
  → 100 points → Novice

Analyst B: 90% accuracy, 10 pools, avg $500 stake
  → 1,800 points → Master

Analyst B is rewarded for proven track record + higher stakes.
```

---

## 🧪 Testing Checklist

Before deployment, verify:

### **Unit Tests:**
- [ ] News creation with enum types
- [ ] Pool creation with Position enum
- [ ] Admin resolve with Outcome enum
- [ ] Auto-distribute to creator (20%)
- [ ] Auto-distribute to stakers (80%)
- [ ] Creator excluded from staker pool
- [ ] Protocol fee collection (2%)
- [ ] Reputation points calculation
- [ ] Stake weight multiplier
- [ ] Tier calculation with minimum pools

### **Integration Tests:**
- [ ] Full flow: Create news → Create pools → Stake → Resolve → Verify distributions
- [ ] Multiple stakers on same pool
- [ ] Pool creator wins scenario
- [ ] Pool creator loses scenario
- [ ] Reputation tier progression
- [ ] NFT tier updates dynamically

### **Edge Cases:**
- [ ] Pool with 0 stakers (only creator)
- [ ] Pool with 100% agree or 100% disagree
- [ ] Negative reputation points (many wrong predictions)
- [ ] Tier downgrade (if points decrease due to wrong predictions)

---

## 🚀 Deployment Steps

### **1. Compile Contracts**
```bash
cd sc
forge build
```

### **2. Run Tests**
```bash
forge test -vv
```

### **3. Deploy to Base Sepolia**
```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $BASE_SEPOLIA_RPC \
  --broadcast \
  --verify
```

### **4. Update Frontend Config**
Update `frontend/.env.local`:
```env
NEXT_PUBLIC_FORTER_ADDRESS=0x...
NEXT_PUBLIC_REPUTATION_NFT_ADDRESS=0x...
NEXT_PUBLIC_STAKINGPOOL_ADDRESS=0x...
NEXT_PUBLIC_GOVERNANCE_ADDRESS=0x...
NEXT_PUBLIC_TOKEN_ADDRESS=0x... (USDC mock)
NEXT_PUBLIC_USE_CONTRACTS=true
```

### **5. Update ABIs**
```bash
# Copy ABIs to frontend
cp sc/out/Forter.sol/Forter.json frontend/src/lib/abis/
cp sc/out/ReputationNFT.sol/ReputationNFT.json frontend/src/lib/abis/
cp sc/out/StakingPool.sol/StakingPool.json frontend/src/lib/abis/
```

---

## 📋 Migration from Old Contracts

If upgrading from previous version:

### **Breaking Changes:**
1. `bool isResolved` → `NewsStatus status` (enum)
2. `bool outcome` → `Outcome outcome` (enum)
3. `bool position` → `Position position` (enum)
4. `claimRewards()` removed (auto-distribute now)
5. `recordPrediction()` → `recordPoolWithStake()` (new params)

### **Frontend Updates Required:**
- Update `mapContractToNews()` to handle enum values
- Update `mapContractToPool()` to handle Position enum
- Remove claim buttons/UI (rewards auto-sent)
- Add creator reward display (20% indicator)
- Update reputation display (points instead of just accuracy)

---

## 🔗 Related Files

- Frontend revision notes: `frontend/FE_REVISION_NOTES.md`
- Main README: `README.md`
- Contract interfaces: `sc/src/interfaces/IForter.sol`

---

## ✅ Completion Status

| Task | Status |
|---|---|
| Add enums (NewsStatus, Outcome, Position) | ✅ Complete |
| Implement auto-distribute rewards | ✅ Complete |
| Implement 20/80 creator/staker split | ✅ Complete |
| Exclude creator from staker pool | ✅ Complete |
| Point-based reputation system | ✅ Complete |
| Stake weight multiplier | ✅ Complete |
| Tier calculation with min pools | ✅ Complete |
| Update events and view functions | ✅ Complete |
| Remove manual claim functions | ✅ Complete |
| Documentation | ✅ Complete |

**Next:** Compile, test, and deploy to Base Sepolia testnet! 🎉

# 📝 Frontend Revision Notes

> **Last Updated:** 2025-01-21
> **Status:** ✅ Ready for Implementation
> **Priority:** After Contract Revision Complete & Deployed
> **Contract Status:** ✅ All 16 tests passed, ready for deployment

---

## 🎯 Overview

This document outlines required frontend changes to align with the **finalized smart contract design**. The smart contract revision is **COMPLETE** and all tests are passing (16/16).

---

## 🔄 Design Changes Summary

### **1. Reward Distribution Model**
- **Old:** Proportional split among all winning stakers (including creator)
- **New:** 20% creator reward + 80% staker rewards (creator excluded from staker pool)
- **Distribution:** Auto-distribute on news resolution (no manual claim needed)

### **2. Reputation System**
- **Old:** Tier based on accuracy percentage only
- **New:** Point-based system with stake weight multiplier
- **Formula:** `Points = Σ (±100 per pool) × Stake Multiplier`
- **Stake Multipliers:** 1.0x (<$100), 1.5x ($100-$499), 2.0x ($500-$999), 2.5x ($1K-$4.9K), 3.0x ($5K+)

### **3. Data Type Changes**
- **Old:** `bool` for outcome, position, status
- **New:** Enums for better type safety and clarity

---

## 🔴 Critical Issues to Fix

### **Issue #1: Reward Calculation Wrong**
**File:** `frontend/src/lib/hooks/usePoolStaking.ts`
**Lines:** 80-131
**Priority:** 🔴 CRITICAL

**Problem:**
Current `calculatePotentialReward()` doesn't implement 20/80 split and includes creator in winning pool.

**Current Code:**
```typescript
// NOTE: Current smart contract implements PROPORTIONAL SPLIT
// All winning stakers (including pool creator) share the losing pool proportionally
// There is NO separate 20% analyst / 80% staker split yet
```

**Required Changes:**
```typescript
const calculatePotentialReward = (
  pool: Pool,
  stakeAmount: number,
  position: 'agree' | 'disagree'
): { minReward: number; maxReward: number; breakEven: number } => {
  const newTotalPool = pool.totalStaked + stakeAmount;
  const platformFee = newTotalPool * 0.02; // 2%
  const remaining = newTotalPool - platformFee; // 98%

  const creatorReward = remaining * 0.20; // 20% to creator
  const stakersPool = remaining * 0.80;   // 80% to stakers

  // Determine winning pool (EXCLUDE creator stake)
  let winningPool: number;
  let userWins: boolean;

  if (position === 'agree') {
    const newAgreeTotal = pool.agreeStakes + stakeAmount;
    winningPool = newAgreeTotal; // Creator stake already excluded
    userWins = true; // Assuming pool correct for max reward
  } else {
    const newDisagreeTotal = pool.disagreeStakes + stakeAmount;
    winningPool = newDisagreeTotal;
    userWins = true; // Assuming pool wrong for max reward
  }

  if (!userWins) {
    return { minReward: 0, maxReward: 0, breakEven: stakeAmount };
  }

  // User gets proportional share of 80% stakers pool
  const userShare = stakeAmount / winningPool;
  const userReward = stakersPool * userShare;

  return {
    minReward: 0, // If pool wrong, lose everything
    maxReward: userReward, // Proportional share of 80%
    breakEven: stakeAmount
  };
};
```

---

### **Issue #2: Missing Creator Reward Display**
**File:** `frontend/src/components/pools/PoolCard.tsx`
**Priority:** 🔴 CRITICAL

**Problem:**
No UI to show creator reward after resolution. Creator cannot see their 20% earnings.

**Required Addition:**
```tsx
{/* Add after resolution badge section */}
{pool.status === 'resolved' &&
 pool.outcome === 'creator_correct' &&
 pool.creatorAddress === currentUserAddress && (
  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-semibold text-green-900">
          🎉 Creator Reward Auto-Distributed
        </h4>
        <p className="text-sm text-green-700">
          You received 20% of total pool as creator reward
        </p>
        <p className="text-lg font-bold text-green-900 mt-1">
          +${calculateCreatorReward(pool)} USDC
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Sent to your wallet on {pool.resolvedAt ? formatDate(pool.resolvedAt) : 'resolution'}
        </p>
      </div>
      <div className="text-right">
        <div className="text-xs text-muted-foreground">Transaction</div>
        <a
          href={`${BLOCK_EXPLORER}/tx/${pool.rewardTxHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline"
        >
          View on Basescan →
        </a>
      </div>
    </div>
  </div>
)}

{/* Helper function */}
const calculateCreatorReward = (pool: Pool): string => {
  const fee = pool.totalStaked * 0.02;
  const remaining = pool.totalStaked - fee;
  return (remaining * 0.20).toFixed(2);
};
```

**Also Add to Profile Page:**
```tsx
{/* In Profile Earnings Tab */}
<div className="space-y-4">
  <h3 className="font-semibold">Creator Rewards (20% of Pool)</h3>
  {userCreatorRewards.map(reward => (
    <Card key={reward.poolId}>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div>
            <Link href={`/news/${reward.newsId}`} className="font-medium hover:underline">
              Pool #{reward.poolId}
            </Link>
            <p className="text-xs text-muted-foreground">
              Resolved {formatDate(reward.resolvedAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-green-600">+${reward.amount}</p>
            <a
              href={`${BLOCK_EXPLORER}/tx/${reward.txHash}`}
              className="text-xs text-primary hover:underline"
            >
              View TX
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

---

## 🟡 High Priority Issues

### **Issue #3: Pool Stats Display Incorrect**
**File:** `frontend/src/components/pools/PoolCard.tsx`
**Lines:** 26-35
**Priority:** 🟡 HIGH

**Problem:**
Creator stake is added to agree/disagree pools, but creator is separate in new model.

**Current Code:**
```typescript
const creatorAgreeStakes = pool.position === 'YES'
  ? pool.agreeStakes + pool.creatorStake
  : pool.agreeStakes;
```

**Fix:**
```typescript
// Don't add creator stake to pool stats
const agreePercentage = pool.totalStaked > 0
  ? Math.round((pool.agreeStakes / pool.totalStaked) * 100)
  : 0;

const disagreePercentage = pool.totalStaked > 0
  ? Math.round((pool.disagreeStakes / pool.totalStaked) * 100)
  : 0;

const creatorStakePercentage = pool.totalStaked > 0
  ? Math.round((pool.creatorStake / pool.totalStaked) * 100)
  : 0;
```

**UI Update:**
```tsx
{/* Show creator stake separately */}
<div className="space-y-2">
  <div className="flex items-center justify-between text-sm">
    <span className="text-muted-foreground">Creator Stake ({pool.position})</span>
    <span className="font-semibold">${pool.creatorStake} ({creatorStakePercentage}%)</span>
  </div>

  <div className="flex items-center justify-between text-sm">
    <span className="text-muted-foreground">Support Stakers</span>
    <span className="font-semibold">${pool.agreeStakes} ({agreePercentage}%)</span>
  </div>

  <div className="flex items-center justify-between text-sm">
    <span className="text-muted-foreground">Oppose Stakers</span>
    <span className="font-semibold">${pool.disagreeStakes} ({disagreePercentage}%)</span>
  </div>
</div>
```

---

### **Issue #4: Reputation Mock Data Incorrect**
**File:** `frontend/src/lib/mock-data/reputation.mock.ts`
**Priority:** 🟡 HIGH

**Problem:**
Mock data uses accuracy-based tiers, but contract uses point-based system.

**Required Changes:**
```typescript
export const MOCK_REPUTATION: Record<string, ReputationData> = {
  '0x1234...5678': {
    address: '0x1234...5678',
    accuracy: 87,
    totalPools: 12,
    correctPools: 10,
    wrongPools: 2,
    activePools: 2,
    reputationPoints: 1250, // NEW! Calculated with stake weight
    tier: 'Master', // Based on points >= 1000, not accuracy
    nftTokenId: 1,
    categoryStats: {
      'Crypto': { total: 8, correct: 7, accuracy: 87.5 },
      'Macro': { total: 4, correct: 3, accuracy: 75 }
    }
  },
  // ... update all mock entries
};
```

**Also Update Type:**
```typescript
// types/index.ts
export interface ReputationData {
  address: string;
  accuracy: number; // Still shown in UI
  totalPools: number;
  correctPools: number;
  wrongPools: number;
  activePools: number;
  reputationPoints: number; // NEW! Used for tier calculation
  tier: 'Novice' | 'Analyst' | 'Expert' | 'Master' | 'Legend';
  // ... rest
}
```

---

### **Issue #5: Staker Reward Display**
**File:** `frontend/src/components/pools/PoolCard.tsx`
**Priority:** 🟡 HIGH

**Problem:**
No display for staker rewards after auto-distribution.

**Required Addition:**
```tsx
{pool.status === 'resolved' && userStake && userStake.amount > 0 && (
  <div className={`mt-4 p-4 rounded-lg border ${
    userWon ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
  }`}>
    {userWon ? (
      <>
        <h4 className="font-semibold text-green-900">
          🎉 Staking Reward Auto-Distributed
        </h4>
        <p className="text-sm text-green-700">
          Your stake was on the winning side
        </p>
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Your Stake:</span>
            <span className="font-medium">${userStake.amount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Reward (from 80% pool):</span>
            <span className="font-bold text-green-900">+${calculateStakerReward(pool, userStake)}</span>
          </div>
          <div className="flex justify-between text-sm border-t pt-1">
            <span>Total Received:</span>
            <span className="font-bold text-green-900">${calculateTotalReceived(pool, userStake)}</span>
          </div>
        </div>
      </>
    ) : (
      <>
        <h4 className="font-semibold text-red-900">
          ❌ Stake Lost
        </h4>
        <p className="text-sm text-red-700">
          Your stake was on the losing side
        </p>
        <div className="mt-2">
          <div className="flex justify-between text-sm">
            <span>Stake Amount:</span>
            <span className="font-medium text-red-900">-${userStake.amount}</span>
          </div>
        </div>
      </>
    )}
  </div>
)}
```

---

## 🟠 Medium Priority Issues

### **Issue #6: Admin Resolution Not Connected**
**File:** `frontend/src/app/news/[id]/page.tsx`
**Lines:** 76-92
**Priority:** 🟠 MEDIUM

**Problem:**
`handleResolveNews()` just shows alert, doesn't call contract.

**Fix:**
```typescript
const handleResolveNews = async (
  outcome: 'YES' | 'NO',
  resolutionSource: string,
  resolutionNotes?: string
) => {
  try {
    setIsResolving(true);

    // Convert outcome to boolean for contract
    const outcomeBoolean = outcome === 'YES';

    // Call smart contract
    const result = await writeContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'resolveNews',
      args: [
        BigInt(newsId),
        outcomeBoolean,
        resolutionSource,
        resolutionNotes || ''
      ],
    });

    // Wait for transaction
    await waitForTransactionReceipt(wagmiConfig, { hash: result });

    // Success!
    toast.success('News resolved successfully! Rewards auto-distributed.');

    setShowResolveModal(false);

    // Refresh data
    await refetchNews();
    await refetchPools();

  } catch (error) {
    console.error('Resolution failed:', error);
    toast.error(handleContractError(error));
  } finally {
    setIsResolving(false);
  }
};
```

---

### **Issue #7: Missing Earnings Tab**
**File:** `frontend/src/app/profile/[address]/page.tsx`
**Priority:** 🟠 MEDIUM

**Problem:**
Profile doesn't separate creator rewards vs staking rewards.

**Required Addition:**
```tsx
{/* Add new tab */}
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="pools">Pools Created</TabsTrigger>
    <TabsTrigger value="stakes">Stakes History</TabsTrigger>
    <TabsTrigger value="earnings">Earnings 💰</TabsTrigger> {/* NEW */}
  </TabsList>

  {/* ... existing tabs ... */}

  <TabsContent value="earnings">
    <Card>
      <CardHeader>
        <CardTitle>Total Earnings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Total Earned</div>
              <div className="text-2xl font-bold">${totalEarnings}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-muted-foreground">From Pools (20%)</div>
              <div className="text-2xl font-bold text-green-600">${creatorEarnings}</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-muted-foreground">From Stakes (80%)</div>
              <div className="text-2xl font-bold text-blue-600">${stakerEarnings}</div>
            </div>
          </div>

          {/* History */}
          <div className="space-y-2">
            <h3 className="font-semibold">Earnings History</h3>
            {earningsHistory.map(earning => (
              <EarningCard key={earning.id} earning={earning} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  </TabsContent>
</Tabs>
```

---

## 🟢 Low Priority Issues

### **Issue #8: Terminology Inconsistency**
**Files:** Multiple
**Priority:** 🟢 LOW

**Problem:**
Mixed use of "agree/disagree", "support/oppose", "setuju/tidak setuju".

**Standardize to:**
```typescript
// Constants
export const STAKE_POSITION_LABELS = {
  agree: 'Support Pool',
  disagree: 'Oppose Pool'
} as const;

// Tooltips
export const STAKE_POSITION_TOOLTIPS = {
  agree: 'You believe this pool\'s analysis is correct',
  disagree: 'You believe this pool\'s analysis is wrong'
} as const;
```

---

## 📊 Data Type Updates Required

### **Type Changes:**

```typescript
// types/index.ts

// BEFORE
interface News {
  status: 'active' | 'resolved' | 'disputed' | 'closed';
  outcome?: 'YES' | 'NO';
}

// AFTER (matches contract enums)
interface News {
  status: 'active' | 'resolved'; // Remove disputed, closed
  outcome?: 'YES' | 'NO'; // Keep as string (contract returns enum)
}

// BEFORE
interface Pool {
  position: 'YES' | 'NO';
  outcome: 'creator_correct' | 'creator_wrong' | null;
}

// AFTER
interface Pool {
  position: 'YES' | 'NO'; // Keep as string
  outcome: 'creator_correct' | 'creator_wrong' | null; // Keep
}

// ADD
interface ReputationData {
  // ... existing fields
  reputationPoints: number; // NEW! For tier calculation
}
```

---

## 🧪 Testing Checklist

After implementing all changes:

- [ ] Pool creation works with USDC approval
- [ ] Staking works (agree/disagree)
- [ ] Admin can resolve news
- [ ] Creator receives 20% reward auto
- [ ] Stakers receive 80% pool rewards auto
- [ ] Reputation points calculated correctly
- [ ] Tier updates based on points
- [ ] Reward amounts match calculations
- [ ] Transaction history shows all distributions
- [ ] Profile earnings tab shows correct totals
- [ ] Gas costs are acceptable on Base Sepolia

---

## 📋 Implementation Order

1. **Update Types** - Fix News, Pool, ReputationData interfaces
2. **Update Mock Data** - Match new point system
3. **Fix Calculations** - Update reward calculation logic
4. **Add UI Components** - Creator reward display, earnings tab
5. **Connect to Contract** - Admin resolution, auto-distribute
6. **Test End-to-End** - Full flow from creation to reward

---

## 🚀 Post-Implementation

After all changes:
1. Update main README with new reward model
2. Create user guide for reward system
3. Document auto-distribute behavior
4. Add analytics for reward distributions

---

**Status:** Ready for implementation after contract revision ✅

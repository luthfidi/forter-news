# Forter FE Implementation Plan: Model A → Model B Migration

## Executive Summary

**Goal**: Transform current admin-curated prediction market (Model A) into permissionless News + Independent Pools platform (Model B)

**Estimated Effort**: ~20-30 hours (FE only with mocks)

**Priority**: High-impact changes first (data model, core pages), then polish

---

## 📊 Gap Analysis

### Current State (Model A)
```
MARKET (Admin-created)
├── Shared outcome pool (YES vs NO)
├── Multiple analyses compete in same pool
├── Dual staking: Outcome (30%) + Informer (70%)
└── Market-wide resolution
```

### Target State (Model B)
```
NEWS (User-created, permissionless)
├── POOL 1 (Independent)
│   ├── Own stake pool (Setuju vs Tidak Setuju)
│   └── Per-pool resolution
├── POOL 2 (Independent)
│   ├── Own stake pool
│   └── Per-pool resolution
└── All pools resolve at SAME TIME
```

---

## 🎯 Implementation Strategy

### Phase 1: Foundation (4-6 hours)
**Goal**: Update data model and core infrastructure

#### 1.1 Update TypeScript Types (`frontend/src/types/index.ts`)

**Current:**
```typescript
export interface Market {
  id: string;
  title: string;
  // ...
}

export interface Analysis {
  id: string;
  marketId: string;
  // Just text + position, not a pool
}

export interface StakePosition {
  type: 'outcome' | 'informer'; // Wrong model
}
```

**Needed:**
```typescript
// NEWS = User-created prediction
export interface News {
  id: string;
  title: string;
  description: string;
  category: string;
  endDate: Date;
  resolutionCriteria: string; // NEW: Clear criteria
  creatorAddress: string;     // NEW: Who created
  createdAt: Date;
  status: 'active' | 'resolved' | 'disputed';
  totalPools: number;          // NEW: Count of pools
  totalStaked: number;         // Aggregate from all pools
}

// POOL = Analysis with own stake pool
export interface Pool {
  id: string;
  newsId: string;              // Parent NEWS
  creatorAddress: string;
  position: 'YES' | 'NO';
  reasoning: string;
  evidence: string[];
  creatorStake: number;        // Pool creator's initial stake

  // NEW: Visual evidence support
  imageUrl?: string;           // Optional chart/image (MVP: URL-based)
  imageCaption?: string;       // Optional image description

  // Independent stake pool
  agreeStakes: number;         // "Setuju" total
  disagreeStakes: number;      // "Tidak Setuju" total
  totalStaked: number;         // agreeStakes + disagreeStakes + creatorStake

  // Resolution
  status: 'active' | 'resolved';
  outcome: 'creator_correct' | 'creator_wrong' | null;

  createdAt: Date;
  farcasterCastHash?: string;
}

// STAKE = User's stake on a specific pool
export interface PoolStake {
  id: string;
  poolId: string;
  userAddress: string;
  position: 'agree' | 'disagree'; // Setuju or Tidak Setuju
  amount: number;
  createdAt: Date;
}

// Update User type
export interface User {
  address: string;
  fid?: number;
  username?: string;
  reputation?: ReputationData;
  totalPoolsCreated: number;   // NEW
  totalStaked: number;
  totalEarned: number;
}
```

**Why**: Core data model must reflect News → Pools hierarchy

---

#### 1.2 Create Mock Data Service (`frontend/src/lib/mock-data.ts`)

**Structure:**
```typescript
export const MOCK_NEWS: News[] = [
  {
    id: '1',
    title: 'ETH akan mencapai $5000 sebelum Desember 2024',
    description: 'Predicting ETH price movement considering ETF, adoption, and market conditions',
    category: 'Crypto',
    endDate: new Date('2024-12-31'),
    resolutionCriteria: 'ETH price >= $5000 on CoinGecko at Dec 31, 2024 23:59 UTC',
    creatorAddress: '0xabc...123',
    createdAt: new Date('2024-10-01'),
    status: 'active',
    totalPools: 3,
    totalStaked: 5200
  },
  // ... more news
];

export const MOCK_POOLS: Pool[] = [
  {
    id: 'pool-1',
    newsId: '1',
    creatorAddress: '0x1234...5678',
    position: 'YES',
    reasoning: 'ETF approval akan mendorong institutional inflows. Historical data shows...',
    evidence: ['https://example.com/etf-data'],
    imageUrl: 'https://i.imgur.com/example-chart.png',  // NEW: Chart image
    imageCaption: 'BTC Bull Flag Pattern with ETF Inflows',
    creatorStake: 100,
    agreeStakes: 900,    // 9 users backed this pool
    disagreeStakes: 200,  // 2 users bet against
    totalStaked: 1200,
    status: 'active',
    outcome: null,
    createdAt: new Date('2024-10-02')
  },
  {
    id: 'pool-2',
    newsId: '1',
    creatorAddress: '0xabcd...efgh',
    position: 'NO',
    reasoning: 'Regulasi masih unclear, macro conditions weak...',
    evidence: [],
    creatorStake: 50,
    agreeStakes: 500,
    disagreeStakes: 800,
    totalStaked: 1350,
    status: 'active',
    outcome: null,
    createdAt: new Date('2024-10-03')
  },
  // ... more pools
];
```

---

### Phase 2: Core Pages (8-10 hours)

#### 2.1 Create NEWS Creation Page (`frontend/src/app/news/create/page.tsx`)

**Purpose**: Allow anyone to create NEWS (permissionless)

**UI Components:**
```
┌──────────────────────────────────────┐
│ Create NEWS                          │
├──────────────────────────────────────┤
│ Title *                              │
│ [Text Input]                         │
│                                      │
│ Description *                        │
│ [Textarea]                           │
│                                      │
│ Category *                           │
│ [Dropdown: Crypto, Macro, Tech...]   │
│                                      │
│ Resolution Date *                    │
│ [Date Picker]                        │
│                                      │
│ Resolution Criteria *                │
│ [Textarea]                           │
│ Ex: "BTC price >= $100k on CoinGecko"│
│                                      │
│ [Preview] [Submit & Post to FC]      │
└──────────────────────────────────────┘
```

**Key Features:**
- Form validation (min 10 chars title, future date, clear criteria)
- Preview modal before submit
- Auto-post to Farcaster via Neynar (mock for now)
- Redirect to `/news/[id]` after creation

**File**: `frontend/src/app/news/create/page.tsx`

---

#### 2.2 Refactor Markets Page → News Page (`/news/page.tsx`)

**Changes Needed:**

| Current (`/markets/page.tsx`) | New (`/news/page.tsx`) |
|-------------------------------|------------------------|
| "Market Explorer" | "News Explorer" |
| Browse admin markets | Browse user-created NEWS |
| "Active Markets" stat | "Active News" stat |
| Uses MOCK_MARKETS | Uses MOCK_NEWS |
| Links to `/markets/[id]` | Links to `/news/[id]` |

**Additional UI:**
```
┌─────────────────────────────────────┐
│ [+ Create NEWS] button (prominent)  │
└─────────────────────────────────────┘
```

**File**:
- Rename `frontend/src/app/markets/page.tsx` → `frontend/src/app/news/page.tsx`
- Or keep markets as alias, but update content

---

#### 2.3 Create NEWS Detail Page (`/news/[id]/page.tsx`)

**Purpose**: Show NEWS info + list of all POOLS under it

**Layout:**
```
┌──────────────────────────────────────────────────┐
│ NEWS HEADER                                      │
│ Title, Description, Resolution Date, Criteria    │
│ [Create Pool] button                             │
├──────────────────────────────────────────────────┤
│                                                  │
│ ┌──────────────┐  ┌─────────────────────────┐  │
│ │ Pools (3)    │  │ News Stats Sidebar      │  │
│ │              │  │ - Total Staked          │  │
│ │ POOL 1       │  │ - Total Pools           │  │
│ │ by @alice    │  │ - Resolution Date       │  │
│ │ YES          │  │ - Time Remaining        │  │
│ │ Setuju: $900 │  │                         │  │
│ │ Tidak: $200  │  │ Top Pool Creators       │  │
│ │ [Stake]      │  │ - List of creators      │  │
│ │              │  └─────────────────────────┘  │
│ │ POOL 2       │                                │
│ │ by @bob      │                                │
│ │ NO           │                                │
│ │ Setuju: $500 │                                │
│ │ Tidak: $800  │                                │
│ │ [Stake]      │                                │
│ │              │                                │
│ └──────────────┘                                │
└──────────────────────────────────────────────────┘
```

**Key Changes from Current:**
- No tabs (Overview/Analysis/Staking)
- Instead: NEWS info + Pool list
- Each pool shows as card with stake stats
- "Create Pool" button at top

---

#### 2.4 Create POOL Creation Page (`/news/[id]/pool/create`)

**Purpose**: Submit analysis = create a POOL under the NEWS

**UI:**
```
┌──────────────────────────────────────┐
│ Create Pool for:                     │
│ "ETH akan ke $5000..."               │
├──────────────────────────────────────┤
│ Your Position *                      │
│ [YES] [NO]                           │
│                                      │
│ Detailed Analysis *                  │
│ [Textarea - min 100 chars]           │
│                                      │
│ Chart/Image (optional) 📊           │
│ [Paste Image URL]                    │
│ ┌─────────────────────┐              │
│ │  [Preview if URL]   │              │
│ └─────────────────────┘              │
│                                      │
│ Supporting Evidence (optional)       │
│ [URL input] [+ Add more]             │
│                                      │
│ Initial Stake *                      │
│ [Number input] USDC                  │
│ Min: $1                              │
│                                      │
│ [Preview] [Create Pool & Post to FC] │
└──────────────────────────────────────┘
```

**Key Differences from Current AnalysisSection:**
- This creates a POOL (not just text submission)
- Stakes on own pool (becomes pool creator)
- After submission → new pool entity created
- Redirect to pool detail or NEWS page

**File**: `frontend/src/app/news/[id]/pool/create/page.tsx`

---

### Phase 3: Components (6-8 hours)

#### 3.1 Create PoolCard Component

**Purpose**: Display individual pool with stats

**Design:**
```
┌─────────────────────────────────────────────────┐
│ [@alice] 💎 Master (87% accuracy)               │
│ Position: YES                                   │
│                                                 │
│ ┌───────────────────────────────────────────┐   │
│ │  [Technical Analysis Chart Image]         │   │
│ │         📊 chart.png                      │   │
│ └───────────────────────────────────────────┘   │
│                                                 │
│ "ETF approval akan mendorong institutional..."  │
│ [Read more]                                     │
│                                                 │
│ Stakes:                                         │
│ Setuju: $900 (90%)  ████████░░                  │
│ Tidak: $200 (10%)   ██░░░░░░░░                  │
│                                                 │
│ Creator Stake: $100                             │
│ Total: $1,200                                   │
│                                                 │
│ [Stake Setuju] [Stake Tidak Setuju]            │
└─────────────────────────────────────────────────┘
```

**Props:**
```typescript
interface PoolCardProps {
  pool: Pool;
  newsEndDate: Date; // For countdown
  onStakeClick: (poolId: string, position: 'agree' | 'disagree') => void;
}
```

**File**: `frontend/src/components/pools/PoolCard.tsx`

---

#### 3.2 Refactor StakingInterface → PoolStakingInterface

**Current Issue:**
- Dual staking (Outcome vs Informer)
- Market-level

**Needed:**
- Per-POOL staking
- Setuju vs Tidak Setuju
- Single pool focus

**New Design:**
```
┌─────────────────────────────────────┐
│ Stake on Pool by @alice             │
├─────────────────────────────────────┤
│ Pool Position: YES                  │
│ "ETF approval reasoning..."         │
│                                     │
│ Your Position:                      │
│ [Setuju - Back this pool]           │
│ [Tidak Setuju - Bet against]        │
│                                     │
│ Amount: [Input] USDC                │
│                                     │
│ Potential Reward:                   │
│ If pool correct: +$XX               │
│ If pool wrong: -$YY                 │
│                                     │
│ [Confirm Stake]                     │
└─────────────────────────────────────┘
```

**File**: `frontend/src/components/pools/PoolStakingInterface.tsx`

---

#### 3.3 Create NewsCard Component

**Purpose**: Display NEWS on browse page

**Design:**
```
┌─────────────────────────────────────┐
│ 🪙 Crypto                           │
│ ETH akan ke $5000 by Dec 2024       │
│                                     │
│ 3 pools • $5,200 total staked       │
│                                     │
│ Resolution: Dec 31, 2024            │
│ Ends in 45 days                     │
│                                     │
│ [View Pools] [Create Pool]          │
└─────────────────────────────────────┘
```

**Props:**
```typescript
interface NewsCardProps {
  news: News;
}
```

**File**: `frontend/src/components/news/NewsCard.tsx`

---

### Phase 4: Infrastructure Updates (3-4 hours)

#### 4.1 Update Global Store (`frontend/src/store/useGlobalStore.ts`)

**Current:**
```typescript
interface GlobalStore {
  markets: Market[];
  currentMarket: Market | null;
  analyses: Analysis[];
  // ...
}
```

**Needed:**
```typescript
interface GlobalStore {
  // NEWS
  newsList: News[];
  currentNews: News | null;
  setNewsList: (news: News[]) => void;
  setCurrentNews: (news: News | null) => void;

  // POOLS
  pools: Pool[];
  currentPool: Pool | null;
  setPoolsByNews: (newsId: string, pools: Pool[]) => void;
  setCurrentPool: (pool: Pool | null) => void;

  // STAKES
  userStakes: PoolStake[];
  setUserStakes: (stakes: PoolStake[]) => void;

  // Loading states
  loading: {
    news: boolean;
    pools: boolean;
    stakes: boolean;
  };
  // ...
}
```

---

#### 4.2 Create Custom Hooks

**`useNews.ts`** - Manage NEWS data
```typescript
export function useNews() {
  const { newsList, setNewsList, loading, setLoading } = useGlobalStore();

  const fetchNews = async () => { /* ... */ };
  const createNews = async (data: CreateNewsInput) => { /* ... */ };
  const getNewsById = (id: string) => { /* ... */ };

  return { newsList, fetchNews, createNews, getNewsById, loading };
}
```

**`usePools.ts`** - Manage POOLS data
```typescript
export function usePools(newsId: string) {
  const { pools, setPoolsByNews, loading, setLoading } = useGlobalStore();

  const fetchPools = async (newsId: string) => { /* ... */ };
  const createPool = async (newsId: string, data: CreatePoolInput) => { /* ... */ };
  const getPoolById = (id: string) => { /* ... */ };

  return { pools, fetchPools, createPool, getPoolById, loading };
}
```

**`usePoolStaking.ts`** - Manage staking
```typescript
export function usePoolStaking() {
  const { userStakes, setUserStakes } = useGlobalStore();

  const stakeOnPool = async (poolId: string, position: 'agree' | 'disagree', amount: number) => {
    // Mock wallet interaction
    // Mock transaction
    // Update local state
  };

  const getUserStakes = (poolId: string) => { /* ... */ };

  return { stakeOnPool, getUserStakes, userStakes };
}
```

**Files**: `frontend/src/lib/hooks/`

---

#### 4.3 Update Navigation

**Header changes:**

| Current | New |
|---------|-----|
| "Markets" link | "News" link |
| No create button | "+ Create NEWS" button |

**File**: `frontend/src/components/layout/Header.tsx`

---

### Phase 5: Integration & Polish (4-6 hours)

#### 5.1 Mock Neynar Integration

**For MVP, create mock functions:**

```typescript
// frontend/src/lib/neynar-mock.ts

export async function postToFarcaster(content: {
  text: string;
  embeds?: string[];
}) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Mock Farcaster post:', content);

  return {
    castHash: 'mock-cast-' + Date.now(),
    success: true
  };
}

export async function getUserProfile(fid: number) {
  // Return mock profile
  return {
    fid,
    username: 'mock_user',
    pfpUrl: 'https://example.com/pfp.jpg',
    followerCount: 123
  };
}
```

**Usage:**
- When creating NEWS → auto-post to FC
- When creating POOL → auto-post to FC
- Display "Posted to Farcaster ✓" confirmation

---

#### 5.2 Reward Calculation Display

**Add to PoolStakingInterface:**

```typescript
function calculatePotentialReward(
  pool: Pool,
  stakeAmount: number,
  position: 'agree' | 'disagree'
) {
  const { agreeStakes, disagreeStakes, creatorStake } = pool;
  const totalPool = agreeStakes + disagreeStakes + creatorStake;

  // Simplified calculation
  if (position === 'agree') {
    // If pool creator correct, 30% distributed among agree stakers
    const rewardPool = totalPool * 0.3 * 0.98; // Minus 2% fee
    const yourShare = (stakeAmount / (agreeStakes + stakeAmount)) * rewardPool;
    return stakeAmount + yourShare;
  } else {
    // If pool creator wrong, disagree takes 98% of total
    const rewardPool = totalPool * 0.98;
    const yourShare = (stakeAmount / (disagreeStakes + stakeAmount)) * rewardPool;
    return yourShare;
  }
}
```

**Display:**
```
If pool CORRECT: You earn $XX (+YY%)
If pool WRONG: You lose $ZZ stake
```

---

#### 5.3 Empty States & Loading

**Empty States needed:**

1. **No NEWS yet**
```
┌─────────────────────────────┐
│        📰                   │
│   No news created yet       │
│ Be the first to create one! │
│   [Create NEWS]             │
└─────────────────────────────┘
```

2. **No POOLS for NEWS**
```
┌─────────────────────────────┐
│        🏊                   │
│   No pools for this news    │
│ Be the first to analyze!    │
│   [Create Pool]             │
└─────────────────────────────┘
```

3. **No user stakes**
```
┌─────────────────────────────┐
│        💰                   │
│ You haven't staked yet      │
│   [Explore Pools]           │
└─────────────────────────────┘
```

---

## 📋 Implementation Checklist

### Phase 1: Foundation ✅
- [ ] Update `types/index.ts` with News, Pool, PoolStake types
- [ ] Create `lib/mock-data.ts` with MOCK_NEWS and MOCK_POOLS
- [ ] Update store with news/pools state management

### Phase 2: Core Pages ✅
- [ ] Create `/news/create` page with form
- [ ] Refactor `/markets` → `/news` browse page
- [ ] Create `/news/[id]` detail page showing pools
- [ ] Create `/news/[id]/pool/create` page

### Phase 3: Components ✅
- [ ] Build `NewsCard` component
- [ ] Build `PoolCard` component
- [ ] Build `PoolStakingInterface` component
- [ ] Create `CreateNewsForm` component
- [ ] Create `CreatePoolForm` component

### Phase 4: Infrastructure ✅
- [ ] Create `useNews` hook
- [ ] Create `usePools` hook
- [ ] Create `usePoolStaking` hook
- [ ] Update Header navigation
- [ ] Update routing

### Phase 5: Polish ✅
- [ ] Add Neynar mock functions
- [ ] Add reward calculation displays
- [ ] Add empty states
- [ ] Add loading skeletons
- [ ] Add error handling
- [ ] Test all flows end-to-end

---

## 🎨 Design Principles

1. **Permissionless First**: All "Create" actions prominent, no barriers
2. **Pool Independence**: Each pool visually distinct, own stats
3. **Clarity**: "Setuju" vs "Tidak Setuju" clearly explained
4. **Trust Signals**: Show creator reputation, pool stats, reasoning quality
5. **Farcaster Native**: FC profile pics, links, auto-posting
6. **Mobile-First**: All UI responsive, touch-friendly

---

## 🚫 What NOT to Change (Keep as-is)

1. ✅ **UI Design System**: Colors, gradients, card styles are good
2. ✅ **Reputation Display**: Tier badges, accuracy % - keep this
3. ✅ **Wallet Integration**: RainbowKit setup works
4. ✅ **Component Structure**: Modular approach is solid
5. ✅ **Responsive Layout**: Grid system works well

---

## 🔄 Migration Path

### Gradual Approach (Recommended):

**Week 1:**
- Phase 1: Update types & mock data
- Phase 2: Build core pages (News create, browse, detail)

**Week 2:**
- Phase 3: Build components (Cards, staking interface)
- Phase 4: Wire up hooks and state management

**Week 3:**
- Phase 5: Polish, test, fix bugs
- Deploy to staging

### All-at-Once Approach:

- Create `/news` directory alongside `/markets`
- Build entire Model B in parallel
- Switch when ready
- Delete old `/markets` code

---

## 🧪 Testing Strategy

### Manual Testing Flows:

1. **Create NEWS Flow**
   - Navigate to /news/create
   - Fill form with valid data
   - Submit → should redirect to NEWS detail
   - Verify auto-post to Farcaster (mock)

2. **Create POOL Flow**
   - Navigate to NEWS detail
   - Click "Create Pool"
   - Fill analysis form
   - Submit with stake → should show new pool
   - Verify auto-post to Farcaster (mock)

3. **Stake on POOL Flow**
   - View pool card
   - Click "Stake Setuju"
   - Enter amount
   - See potential reward calculation
   - Confirm → stake recorded

4. **Browse & Filter**
   - Browse NEWS list
   - Filter by category
   - Search by keyword
   - Sort by stakes/date

---

## 📚 Additional Resources Needed

### For Smart Contract Integration Later:

1. **Contract ABIs** - Once contracts deployed
2. **Wagmi Hooks** - For actual transactions
3. **Oracle Integration** - For resolution (Chainlink/UMA)
4. **IPFS Upload** - For analysis evidence storage
5. **Neynar Real Integration** - Replace mocks

### For Backend API Later:

1. **REST/GraphQL endpoints** for News, Pools, Stakes
2. **WebSocket** for real-time updates
3. **Indexer** for on-chain event listening
4. **Database schema** matching FE types

---

## 🎯 Success Criteria

### MVP is Ready When:

✅ Users can create NEWS without approval
✅ Users can create POOLs under any NEWS
✅ Each POOL shows independent stake stats
✅ Staking works on per-pool basis (Setuju/Tidak)
✅ All pools under NEWS resolve at same time
✅ UI clearly shows News → Pools hierarchy
✅ Farcaster integration mocked but functional
✅ Reward calculations displayed correctly
✅ Mobile-responsive, no major bugs

---

## 💬 Questions for Clarification

1. **NEWS creator incentive?** - Currently no reward for creating NEWS. Is this intentional?
2. **Spam control?** - Min stake for POOL creation? Reputation gate?
3. **Pool editing?** - Can creator edit pool after creation? Or immutable?
4. **Stake withdrawal?** - Can users unstake before resolution? Or locked?
5. **Multi-position pools?** - Can same person create multiple pools under same NEWS?
6. **Pool display order?** - Sort by stake amount? Creation date? Creator reputation?

---

## 🚀 Next Steps

**Immediate:**
1. Review this plan with team
2. Clarify questions above
3. Confirm Phase 1 approach
4. Start with types update

**After Approval:**
1. Create feature branch: `feat/model-b-migration`
2. Begin Phase 1 implementation
3. Commit after each phase
4. Demo to team at each milestone

---

*This plan focuses on FE only with mocks. Smart contract + backend integration is separate phase.*

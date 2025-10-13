// ============================================
// MODEL B: News + Pool Architecture (NEW)
// ============================================

// NEWS = User-created prediction/statement
export interface News {
  id: string;
  title: string;
  description: string;
  category: string;
  endDate: Date;
  resolutionCriteria: string;  // Clear outcome criteria
  creatorAddress: string;       // Who created the news
  createdAt: Date;
  status: 'active' | 'resolved' | 'disputed' | 'closed';
  totalPools: number;           // Count of pools under this news
  totalStaked: number;          // Aggregate from all pools
}

// POOL = Analysis with independent stake pool
export interface Pool {
  id: string;
  newsId: string;               // Parent NEWS
  creatorAddress: string;
  position: 'YES' | 'NO';
  reasoning: string;
  evidence: string[];

  // Visual evidence support (MVP: URL-based)
  imageUrl?: string;            // Optional chart/image
  imageCaption?: string;        // Optional description

  creatorStake: number;         // Pool creator's initial stake

  // Independent stake pool
  agreeStakes: number;          // "Setuju" total
  disagreeStakes: number;       // "Tidak Setuju" total
  totalStaked: number;          // agreeStakes + disagreeStakes + creatorStake

  // Resolution
  status: 'active' | 'resolved';
  outcome: 'creator_correct' | 'creator_wrong' | null;

  createdAt: Date;
  farcasterCastHash?: string;
}

// POOL STAKE = User's stake on a specific pool
export interface PoolStake {
  id: string;
  poolId: string;
  userAddress: string;
  position: 'agree' | 'disagree'; // Setuju or Tidak Setuju
  amount: number;
  createdAt: Date;
}

// ============================================
// MODEL A: Legacy Types (for backward compat)
// ============================================

// Market Types (Legacy - will be migrated to News)
export interface Market {
  id: string;
  title: string;
  description: string;
  category: string;
  endDate: Date;
  totalStaked: number;
  analysisCount: number;
  status: 'active' | 'resolved' | 'closed';
}

// Analysis Types (Legacy - will be migrated to Pool)
export interface Analysis {
  id: string;
  marketId: string;
  authorAddress: string;
  position: 'YES' | 'NO';
  reasoning: string;
  evidence: string[];
  stakeAmount: number;
  createdAt: Date;
  farcasterCastHash?: string;
}

// ============================================
// SHARED TYPES (Used by both models)
// ============================================

// Reputation Types
export interface ReputationData {
  address: string;
  accuracy: number;
  totalMarkets: number;        // Legacy: total markets
  totalPools: number;          // NEW: total pools created
  tier: 'Novice' | 'Analyst' | 'Expert' | 'Master' | 'Legend';
  nftTokenId?: number;
  categoryStats: Record<string, number>;
  currentStreak?: number;       // NEW: consecutive correct predictions
  specialty?: string;           // NEW: best category
}

// Staking Types (Legacy - will be replaced by PoolStake)
export interface StakePosition {
  id: string;
  marketId: string;
  userAddress: string;
  type: 'outcome' | 'informer';
  target: string; // 'YES'/'NO' for outcome, address for informer
  amount: number;
  createdAt: Date;
}

// User Types
export interface User {
  address: string;
  fid?: number;
  username?: string;
  reputation?: ReputationData;
  totalStaked: number;
  totalEarned: number;
  totalPoolsCreated?: number;   // NEW: for Model B
  totalNewsCreated?: number;    // NEW: for Model B
}

// ============================================
// FORM INPUT TYPES (for creation flows)
// ============================================

export interface CreateNewsInput {
  title: string;
  description: string;
  category: string;
  endDate: Date;
  resolutionCriteria: string;
}

export interface CreatePoolInput {
  newsId: string;
  position: 'YES' | 'NO';
  reasoning: string;
  evidence: string[];
  imageUrl?: string;
  imageCaption?: string;
  creatorStake: number;
}
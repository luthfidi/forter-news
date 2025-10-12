// Market Types
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

// Analysis Types
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

// Reputation Types
export interface ReputationData {
  address: string;
  accuracy: number;
  totalMarkets: number;
  tier: 'Novice' | 'Analyst' | 'Expert' | 'Master' | 'Legend';
  nftTokenId?: number;
  categoryStats: Record<string, number>;
}

// Staking Types
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
}
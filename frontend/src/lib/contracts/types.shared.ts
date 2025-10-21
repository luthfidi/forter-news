/**
 * SHARED TYPES FOR CONTRACT INTEGRATIONS
 *
 * Common types used across all contract operations
 */

import type { Address } from '@/types/contracts';

/**
 * TRANSACTION RESULT
 */
export interface TransactionResult {
  hash: `0x${string}`;
  success: boolean;
  error?: string;
}

/**
 * RAW CONTRACT DATA TYPES
 * These match the exact struct formats returned by contracts
 */

export interface NewsContractData {
  title: string;
  description: string;
  category: string;
  resolutionCriteria: string;
  creator: Address;
  resolveTime: bigint;
  createdAt: bigint;
  totalPools: bigint;
  totalStaked: bigint;
  isResolved: boolean;
  outcome: boolean;
}

export interface PoolContractData {
  creator: Address;
  position: boolean;
  reasoning: string;
  evidenceLinks: string[];
  imageUrl: string;
  imageCaption: string;
  creatorStake: bigint;
  agreeStakes: bigint;
  disagreeStakes: bigint;
  totalStaked: bigint;
  createdAt: bigint;
  isResolved: boolean;
  isCorrect: boolean;
}

export interface ReputationContractData {
  score: bigint;
  totalPredictions: bigint;
  correctPredictions: bigint;
  tier: bigint;
}

export interface StakeContractData {
  amount: bigint;
  position: boolean;
  timestamp: bigint;
  isWithdrawn: boolean;
}

export interface PoolStakeStatsContractData {
  total: bigint;
  agree: bigint;
  disagree: bigint;
  stakerCount: bigint;
}

export interface NewsResolutionContractData {
  resolvedAt: bigint;
  resolvedBy: Address;
  resolutionSource: string;
  resolutionNotes: string;
}

/**
 * REPUTATION NFT CONTRACT - DATA MAPPERS
 *
 * Functions to map contract data structures to frontend types
 */

import type { ReputationData } from '@/types';
import type { ReputationContractData } from '../types';

/**
 * Map tier number to string
 */
function mapTierNumberToString(tier: number): ReputationData['tier'] {
  const tiers: ReputationData['tier'][] = ['Novice', 'Analyst', 'Expert', 'Master', 'Legend'];
  return tiers[tier] || 'Novice';
}

/**
 * Map contract reputation data to frontend ReputationData interface
 */
export function mapContractToReputation(
  contractData: ReputationContractData,
  address: string
): ReputationData {
  const totalPools = Number(contractData.totalPredictions);
  const correctPools = Number(contractData.correctPredictions);
  const accuracy = totalPools > 0 ? Math.round((correctPools / totalPools) * 100) : 0;

  return {
    address,
    accuracy,
    totalPools,
    correctPools,
    wrongPools: totalPools - correctPools,
    activePools: 0, // Need to calculate separately
    tier: mapTierNumberToString(Number(contractData.tier)),
    nftTokenId: undefined, // Need to get separately if needed
    categoryStats: {}, // Need to implement category tracking
    reputationPoints: Number(contractData.score) || 0, // Add reputation points from contract
  };
}

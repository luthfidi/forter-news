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
  const accuracy = Number(contractData.accuracy);
  const reputationPoints = Number(contractData.reputationPoints);
  const lastUpdated = Number(contractData.lastUpdated);

  return {
    address,
    accuracy,
    totalPools,
    correctPools,
    wrongPools: totalPools - correctPools,
    activePools: 0,
    tier: mapTierNumberToString(Number(contractData.tier)),
    nftTokenId: undefined,
    categoryStats: {},
    reputationPoints,
    lastActive: lastUpdated > 0 ? new Date(lastUpdated * 1000) : undefined,
  };
}

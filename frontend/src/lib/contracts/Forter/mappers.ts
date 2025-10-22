/**
 * FORTER CONTRACT - DATA MAPPERS
 *
 * Functions to map contract data structures to frontend types
 */

import type { News, Pool } from '@/types';
import type { NewsContractData, PoolContractData } from '../types';
import { formatUSDC, timestampToDate, positionToString } from '../utils';

/**
 * Map contract news data to frontend News interface
 * Contract returns: [creator, title, description, category, resolutionCriteria, createdAt, endDate, status, outcome, totalPools, totalStaked]
 */
export function mapContractToNews(contractData: NewsContractData | any[], newsId: string): News {
  // Handle both array and object formats for compatibility
  if (Array.isArray(contractData)) {
    // Contract returns array format
    const [
      creator,
      title,
      description,
      category,
      resolutionCriteria,
      createdAt,
      endDate,
      status,
      outcome,
      totalPools,
      totalStaked
    ] = contractData;

    return {
      id: newsId,
      title: title || '',
      description: description || '',
      category: category || '',
      endDate: timestampToDate(endDate),
      resolutionCriteria: resolutionCriteria || '',
      creatorAddress: creator || '0x0',
      createdAt: timestampToDate(createdAt),
      status: status === 0 ? 'active' : 'resolved', // 0 = active, 1+ = resolved
      totalPools: Number(totalPools || 0n),
      totalStaked: Number(formatUSDC(totalStaked)),
      outcome: status !== 0 ? positionToString(outcome) : undefined,
    };
  } else {
    // Object format (for future compatibility)
    return {
      id: newsId,
      title: contractData.title || '',
      description: contractData.description || '',
      category: contractData.category || '',
      endDate: timestampToDate(contractData.resolveTime),
      resolutionCriteria: contractData.resolutionCriteria || '',
      creatorAddress: contractData.creator || '0x0',
      createdAt: timestampToDate(contractData.createdAt),
      status: contractData.isResolved ? 'resolved' : 'active',
      totalPools: Number(contractData.totalPools || 0n),
      totalStaked: Number(formatUSDC(contractData.totalStaked)),
      outcome: contractData.isResolved ? positionToString(contractData.outcome) : undefined,
    };
  }
}

/**
 * Map contract pool data to frontend Pool interface
 */
export function mapContractToPool(
  contractData: PoolContractData,
  poolId: string,
  newsId: string
): Pool {
  return {
    id: poolId,
    newsId: newsId,
    creatorAddress: contractData.creator || '0x0',
    position: positionToString(contractData.position || false),
    reasoning: contractData.reasoning || '',
    evidence: contractData.evidenceLinks || [],
    imageUrl: contractData.imageUrl || undefined,
    imageCaption: contractData.imageCaption || undefined,
    creatorStake: Number(formatUSDC(contractData.creatorStake)),
    agreeStakes: Number(formatUSDC(contractData.agreeStakes)),
    disagreeStakes: Number(formatUSDC(contractData.disagreeStakes)),
    totalStaked: Number(formatUSDC(contractData.totalStaked)),
    status: contractData.isResolved ? 'resolved' : 'active',
    outcome: contractData.isResolved
      ? (contractData.isCorrect ? 'creator_correct' : 'creator_wrong')
      : null,
    createdAt: timestampToDate(contractData.createdAt),
  };
}

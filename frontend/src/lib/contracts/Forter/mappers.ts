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
 */
export function mapContractToNews(contractData: NewsContractData, newsId: string): News {
  return {
    id: newsId,
    title: contractData.title,
    description: contractData.description,
    category: contractData.category,
    endDate: timestampToDate(contractData.resolveTime),
    resolutionCriteria: contractData.resolutionCriteria,
    creatorAddress: contractData.creator,
    createdAt: timestampToDate(contractData.createdAt),
    status: contractData.isResolved ? 'resolved' : 'active',
    totalPools: Number(contractData.totalPools),
    totalStaked: Number(formatUSDC(contractData.totalStaked)),
    outcome: contractData.isResolved ? positionToString(contractData.outcome) : undefined,
  };
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
    creatorAddress: contractData.creator,
    position: positionToString(contractData.position),
    reasoning: contractData.reasoning,
    evidence: contractData.evidenceLinks,
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

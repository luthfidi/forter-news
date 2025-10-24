/**
 * FORTER CONTRACT - DATA MAPPERS
 *
 * Functions to map contract data structures to frontend types
 */

import type { News, Pool } from '@/types';
import type { NewsContractData, PoolContractData } from '../types';
import { formatUSDC, timestampToDate } from '../utils';

/**
 * Map contract news data to frontend News interface
 * Contract getNewsInfo() returns exactly 11 fields in tuple format
 */
export function mapContractToNews(contractData: NewsContractData, newsId: string): News {
  // Contract returns object format from wagmi readContract
  return {
    id: newsId,
    title: contractData.title || '',
    description: contractData.description || '',
    category: contractData.category || '',
    endDate: timestampToDate(contractData.resolveTime),
    resolutionCriteria: contractData.resolutionCriteria || '',
    creatorAddress: contractData.creator || '0x0',
    createdAt: timestampToDate(contractData.createdAt),
    status: contractData.status === 0 ? 'active' : 'resolved', // NewsStatus enum: 0=Active, 1=Resolved
    totalPools: Number(contractData.totalPools || BigInt(0)),
    totalStaked: Number(formatUSDC(contractData.totalStaked)),
    outcome: contractData.status !== 0 ? mapOutcomeToYesNo(contractData.outcome) : undefined,
  };
}

/**
 * Map contract outcome enum to frontend string
 */
function mapOutcomeToYesNo(outcome: number): 'YES' | 'NO' | undefined {
  switch (outcome) {
    case 1: return 'YES';  // Outcome.YES
    case 2: return 'NO';   // Outcome.NO
    case 0:
    default: return undefined; // Outcome.None or invalid
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
    position: mapPositionToYesNo(contractData.position),
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

/**
 * Map contract position enum to frontend string
 */
function mapPositionToYesNo(position: number): 'YES' | 'NO' {
  return position === 0 ? 'YES' : 'NO'; // Position enum: 0=YES, 1=NO
}

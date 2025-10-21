/**
 * FORTER CONTRACT - READ FUNCTIONS
 *
 * All read-only contract calls for Forter.sol
 */

import { readContract } from 'wagmi/actions';
import { config as wagmiConfig } from '@/lib/wagmi';
import { contracts } from '@/config/contracts';
import type { News, Pool } from '@/types';
import type { Address } from '@/types/contracts';
import type {
  NewsContractData,
  PoolContractData,
  StakeContractData,
  NewsResolutionContractData,
} from '../types';
import { mapContractToNews, mapContractToPool } from './mappers';
import { formatUSDC, timestampToDate } from '../utils';

/**
 * Get total news count
 */
export async function getNewsCount(): Promise<number> {
  const count = await readContract(wagmiConfig, {
    address: contracts.forter.address,
    abi: contracts.forter.abi,
    functionName: 'getNewsCount',
  });
  return Number(count);
}

/**
 * Get single news by ID
 */
export async function getNewsById(newsId: string): Promise<News | null> {
  try {
    console.log('[Forter/read] Fetching news with ID:', newsId);
    const data = await readContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'getNewsInfo',
      args: [BigInt(newsId)],
    }) as NewsContractData;

    console.log('[Forter/read] Raw contract data:', data);

    if (!data) {
      console.warn('[Forter/read] No data returned from contract');
      return null;
    }

    const mappedNews = mapContractToNews(data, newsId);
    console.log('[Forter/read] Mapped news data:', mappedNews);
    return mappedNews;
  } catch (error) {
    console.error('[Forter/read] getNewsById failed:', error);
    return null;
  }
}

/**
 * Get pools by news ID
 */
export async function getPoolsByNewsId(newsId: string): Promise<Pool[]> {
  try {
    // Get pool IDs for this news
    const result = await readContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'getPoolsByNewsId',
      args: [BigInt(newsId), BigInt(0), BigInt(100)], // offset=0, limit=100
    }) as { poolIds: bigint[]; total: bigint };

    // Fetch each pool's data
    const poolPromises = result.poolIds.map(async (poolId) => {
      const poolData = await readContract(wagmiConfig, {
        address: contracts.forter.address,
        abi: contracts.forter.abi,
        functionName: 'getPoolInfo',
        args: [BigInt(newsId), poolId],
      }) as PoolContractData;

      return mapContractToPool(poolData, poolId.toString(), newsId);
    });

    return Promise.all(poolPromises);
  } catch (error) {
    console.error('[Forter/read] getPoolsByNewsId failed:', error);
    return [];
  }
}

/**
 * Get single pool by news ID and pool ID
 */
export async function getPoolById(newsId: string, poolId: string): Promise<Pool | null> {
  try {
    const data = await readContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'getPoolInfo',
      args: [BigInt(newsId), BigInt(poolId)],
    }) as PoolContractData;

    return mapContractToPool(data, poolId, newsId);
  } catch (error) {
    console.error('[Forter/read] getPoolById failed:', error);
    return null;
  }
}

/**
 * Get pools by creator address
 */
export async function getPoolsByCreator(creatorAddress: Address): Promise<{
  newsIds: bigint[];
  poolIds: bigint[];
}> {
  try {
    const result = await readContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'getPoolsByCreator',
      args: [creatorAddress],
    }) as { newsIds: bigint[]; poolIds: bigint[] };

    return result;
  } catch (error) {
    console.error('[Forter/read] getPoolsByCreator failed:', error);
    return { newsIds: [], poolIds: [] };
  }
}

/**
 * Get user's stake details for a pool
 */
export async function getUserStake(
  newsId: string,
  poolId: string,
  userAddress: Address
): Promise<{
  amount: number;
  position: boolean;
  timestamp: Date;
  isWithdrawn: boolean;
} | null> {
  try {
    const data = await readContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'getUserStake',
      args: [BigInt(newsId), BigInt(poolId), userAddress],
    }) as StakeContractData;

    return {
      amount: Number(formatUSDC(data.amount)),
      position: data.position,
      timestamp: timestampToDate(data.timestamp),
      isWithdrawn: data.isWithdrawn,
    };
  } catch (error) {
    console.error('[Forter/read] getUserStake failed:', error);
    return null;
  }
}

/**
 * Get news resolution information
 */
export async function getNewsResolutionInfo(
  newsId: string
): Promise<{
  resolvedAt: Date;
  resolvedBy: Address;
  resolutionSource: string;
  resolutionNotes: string;
} | null> {
  try {
    const data = await readContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'getNewsResolutionInfo',
      args: [BigInt(newsId)],
    }) as NewsResolutionContractData;

    return {
      resolvedAt: timestampToDate(data.resolvedAt),
      resolvedBy: data.resolvedBy,
      resolutionSource: data.resolutionSource,
      resolutionNotes: data.resolutionNotes,
    };
  } catch (error) {
    console.error('[Forter/read] getNewsResolutionInfo failed:', error);
    return null;
  }
}

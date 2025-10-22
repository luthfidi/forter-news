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
import { formatUSDC, timestampToDate, convertToBigInt } from '../utils';

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
    const newsIdBigInt = convertToBigInt(newsId);
    const data = await readContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'getNewsInfo',
      args: [newsIdBigInt],
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
    // Convert string ID to BigInt safely
    const newsIdBigInt = convertToBigInt(newsId);

    // Get pool IDs for this news
    const result = await readContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'getPoolsByNewsId',
      args: [newsIdBigInt, BigInt(0), BigInt(100)], // offset=0, limit=100
    }) as [bigint[], bigint]; // [poolIds, total]

    // Extract poolIds from the returned array
    const poolIds = result[0];

    // Fetch each pool's data
    const poolPromises = poolIds.map(async (poolId) => {
      const result = await readContract(wagmiConfig, {
        address: contracts.forter.address,
        abi: contracts.forter.abi,
        functionName: 'getPoolInfo',
        args: [BigInt(newsId), poolId],
      }) as [
        Address,        // creator
        string,         // reasoning
        string[],       // evidenceLinks
        string,         // imageUrl
        string,         // imageCaption
        boolean,        // position (true = YES, false = NO)
        bigint,         // creatorStake
        bigint,         // totalStaked
        bigint,         // agreeStakes
        bigint,         // disagreeStakes
        bigint,         // createdAt
        boolean,        // isResolved
        boolean         // isCorrect
      ];

      // Convert array to PoolContractData object
      const poolData: PoolContractData = {
        creator: result[0],
        reasoning: result[1],
        evidenceLinks: result[2],
        imageUrl: result[3],
        imageCaption: result[4],
        position: result[5],
        creatorStake: result[6],
        totalStaked: result[7],
        agreeStakes: result[8],
        disagreeStakes: result[9],
        createdAt: result[10],
        isResolved: result[11],
        isCorrect: result[12]
      };

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
    // Convert string IDs to BigInt safely
    const newsIdBigInt = convertToBigInt(newsId);
    const poolIdBigInt = convertToBigInt(poolId);

    const result = await readContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'getPoolInfo',
      args: [newsIdBigInt, poolIdBigInt],
    }) as [
      Address,        // creator
      string,         // reasoning
      string[],       // evidenceLinks
      string,         // imageUrl
      string,         // imageCaption
      boolean,        // position (true = YES, false = NO)
      bigint,         // creatorStake
      bigint,         // totalStaked
      bigint,         // agreeStakes
      bigint,         // disagreeStakes
      bigint,         // createdAt
      boolean,        // isResolved
      boolean         // isCorrect
    ];

    // Convert array to PoolContractData object
    const data: PoolContractData = {
      creator: result[0],
      reasoning: result[1],
      evidenceLinks: result[2],
      imageUrl: result[3],
      imageCaption: result[4],
      position: result[5],
      creatorStake: result[6],
      totalStaked: result[7],
      agreeStakes: result[8],
      disagreeStakes: result[9],
      createdAt: result[10],
      isResolved: result[11],
      isCorrect: result[12]
    };

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
    // Convert string IDs to BigInt safely
    const newsIdBigInt = convertToBigInt(newsId);
    const poolIdBigInt = convertToBigInt(poolId);

    const data = await readContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'getUserStake',
      args: [newsIdBigInt, poolIdBigInt, userAddress],
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
    // Convert string ID to BigInt safely
    const newsIdBigInt = convertToBigInt(newsId);

    const data = await readContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'getNewsResolutionInfo',
      args: [newsIdBigInt],
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

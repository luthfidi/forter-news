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
 * Get single news by ID (includes resolution data)
 */
export async function getNewsById(newsId: string): Promise<News | null> {
  try {
    console.log('[Forter/read] Fetching news with ID:', newsId);
    const newsIdBigInt = convertToBigInt(newsId);

    // Get basic news info
    const newsData = await readContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'getNewsInfo',
      args: [newsIdBigInt],
    }) as NewsContractData;

    console.log('[Forter/read] Raw contract news data:', newsData);

    if (!newsData) {
      console.warn('[Forter/read] No data returned from contract');
      return null;
    }

    const mappedNews = mapContractToNews(newsData, newsId);
    console.log('[Forter/read] Mapped news data:', mappedNews);

    // If news is resolved, get resolution data
    if (mappedNews.status === 'resolved') {
      try {
        const resolutionData = await readContract(wagmiConfig, {
          address: contracts.forter.address,
          abi: contracts.forter.abi,
          functionName: 'getNewsResolutionInfo',
          args: [newsIdBigInt],
        }) as NewsResolutionContractData;

        console.log('[Forter/read] Resolution data fetched:', resolutionData);

        // Add resolution data to news object (handle both array and object formats)
        if (resolutionData && Array.isArray(resolutionData)) {
          // Array format: [resolvedAt, resolvedBy, resolutionSource, resolutionNotes]
          const [resolvedAt, resolvedBy, resolutionSource, resolutionNotes] = resolutionData as unknown as [bigint, string, string, string];

          if (resolvedAt > 0) {
            mappedNews.resolvedAt = timestampToDate(resolvedAt);
            mappedNews.resolvedBy = resolvedBy;
            mappedNews.resolutionSource = resolutionSource;
            mappedNews.resolutionNotes = resolutionNotes;
            console.log('[Forter/read] Updated news with resolution data (array format):', {
              resolvedAt: mappedNews.resolvedAt,
              resolvedBy: mappedNews.resolvedBy,
              resolutionSource: mappedNews.resolutionSource
            });
          } else {
            console.log('[Forter/read] Resolution timestamp is 0');
          }
        } else if (resolutionData && !Array.isArray(resolutionData)) {
          // Object format
          if (resolutionData.resolvedAt > 0) {
            mappedNews.resolvedAt = timestampToDate(resolutionData.resolvedAt);
            mappedNews.resolvedBy = resolutionData.resolvedBy;
            mappedNews.resolutionSource = resolutionData.resolutionSource;
            mappedNews.resolutionNotes = resolutionData.resolutionNotes;
            console.log('[Forter/read] Updated news with resolution data (object format):', {
              resolvedAt: mappedNews.resolvedAt,
              resolvedBy: mappedNews.resolvedBy,
              resolutionSource: mappedNews.resolutionSource
            });
          } else {
            console.log('[Forter/read] Resolution timestamp is 0');
          }
        } else {
          console.log('[Forter/read] No resolution data available');
        }
      } catch (resolutionError) {
        console.warn('[Forter/read] Failed to fetch resolution data:', resolutionError);
        // Don't fail the whole function if resolution data is missing
      }
    }

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
        position: result[5] ? 'YES' : 'NO', // Position as boolean (true=YES, false=NO) - FIXED: Handle enum conversion correctly
        creatorStake: result[6],
        totalStaked: result[7],
        agreeStakes: result[8],
        disagreeStakes: result[9],
        createdAt: result[10],
        isResolved: result[11],
        isCorrect: result[12]
      };

      // SUPER FIX: Combine Forter data + StakingPool real-time data
      // Forter has creator stake info, StakingPool has real-time user stakes

      const creatorStake = Number(formatUSDC(result[6]));
      const poolPosition = result[5] ? 'YES' : 'NO';

      console.log('[Forter/read] SUPER FIX - Combining Forter + StakingPool data:', {
        poolId: poolId.toString(),
        poolPosition,
        creatorStake,
        forterAgree: Number(formatUSDC(result[8])),
        forterDisagree: Number(formatUSDC(result[9])),
        forterTotal: Number(formatUSDC(result[7]))
      });

      // WORKAROUND: Since StakingPool.stake() fails due to ownership issue,
      // we need to manually track user stakes from transaction logs
      // For now, we can use the totalStaked from Forter contract as a workaround

      try {
        const { getPoolStakeStats } = await import('../StakingPool');
        const stakingPoolData = await getPoolStakeStats(newsId, poolId.toString());

        if (stakingPoolData && stakingPoolData.totalStaked > 0) {
          console.log('[Forter/read] ✅ StakingPool data available:', stakingPoolData);

          // FIXED: Combine creator stake + user stakes
          // CRITICAL FIX: Creator ALWAYS agrees with their own position, so creator stake goes to agreeStakes
          if (poolPosition === 'YES') {
            // Pool YES: creator stake + user agree stakes = agreeStakes
            poolData.agreeStakes = BigInt(creatorStake * 10**6) + BigInt(stakingPoolData.agreeStakes * 10**6);
            poolData.disagreeStakes = BigInt(stakingPoolData.disagreeStakes * 10**6);
          } else {
            // FIXED: Pool NO - creator stake + user agree stakes = agreeStakes (users who agree with NO position)
            // disagreeStakes = users who disagree with NO position (users who want YES)
            poolData.agreeStakes = BigInt(creatorStake * 10**6) + BigInt(stakingPoolData.agreeStakes * 10**6);
            poolData.disagreeStakes = BigInt(stakingPoolData.disagreeStakes * 10**6);
          }
          poolData.totalStaked = BigInt((creatorStake + stakingPoolData.totalStaked) * 10**6);

          console.log('[Forter/read] ✅ COMBINED DATA:', {
            totalStaked: Number(formatUSDC(poolData.totalStaked)),
            agreeStakes: Number(formatUSDC(poolData.agreeStakes)),
            disagreeStakes: Number(formatUSDC(poolData.disagreeStakes))
          });
        } else {
          console.log('[Forter/read] ⚠️ StakingPool empty, using Forter total as fallback');

          // Fallback: Use Forter's totalStaked as it should include all stakes
          const totalFromContract = Number(formatUSDC(result[7])); // Forter totalStaked

          if (totalFromContract > creatorStake) {
            // Forter has more than creator stake, meaning it has user stakes
            const userStakesTotal = totalFromContract - creatorStake;

            console.log('[Forter/read] 🎯 Using Forter totalStaked as user stake indicator:', {
              creatorStake,
              totalFromContract,
              userStakesTotal,
              source: 'Forter.totalStaked'
            });

            // FIXED: Distribute user stakes based on contract logic
            // Creator ALWAYS agrees with their own position
            if (poolPosition === 'YES') {
              poolData.agreeStakes = BigInt(creatorStake * 10**6);
              poolData.disagreeStakes = BigInt(userStakesTotal * 10**6);
            } else {
              // Pool NO: creator stake goes to agreeStakes (creator agrees with NO position)
              poolData.agreeStakes = BigInt(creatorStake * 10**6);
              poolData.disagreeStakes = BigInt(userStakesTotal * 10**6);
            }
            poolData.totalStaked = BigInt(totalFromContract * 10**6);
          } else {
            // FIXED: Only creator stake - creator ALWAYS agrees with their own position
            if (poolPosition === 'YES') {
              poolData.agreeStakes = BigInt(creatorStake * 10**6);
              poolData.disagreeStakes = BigInt(0);
            } else {
              // Pool NO: creator stake goes to agreeStakes (creator agrees with NO position)
              poolData.agreeStakes = BigInt(creatorStake * 10**6);
              poolData.disagreeStakes = BigInt(0);
            }
            poolData.totalStaked = BigInt(creatorStake * 10**6);
          }
        }
      } catch (error) {
        console.error('[Forter/read] Failed to get StakingPool data:', error);
        // Use Forter total as fallback
        const totalFromContract = Number(formatUSDC(result[7]));
        const userStakesTotal = totalFromContract - creatorStake;

        // FIXED: Creator ALWAYS agrees with their own position
        if (poolPosition === 'YES') {
          poolData.agreeStakes = BigInt(creatorStake * 10**6);
          poolData.disagreeStakes = BigInt(userStakesTotal * 10**6);
        } else {
          // Pool NO: creator stake goes to agreeStakes (creator agrees with NO position)
          poolData.agreeStakes = BigInt(creatorStake * 10**6);
          poolData.disagreeStakes = BigInt(userStakesTotal * 10**6);
        }
        poolData.totalStaked = BigInt(totalFromContract * 10**6);
      }

      const mappedPool = mapContractToPool(poolData, poolId.toString(), newsId);

      // DEBUG: Add detailed logging for pool resolution
      console.log('[Forter/read] Pool mapping result:', {
        poolId: poolId.toString(),
        poolPosition: mappedPool.position,
        poolStatus: mappedPool.status,
        poolOutcome: mappedPool.outcome,
        creatorStake: mappedPool.creatorStake,
        agreeStakes: mappedPool.agreeStakes,
        disagreeStakes: mappedPool.disagreeStakes,
        totalStaked: mappedPool.totalStaked,
        contractIsCorrect: result[12],
        mappedOutcome: mappedPool.outcome,
        rawContractData: {
          position: result[5],
          isResolved: result[11],
          isCorrect: result[12]
        }
      });

      // Add timestamp to force re-render
      (mappedPool as Pool & { _lastUpdated?: number })._lastUpdated = Date.now();

      return mappedPool;
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
    // BUGFIX: Contract returns tuple/array format [newsIds[], poolIds[]], not object
    const result = await readContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'getPoolsByCreator',
      args: [creatorAddress],
    }) as [bigint[], bigint[]]; // Array format, not object

    console.log('[Forter/read] getPoolsByCreator raw result:', result);

    // Destructure array to object
    const [newsIds, poolIds] = result;

    console.log('[Forter/read] Found', newsIds?.length || 0, 'pools for creator:', creatorAddress);

    return {
      newsIds: newsIds || [],
      poolIds: poolIds || []
    };
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

/**
 * STAKING POOL CONTRACT - READ FUNCTIONS
 *
 * All read-only contract calls for StakingPool.sol
 */

import { readContract } from 'wagmi/actions';
import { config as wagmiConfig } from '@/lib/wagmi';
import { contracts } from '@/config/contracts';
import type { PoolStakeStatsContractData } from '../types.shared';
import { formatUSDC } from '../utils.shared';

/**
 * Get pool stake statistics
 */
export async function getPoolStakeStats(
  newsId: string,
  poolId: string
): Promise<{
  totalStaked: number;
  agreeStakes: number;
  disagreeStakes: number;
  stakerCount: number;
} | null> {
  try {
    const data = await readContract(wagmiConfig, {
      address: contracts.stakingPool.address,
      abi: contracts.stakingPool.abi,
      functionName: 'getPoolStakeStats',
      args: [BigInt(newsId), BigInt(poolId)],
    }) as PoolStakeStatsContractData;

    return {
      totalStaked: Number(formatUSDC(data.total)),
      agreeStakes: Number(formatUSDC(data.agree)),
      disagreeStakes: Number(formatUSDC(data.disagree)),
      stakerCount: Number(data.stakerCount),
    };
  } catch (error) {
    console.error('[StakingPool/read] getPoolStakeStats failed:', error);
    return null;
  }
}

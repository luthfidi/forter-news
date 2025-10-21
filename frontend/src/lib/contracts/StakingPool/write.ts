/**
 * STAKING POOL CONTRACT - WRITE FUNCTIONS
 *
 * All write/transaction contract calls for StakingPool.sol
 */

import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { config as wagmiConfig } from '@/lib/wagmi';
import { contracts } from '@/config/contracts';
import type { Hash } from '@/types/contracts';
import type { TransactionResult } from '../types';

/**
 * Withdraw stake and claim rewards (after pool resolution)
 */
export async function withdrawStake(
  newsId: string,
  poolId: string
): Promise<TransactionResult> {
  try {
    const hash = await writeContract(wagmiConfig, {
      address: contracts.stakingPool.address,
      abi: contracts.stakingPool.abi,
      functionName: 'withdraw',
      args: [BigInt(newsId), BigInt(poolId)],
    }) as Hash;

    await waitForTransactionReceipt(wagmiConfig, { hash });

    return { hash, success: true };
  } catch (error: unknown) {
    console.error('[StakingPool/write] withdraw failed:', error);
    return {
      hash: '0x' as Hash,
      success: false,
      error: error instanceof Error ? error.message : 'Transaction failed',
    };
  }
}

/**
 * Emergency withdraw before resolution
 */
export async function emergencyWithdraw(
  newsId: string,
  poolId: string
): Promise<TransactionResult> {
  try {
    const hash = await writeContract(wagmiConfig, {
      address: contracts.stakingPool.address,
      abi: contracts.stakingPool.abi,
      functionName: 'emergencyWithdraw',
      args: [BigInt(newsId), BigInt(poolId)],
    }) as Hash;

    await waitForTransactionReceipt(wagmiConfig, { hash });

    return { hash, success: true };
  } catch (error: unknown) {
    console.error('[StakingPool/write] emergencyWithdraw failed:', error);
    return {
      hash: '0x' as Hash,
      success: false,
      error: error instanceof Error ? error.message : 'Transaction failed',
    };
  }
}

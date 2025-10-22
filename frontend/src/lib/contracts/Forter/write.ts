/**
 * FORTER CONTRACT - WRITE FUNCTIONS
 *
 * All write/transaction contract calls for Forter.sol
 */

import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { config as wagmiConfig } from '@/lib/wagmi';
import { contracts } from '@/config/contracts';
import type { Hash } from '@/types/contracts';
import type { TransactionResult } from '../types';
import { parseUSDC, dateToTimestamp, stringToPosition, convertToBigInt } from '../utils';

/**
 * Create news
 */
export async function createNews(
  title: string,
  description: string,
  category: string,
  resolutionCriteria: string,
  resolveTime: Date
): Promise<TransactionResult> {
  try {
    const hash = await writeContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'createNews',
      args: [
        title,
        description,
        category,
        resolutionCriteria,
        dateToTimestamp(resolveTime),
      ],
    }) as Hash;

    await waitForTransactionReceipt(wagmiConfig, { hash });

    return { hash, success: true };
  } catch (error: unknown) {
    console.error('[Forter/write] createNews failed:', error);
    return {
      hash: '0x' as Hash,
      success: false,
      error: error instanceof Error ? error.message : 'Transaction failed',
    };
  }
}

/**
 * Create pool (requires USDC approval first)
 */
export async function createPool(
  newsId: string,
  reasoning: string,
  evidenceLinks: string[],
  imageUrl: string,
  imageCaption: string,
  position: 'YES' | 'NO',
  creatorStake: number
): Promise<TransactionResult> {
  try {
    // Convert string ID to BigInt safely
    const newsIdBigInt = convertToBigInt(newsId);

    // Reset any existing approval to prevent conflicts
    console.log('[Forter/write] Resetting existing USDC approvals...');
    try {
      const resetHash = await writeContract(wagmiConfig, {
        address: contracts.token.address,
        abi: contracts.token.abi,
        functionName: 'approve',
        args: [contracts.forter.address, BigInt(0)], // Reset old approval
      }) as Hash;

      console.log('[Forter/write] Reset approval transaction:', resetHash);
      await waitForTransactionReceipt(wagmiConfig, { hash: resetHash });
      console.log('[Forter/write] Reset approval confirmed');
    } catch (error) {
      console.warn('[Forter/write] Failed to reset old approval:', error);
    }

    // Approve USDC to both addresses to handle any contract requirements
    console.log('[Forter/write] Approving USDC to both forter and stakingPool addresses...');

    // First approve to forter contract (in case contract logic requires it)
    const forterApproveHash = await writeContract(wagmiConfig, {
      address: contracts.token.address,
      abi: contracts.token.abi,
      functionName: 'approve',
      args: [contracts.forter.address, parseUSDC(creatorStake)],
    }) as Hash;

    await waitForTransactionReceipt(wagmiConfig, { hash: forterApproveHash });
    console.log('[Forter/write] Forter approval confirmed:', forterApproveHash);

    // Then approve to stakingPool contract
    const stakingPoolApproveHash = await writeContract(wagmiConfig, {
      address: contracts.token.address,
      abi: contracts.token.abi,
      functionName: 'approve',
      args: [contracts.stakingPool.address, parseUSDC(creatorStake)],
    }) as Hash;

    await waitForTransactionReceipt(wagmiConfig, { hash: stakingPoolApproveHash });
    console.log('[Forter/write] StakingPool approval confirmed:', stakingPoolApproveHash);

    const approveHash = stakingPoolApproveHash; // Use the stakingPool hash for tracking

    // Then create pool
    const hash = await writeContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'createPool',
      args: [
        newsIdBigInt,
        reasoning,
        evidenceLinks,
        imageUrl,
        imageCaption,
        stringToPosition(position),
        parseUSDC(creatorStake),
      ],
    }) as Hash;

    await waitForTransactionReceipt(wagmiConfig, { hash });

    return { hash, success: true };
  } catch (error: unknown) {
    console.error('[Forter/write] createPool failed:', error);
    return {
      hash: '0x' as Hash,
      success: false,
      error: error instanceof Error ? error.message : 'Transaction failed',
    };
  }
}

/**
 * Stake on pool (requires USDC approval first)
 */
export async function stakeOnPool(
  newsId: string,
  poolId: string,
  amount: number,
  userPosition: boolean // true = agree, false = disagree
): Promise<TransactionResult> {
  try {
    // Convert string IDs to BigInt safely
    const newsIdBigInt = convertToBigInt(newsId);
    const poolIdBigInt = convertToBigInt(poolId);

    console.log('[Forter/write] staking with IDs:', { newsId, poolId, newsIdBigInt, poolIdBigInt });

    // Reset any existing approval to prevent conflicts
    console.log('[Forter/write] Resetting existing USDC approvals for staking...');
    try {
      await writeContract(wagmiConfig, {
        address: contracts.token.address,
        abi: contracts.token.abi,
        functionName: 'approve',
        args: [contracts.forter.address, BigInt(0)], // Reset old approval
      }) as Hash;
    } catch (error) {
      console.warn('[Forter/write] Failed to reset old approval:', error);
    }

    // Approve USDC to both addresses to handle any contract requirements
    console.log('[Forter/write] Approving USDC to both forter and stakingPool addresses for staking...');

    // First approve to forter contract (in case contract logic requires it)
    const forterApproveHash = await writeContract(wagmiConfig, {
      address: contracts.token.address,
      abi: contracts.token.abi,
      functionName: 'approve',
      args: [contracts.forter.address, parseUSDC(amount)],
    }) as Hash;

    await waitForTransactionReceipt(wagmiConfig, { hash: forterApproveHash });
    console.log('[Forter/write] Forter staking approval confirmed:', forterApproveHash);

    // Then approve to stakingPool contract
    const stakingPoolApproveHash = await writeContract(wagmiConfig, {
      address: contracts.token.address,
      abi: contracts.token.abi,
      functionName: 'approve',
      args: [contracts.stakingPool.address, parseUSDC(amount)],
    }) as Hash;

    await waitForTransactionReceipt(wagmiConfig, { hash: stakingPoolApproveHash });
    console.log('[Forter/write] StakingPool staking approval confirmed:', stakingPoolApproveHash);

    const approveHash = stakingPoolApproveHash; // Use the stakingPool hash for tracking

    // Then stake
    const hash = await writeContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'stake',
      args: [newsIdBigInt, poolIdBigInt, parseUSDC(amount), userPosition],
    }) as Hash;

    await waitForTransactionReceipt(wagmiConfig, { hash });

    return { hash, success: true };
  } catch (error: unknown) {
    console.error('[Forter/write] stakeOnPool failed:', error);
    return {
      hash: '0x' as Hash,
      success: false,
      error: error instanceof Error ? error.message : 'Transaction failed',
    };
  }
}

/**
 * Resolve news (Admin/Owner only)
 */
export async function resolveNews(
  newsId: string,
  outcome: 0 | 1 | 2, // 0 = None, 1 = YES, 2 = NO
  resolutionSource: string,
  resolutionNotes: string
): Promise<TransactionResult> {
  try {
    // Convert string ID to BigInt safely
    const newsIdBigInt = convertToBigInt(newsId);

    const hash = await writeContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'resolveNews',
      args: [newsIdBigInt, outcome, resolutionSource, resolutionNotes],
    }) as Hash;

    await waitForTransactionReceipt(wagmiConfig, { hash });

    return { hash, success: true };
  } catch (error: unknown) {
    console.error('[Forter/write] resolveNews failed:', error);
    return {
      hash: '0x' as Hash,
      success: false,
      error: error instanceof Error ? error.message : 'Transaction failed',
    };
  }
}

/**
 * FORTER CONTRACT - WRITE FUNCTIONS
 *
 * All write/transaction contract calls for Forter.sol
 */

import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { config as wagmiConfig } from '@/lib/wagmi';
import { contracts } from '@/config/contracts';
import type { Hash } from '@/types/contracts';
import type { TransactionResult } from '../types.shared';
import { parseUSDC, dateToTimestamp, stringToPosition } from '../utils.shared';

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
    // First approve USDC spending
    const approveHash = await writeContract(wagmiConfig, {
      address: contracts.token.address,
      abi: contracts.token.abi,
      functionName: 'approve',
      args: [contracts.forter.address, parseUSDC(creatorStake)],
    }) as Hash;

    await waitForTransactionReceipt(wagmiConfig, { hash: approveHash });

    // Then create pool
    const hash = await writeContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'createPool',
      args: [
        BigInt(newsId),
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
    // First approve USDC spending
    const approveHash = await writeContract(wagmiConfig, {
      address: contracts.token.address,
      abi: contracts.token.abi,
      functionName: 'approve',
      args: [contracts.forter.address, parseUSDC(amount)],
    }) as Hash;

    await waitForTransactionReceipt(wagmiConfig, { hash: approveHash });

    // Then stake
    const hash = await writeContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'stake',
      args: [BigInt(newsId), BigInt(poolId), parseUSDC(amount), userPosition],
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
    const hash = await writeContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'resolveNews',
      args: [BigInt(newsId), outcome, resolutionSource, resolutionNotes],
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

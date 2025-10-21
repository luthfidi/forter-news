/**
 * Contract Integration Utilities
 * Helper functions for smart contract interactions
 */

import { readContract, writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { parseUnits, formatUnits } from 'viem';
import { config as wagmiConfig } from '@/lib/wagmi';
import { contracts, config } from '@/config/contracts';
import type { 
  Hash, 
  Address, 
  NewsContractData, 
  PoolContractData, 
  ReputationContractData,
  TransactionResult 
} from '@/types/contracts';
import type { News, Pool, ReputationData } from '@/types';

/**
 * UTILITY FUNCTIONS
 */

// Convert USDC amount to wei (6 decimals)
export function parseUSDC(amount: string | number): bigint {
  return parseUnits(amount.toString(), config.USDC_DECIMALS);
}

// Convert USDC wei to readable amount
export function formatUSDC(amount: bigint): string {
  return formatUnits(amount, config.USDC_DECIMALS);
}

// Convert Unix timestamp to Date
export function timestampToDate(timestamp: bigint): Date {
  return new Date(Number(timestamp) * 1000);
}

// Convert Date to Unix timestamp
export function dateToTimestamp(date: Date): bigint {
  return BigInt(Math.floor(date.getTime() / 1000));
}

// Convert boolean position to string
export function positionToString(position: boolean): 'YES' | 'NO' {
  return position ? 'YES' : 'NO';
}

// Convert string position to boolean
export function stringToPosition(position: 'YES' | 'NO'): boolean {
  return position === 'YES';
}

/**
 * DATA MAPPING FUNCTIONS
 */

// Map contract news data to frontend News interface
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

// Map contract pool data to frontend Pool interface
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
    outcome: contractData.isResolved ? 
      (contractData.isCorrect ? 'creator_correct' : 'creator_wrong') : null,
    createdAt: timestampToDate(contractData.createdAt),
  };
}

// Map contract reputation data to frontend ReputationData interface
export function mapContractToReputation(
  contractData: ReputationContractData, 
  address: string
): ReputationData {
  const totalPools = Number(contractData.totalPredictions);
  const correctPools = Number(contractData.correctPredictions);
  const accuracy = totalPools > 0 ? Math.round((correctPools / totalPools) * 100) : 0;

  return {
    address,
    accuracy,
    totalPools,
    correctPools,
    wrongPools: totalPools - correctPools,
    activePools: 0, // Need to calculate separately
    tier: mapTierNumberToString(Number(contractData.tier)),
    nftTokenId: undefined, // Need to get separately if needed
    categoryStats: {}, // Need to implement category tracking
    reputationPoints: Number(contractData.score) || 0, // Add reputation points from contract
  };
}

// Map tier number to string
function mapTierNumberToString(tier: number): ReputationData['tier'] {
  const tiers: ReputationData['tier'][] = ['Novice', 'Analyst', 'Expert', 'Master', 'Legend'];
  return tiers[tier] || 'Novice';
}

/**
 * CONTRACT READ FUNCTIONS
 */

// Get news count
export async function getNewsCount(): Promise<number> {
  const count = await readContract(wagmiConfig, {
    address: contracts.forter.address,
    abi: contracts.forter.abi,
    functionName: 'getNewsCount',
  });
  return Number(count);
}

// Get single news by ID
export async function getNewsById(newsId: string): Promise<News | null> {
  try {
    const data = await readContract(wagmiConfig, {
      address: contracts.forter.address,
      abi: contracts.forter.abi,
      functionName: 'getNewsInfo',
      args: [BigInt(newsId)],
    }) as NewsContractData;

    return mapContractToNews(data, newsId);
  } catch (error) {
    console.error('[Contract] getNewsById failed:', error);
    return null;
  }
}

// Get pools by news ID
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
    console.error('[Contract] getPoolsByNewsId failed:', error);
    return [];
  }
}

// Get single pool by news ID and pool ID
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
    console.error('[Contract] getPoolById failed:', error);
    return null;
  }
}

// Get user reputation
export async function getUserReputation(address: Address): Promise<ReputationData | null> {
  try {
    const data = await readContract(wagmiConfig, {
      address: contracts.reputationNFT.address,
      abi: contracts.reputationNFT.abi,
      functionName: 'getUserReputation',
      args: [address],
    }) as ReputationContractData;

    return mapContractToReputation(data, address);
  } catch (error) {
    console.error('[Contract] getUserReputation failed:', error);
    return null;
  }
}

/**
 * CONTRACT WRITE FUNCTIONS
 */

// Create news
export async function createNewsContract(
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
        dateToTimestamp(resolveTime)
      ],
    }) as Hash;

    await waitForTransactionReceipt(wagmiConfig, { hash });

    return { hash, success: true };
  } catch (error: unknown) {
    console.error('[Contract] createNews failed:', error);
    return { 
      hash: '0x' as Hash, 
      success: false, 
      error: error instanceof Error ? error.message : 'Transaction failed' 
    };
  }
}

// Create pool (requires USDC approval first)
export async function createPoolContract(
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
        parseUSDC(creatorStake)
      ],
    }) as Hash;

    await waitForTransactionReceipt(wagmiConfig, { hash });

    return { hash, success: true };
  } catch (error: unknown) {
    console.error('[Contract] createPool failed:', error);
    return { 
      hash: '0x' as Hash, 
      success: false, 
      error: error instanceof Error ? error.message : 'Transaction failed' 
    };
  }
}

// Stake on pool (requires USDC approval first)
export async function stakeOnPoolContract(
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
      args: [
        BigInt(newsId),
        BigInt(poolId),
        parseUSDC(amount),
        userPosition
      ],
    }) as Hash;

    await waitForTransactionReceipt(wagmiConfig, { hash });

    return { hash, success: true };
  } catch (error: unknown) {
    console.error('[Contract] stakeOnPool failed:', error);
    return { 
      hash: '0x' as Hash, 
      success: false, 
      error: error instanceof Error ? error.message : 'Transaction failed' 
    };
  }
}

/**
 * ADDITIONAL CONTRACT WRITE FUNCTIONS
 */

// Resolve news (Admin/Owner only)
export async function resolveNewsContract(
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
      args: [
        BigInt(newsId),
        outcome,
        resolutionSource,
        resolutionNotes
      ],
    }) as Hash;

    await waitForTransactionReceipt(wagmiConfig, { hash });

    return { hash, success: true };
  } catch (error: unknown) {
    console.error('[Contract] resolveNews failed:', error);
    return {
      hash: '0x' as Hash,
      success: false,
      error: error instanceof Error ? error.message : 'Transaction failed'
    };
  }
}

// Withdraw stake and claim rewards (User)
export async function withdrawStakeContract(
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
    console.error('[Contract] withdraw failed:', error);
    return {
      hash: '0x' as Hash,
      success: false,
      error: error instanceof Error ? error.message : 'Transaction failed'
    };
  }
}

// Emergency withdraw before resolution
export async function emergencyWithdrawContract(
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
    console.error('[Contract] emergencyWithdraw failed:', error);
    return {
      hash: '0x' as Hash,
      success: false,
      error: error instanceof Error ? error.message : 'Transaction failed'
    };
  }
}

/**
 * ADDITIONAL CONTRACT READ FUNCTIONS
 */

// Get user's stake details for a pool
export async function getUserStakeContract(
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
    }) as { amount: bigint; position: boolean; timestamp: bigint; isWithdrawn: boolean };

    return {
      amount: Number(formatUSDC(data.amount)),
      position: data.position,
      timestamp: timestampToDate(data.timestamp),
      isWithdrawn: data.isWithdrawn
    };
  } catch (error) {
    console.error('[Contract] getUserStake failed:', error);
    return null;
  }
}

// Get pool stake statistics
export async function getPoolStakeStatsContract(
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
    }) as { total: bigint; agree: bigint; disagree: bigint; stakerCount: bigint };

    return {
      totalStaked: Number(formatUSDC(data.total)),
      agreeStakes: Number(formatUSDC(data.agree)),
      disagreeStakes: Number(formatUSDC(data.disagree)),
      stakerCount: Number(data.stakerCount)
    };
  } catch (error) {
    console.error('[Contract] getPoolStakeStats failed:', error);
    return null;
  }
}

// Get news resolution information
export async function getNewsResolutionInfoContract(
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
    }) as {
      resolvedAt: bigint;
      resolvedBy: Address;
      resolutionSource: string;
      resolutionNotes: string
    };

    return {
      resolvedAt: timestampToDate(data.resolvedAt),
      resolvedBy: data.resolvedBy,
      resolutionSource: data.resolutionSource,
      resolutionNotes: data.resolutionNotes
    };
  } catch (error) {
    console.error('[Contract] getNewsResolutionInfo failed:', error);
    return null;
  }
}

// Get USDC balance
export async function getUSDCBalance(address: Address): Promise<number> {
  try {
    const balance = await readContract(wagmiConfig, {
      address: contracts.token.address,
      abi: contracts.token.abi,
      functionName: 'balanceOf',
      args: [address],
    }) as bigint;

    return Number(formatUSDC(balance));
  } catch (error) {
    console.error('[Contract] getUSDCBalance failed:', error);
    return 0;
  }
}

// Get USDC allowance
export async function getUSDCAllowance(
  ownerAddress: Address,
  spenderAddress: Address
): Promise<number> {
  try {
    const allowance = await readContract(wagmiConfig, {
      address: contracts.token.address,
      abi: contracts.token.abi,
      functionName: 'allowance',
      args: [ownerAddress, spenderAddress],
    }) as bigint;

    return Number(formatUSDC(allowance));
  } catch (error) {
    console.error('[Contract] getUSDCAllowance failed:', error);
    return 0;
  }
}

/**
 * ERROR HANDLING
 */
export function handleContractError(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'An unknown error occurred';
  }

  const message = error.message.toLowerCase();

  // User rejected transaction
  if (message.includes('user rejected') || message.includes('user denied')) {
    return 'Transaction was cancelled by user';
  }

  // Insufficient funds
  if (message.includes('insufficient funds')) {
    return 'Insufficient ETH for gas fees';
  }

  // Contract revert
  if (message.includes('execution reverted')) {
    return 'Transaction was rejected by the contract';
  }

  // Allowance error
  if (message.includes('insufficient allowance')) {
    return 'Please approve USDC spending first';
  }

  // Network errors
  if (message.includes('network') || message.includes('connection')) {
    return 'Network error. Please check your connection';
  }

  // Default
  return 'Transaction failed. Please try again';
}
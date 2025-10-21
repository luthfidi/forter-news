import { PoolStake, StakeInput } from '@/types';
import {
  MOCK_POOL_STAKES,
  getPoolStakesByPoolId as mockGetPoolStakesByPoolId,
  getStakesByUser as mockGetStakesByUser,
} from '@/lib/mock-data';
import { isContractsEnabled } from '@/config/contracts';
import { 
  stakeOnPoolContract,
  handleContractError 
} from '@/lib/contracts/utils';

/**
 * STAKING SERVICE - UPDATED FOR AUTO-DISTRIBUTE
 *
 * ⭐ THIS IS THE INTEGRATION POINT FOR STAKING SMART CONTRACT ⭐
 *
 * This service abstracts data fetching and writing for STAKING operations.
 * Currently uses mock data, but designed to seamlessly integrate with smart contracts.
 *
 * ⚠️ IMPORTANT UPDATE: Auto-distribute is now implemented!
 * - claimRewards() function is DEPRECATED (rewards auto-distributed on resolution)
 * - getClaimableRewards() now shows auto-distributed rewards history
 * - Rewards are sent directly to wallet when news is resolved
 *
 * SMART CONTRACT INTEGRATION GUIDE:
 *
 * 1. Add contract imports:
 *    ```typescript
 *    import { readContract, writeContract } from 'wagmi/actions';
 *    import { StakingManagerABI } from '@/lib/abis/StakingManager.abi';
 *    import { contracts } from '@/config/contracts';
 *    ```
 *
 * 2. Add environment toggle:
 *    ```typescript
 *    const USE_CONTRACTS = process.env.NEXT_PUBLIC_USE_CONTRACTS === 'true';
 *    ```
 *
 * 3. Update each method to check USE_CONTRACTS:
 *    ```typescript
 *    async stake(input: StakeInput) {
 *      if (USE_CONTRACTS) {
 *        const hash = await writeContract({
 *          address: contracts.stakingManager,
 *          abi: StakingManagerABI,
 *          functionName: 'stake',
 *          args: [
 *            BigInt(input.poolId),
 *            input.position === 'agree' ? true : false,
 *            parseUnits(input.amount.toString(), 6),
 *          ],
 *        });
 *        await waitForTransaction({ hash });
 *        return this.getByPoolId(input.poolId);
 *      }
 *      return mockStake(input);
 *    }
 *    ```
 *
 * See INTEGRATION_GUIDE.md for complete examples.
 */

class StakingService {
  /**
   * Get all stakes (all users, all pools)
   *
   * Contract Integration:
   * - Option 1: Query events (StakeCreated, StakeWithdrawn)
   * - Option 2: Use off-chain indexer (The Graph)
   * - Option 3: Contract view function getAllStakes() (gas-intensive)
   */
  async getAll(): Promise<PoolStake[]> {
    // TODO: Add contract integration here
    // if (USE_CONTRACTS) { ... }

    // Simulate API delay for realistic testing
    await new Promise(resolve => setTimeout(resolve, 500));

    return MOCK_POOL_STAKES;
  }

  /**
   * Get stakes by POOL ID
   *
   * Contract Integration:
   * - Function: getPoolStakeStats(newsId, poolId) for aggregated data
   * - Used to display "Supporters" and "Opponents" on pool detail page
   * - Individual stakes require event indexing for full history
   */
  async getByPoolId(poolId: string): Promise<PoolStake[]> {
    if (!isContractsEnabled()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockGetPoolStakesByPoolId(poolId);
    }

    try {
      console.log('[StakingService] Fetching stakes for pool from contract:', poolId);
      
      // Individual stake history requires event indexing
      // For now, we'll fall back to mock data for detailed stake list
      // In production, this would use events or The Graph protocol
      
      console.log('[StakingService] Pool stake details require event indexing, falling back to mock');
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockGetPoolStakesByPoolId(poolId);

    } catch (error) {
      console.error('[StakingService] Contract getByPoolId failed, falling back to mock:', error);
      
      // Fallback to mock data on error
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockGetPoolStakesByPoolId(poolId);
      }
      
      throw new Error(handleContractError(error));
    }
  }

  /**
   * Get stakes by USER ADDRESS
   *
   * Contract Integration:
   * - Function: getUserStake(newsId, poolId, user) for each pool
   * - Used for user profile page "Staking History"
   */
  async getByUser(userAddress: string): Promise<PoolStake[]> {
    if (!isContractsEnabled()) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockGetStakesByUser(userAddress);
    }

    try {
      console.log('[StakingService] Fetching stakes for user from contract:', userAddress);
      
      // Since contract doesn't have a direct getUserStakes function,
      // we'd need to iterate through all news/pools or use events
      // For now, fall back to mock data for user stakes
      // In production, this would be implemented with event indexing or The Graph
      
      console.log('[StakingService] User stakes require event indexing, falling back to mock');
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockGetStakesByUser(userAddress);

    } catch (error) {
      console.error('[StakingService] Contract getByUser failed, falling back to mock:', error);
      
      // Fallback to mock data on error
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 400));
        return mockGetStakesByUser(userAddress);
      }
      
      throw new Error(handleContractError(error));
    }
  }

  /**
   * Create new stake (agree or disagree with pool)
   *
   * Contract Integration:
   * - Function: stake(newsId, poolId, amount, userPosition)
   * - Requires: USDC approval first (2-step transaction)
   * - Emits: Staked event
   */
  async stake(input: StakeInput, newsId?: string): Promise<PoolStake> {
    if (!isContractsEnabled()) {
      // Mock implementation for development
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newStake: PoolStake = {
        id: `stake-${Date.now()}`,
        poolId: input.poolId,
        userAddress: '0xuser...mock',
        position: input.position,
        amount: input.amount,
        createdAt: new Date(),
      };

      return newStake;
    }

    try {
      console.log('[StakingService] Creating stake via smart contract...', input);

      // Get newsId - either from parameter or fetch pool to get it
      let resolvedNewsId = newsId;

      if (!resolvedNewsId) {
        console.log('[StakingService] newsId not provided, fetching pool to get newsId...');
        // Import poolService to get pool data
        const { poolService } = await import('./pool.service');
        const allPools = await poolService.getAll();
        const pool = allPools.find(p => p.id === input.poolId);

        if (!pool) {
          throw new Error(`Pool not found with ID: ${input.poolId}`);
        }

        resolvedNewsId = pool.newsId;
        console.log('[StakingService] Resolved newsId from pool:', resolvedNewsId);
      }

      // Call smart contract to create stake
      const result = await stakeOnPoolContract(
        resolvedNewsId,
        input.poolId,
        input.amount,
        input.position === 'agree' // true = agree, false = disagree
      );

      if (!result.success) {
        throw new Error(result.error || 'Staking transaction failed');
      }

      console.log('[StakingService] Stake transaction successful:', result.hash);

      // Create the stake object based on the successful transaction
      const newStake: PoolStake = {
        id: `stake-${Date.now()}`, // In real app, get from event
        poolId: input.poolId,
        userAddress: '0xConnectedWallet', // TODO: Get from connected wallet
        position: input.position,
        amount: input.amount,
        createdAt: new Date(),
      };

      console.log('[StakingService] Successfully created stake:', newStake);
      return newStake;

    } catch (error) {
      console.error('[StakingService] Stake failed:', error);
      throw new Error(handleContractError(error));
    }
  }

  /**
   * Withdraw stake and claim rewards (after pool resolution)
   *
   * Contract Integration:
   * - Function: withdraw(newsId, poolId)
   * - Transfers rewards to user wallet
   * - Only works after news is resolved
   */
  async withdraw(newsId: string, poolId: string): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }> {
    if (!isContractsEnabled()) {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`[Mock] Withdrew rewards for pool ${poolId}`);
      return { success: true, txHash: '0xmock...hash' };
    }

    try {
      console.log('[StakingService] Withdrawing stake and claiming rewards...', { newsId, poolId });

      // Import withdrawStakeContract
      const { withdrawStakeContract } = await import('@/lib/contracts/utils');

      // Call smart contract to withdraw
      const result = await withdrawStakeContract(newsId, poolId);

      if (!result.success) {
        throw new Error(result.error || 'Withdrawal transaction failed');
      }

      console.log('[StakingService] Withdrawal successful:', result.hash);

      return {
        success: true,
        txHash: result.hash
      };

    } catch (error) {
      console.error('[StakingService] Withdraw failed:', error);
      return {
        success: false,
        error: handleContractError(error)
      };
    }
  }

  /**
   * Emergency withdraw (before pool resolution)
   *
   * Contract Integration:
   * - Function: emergencyWithdraw(newsId, poolId)
   * - Allows withdrawal before resolution (may have penalty)
   * - Only works if news not yet resolved
   */
  async emergencyWithdraw(newsId: string, poolId: string): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }> {
    if (!isContractsEnabled()) {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`[Mock] Emergency withdrew from pool ${poolId}`);
      return { success: true, txHash: '0xmock...hash' };
    }

    try {
      console.log('[StakingService] Emergency withdrawing stake...', { newsId, poolId });

      // Import emergencyWithdrawContract
      const { emergencyWithdrawContract } = await import('@/lib/contracts/utils');

      // Call smart contract to emergency withdraw
      const result = await emergencyWithdrawContract(newsId, poolId);

      if (!result.success) {
        throw new Error(result.error || 'Emergency withdrawal failed');
      }

      console.log('[StakingService] Emergency withdrawal successful:', result.hash);

      return {
        success: true,
        txHash: result.hash
      };

    } catch (error) {
      console.error('[StakingService] Emergency withdraw failed:', error);
      return {
        success: false,
        error: handleContractError(error)
      };
    }
  }

  /**
   * Claim rewards (after pool resolution)
   *
   * Contract Integration:
   * ```typescript
   * const hash = await writeContract({
   *   address: contracts.stakingManager,
   *   abi: StakingManagerABI,
   *   functionName: 'claimRewards',
   *   args: [BigInt(poolId)],
   * });
   *
   * const receipt = await waitForTransaction({ hash });
   *
   * // Extract reward amount from event
   * const rewardAmount = receipt.logs[0].data; // Parse based on ABI
   *
   * return formatUnits(rewardAmount, 6); // Convert to decimal
   * ```
   *
   * Note: Contract calculates rewards based on:
   * - Pool outcome (creator correct/wrong)
   * - User's position (agree/disagree)
   * - Reward distribution algorithm
   */
  async claimRewards(
    poolId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _userAddress: string
  ): Promise<number> {
    // ⚠️ DEPRECATED: Auto-distribute now implemented!
    // Rewards are automatically sent to wallet when news is resolved
    console.warn(`[Deprecated] claimRewards() called for pool ${poolId}. Rewards are now auto-distributed on resolution.`);

    // Return 0 since rewards are auto-distributed
    return 0;
  }

  /**
   * Get auto-distributed rewards history for user
   *
   * UPDATED: Since rewards are auto-distributed, this function now shows
   * historical rewards that have already been sent to user's wallet
   *
   * Contract Integration:
   * - Function: Query RewardDistributed events for user
   * - Returns: Array of auto-distributed rewards
   */
  async getClaimableRewards(poolId: string, userAddress: string): Promise<number> {
    if (!isContractsEnabled()) {
      await new Promise(resolve => setTimeout(resolve, 300));

      // Mock: Check if rewards were auto-distributed for this pool
      const userStakes = await this.getByUser(userAddress);
      const poolStakes = userStakes.filter(s => s.poolId === poolId);

      if (poolStakes.length === 0) return 0;

      // Simulate auto-distribute check: if pool resolved and user won, show reward
      const mockPoolResolved = Math.random() > 0.5; // 50% chance resolved
      const mockUserWon = Math.random() > 0.4; // 60% chance won

      if (mockPoolResolved && mockUserWon) {
        const totalStaked = poolStakes.reduce((sum, s) => sum + s.amount, 0);
        // NEW 20/80 split calculation: user gets proportional share of 80% pool
        const mockTotalPool = totalStaked * 3; // Assume larger pool
        const protocolFee = mockTotalPool * 0.02;
        const remaining = mockTotalPool - protocolFee;
        const stakersPool = remaining * 0.80;
        const userReward = stakersPool * 0.25; // User's proportional share

        return userReward;
      }

      return 0; // No auto-distributed rewards yet
    }

    try {
      console.log('[StakingService] Calculating claimable rewards from contract:', { poolId, userAddress });
      
      // For now, we'll use mock calculation since rewards calculation
      // requires knowing the pool resolution status and user's position
      // This would be implemented with the actual contract function
      
      console.log('[StakingService] Rewards calculation not yet implemented, using mock');
      
      // Mock calculation
      const userStakes = await this.getByUser(userAddress);
      const poolStakes = userStakes.filter(s => s.poolId === poolId);

      if (poolStakes.length === 0) return 0;

      const totalStaked = poolStakes.reduce((sum, s) => sum + s.amount, 0);
      const mockMultiplier = 1.2; // 20% profit for contract mode
      return totalStaked * mockMultiplier;

    } catch (error) {
      console.error('[StakingService] Contract getClaimableRewards failed:', error);
      return 0;
    }
  }

  /**
   * Get staking statistics
   * (Can be calculated client-side or fetched from contract)
   */
  async getStats(poolId?: string, userAddress?: string) {
    let stakes: PoolStake[];

    if (poolId && userAddress) {
      stakes = await this.getByUser(userAddress);
      stakes = stakes.filter(s => s.poolId === poolId);
    } else if (poolId) {
      stakes = await this.getByPoolId(poolId);
    } else if (userAddress) {
      stakes = await this.getByUser(userAddress);
    } else {
      stakes = await this.getAll();
    }

    const agreeStakes = stakes.filter(s => s.position === 'agree');
    const disagreeStakes = stakes.filter(s => s.position === 'disagree');

    return {
      totalStakes: stakes.length,
      totalAmount: stakes.reduce((sum, s) => sum + s.amount, 0),
      agreeCount: agreeStakes.length,
      agreeAmount: agreeStakes.reduce((sum, s) => sum + s.amount, 0),
      disagreeCount: disagreeStakes.length,
      disagreeAmount: disagreeStakes.reduce((sum, s) => sum + s.amount, 0),
      uniqueStakers: new Set(stakes.map(s => s.userAddress)).size,
    };
  }

  /**
   * Get user's stake details for a specific pool
   *
   * Contract Integration:
   * - Function: getUserStake(newsId, poolId, userAddress)
   * - Returns: Detailed stake information
   */
  async getUserStakeDetails(
    newsId: string,
    poolId: string,
    userAddress: string
  ): Promise<{
    amount: number;
    position: 'agree' | 'disagree';
    timestamp: Date;
    isWithdrawn: boolean;
  } | null> {
    if (!isContractsEnabled()) {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));

      const userStakes = await this.getByUser(userAddress);
      const poolStake = userStakes.find(s => s.poolId === poolId);

      if (!poolStake) return null;

      return {
        amount: poolStake.amount,
        position: poolStake.position,
        timestamp: poolStake.createdAt,
        isWithdrawn: false
      };
    }

    try {
      console.log('[StakingService] Fetching user stake details from contract...', {
        newsId,
        poolId,
        userAddress
      });

      // Import getUserStakeContract
      const { getUserStakeContract } = await import('@/lib/contracts/utils');

      const stake = await getUserStakeContract(newsId, poolId, userAddress as `0x${string}`);

      if (!stake) {
        console.log('[StakingService] No stake found for user');
        return null;
      }

      console.log('[StakingService] User stake details fetched:', stake);

      return {
        amount: stake.amount,
        position: stake.position ? 'agree' : 'disagree',
        timestamp: stake.timestamp,
        isWithdrawn: stake.isWithdrawn
      };

    } catch (error) {
      console.error('[StakingService] Get user stake details failed:', error);
      return null;
    }
  }

  /**
   * Check if user has staked on a pool
   * (Helper function for UI state)
   */
  async hasUserStaked(poolId: string, userAddress: string): Promise<boolean> {
    const userStakes = await this.getByUser(userAddress);
    return userStakes.some(s => s.poolId === poolId);
  }

  /**
   * Get user's position on a pool
   * (Helper function for UI state)
   */
  async getUserPosition(
    poolId: string,
    userAddress: string
  ): Promise<'agree' | 'disagree' | null> {
    const userStakes = await this.getByUser(userAddress);
    const poolStake = userStakes.find(s => s.poolId === poolId);
    return poolStake?.position || null;
  }
}

// Export singleton instance
export const stakingService = new StakingService();

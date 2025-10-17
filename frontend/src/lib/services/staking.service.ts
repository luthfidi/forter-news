import { PoolStake, StakeInput } from '@/types';
import {
  MOCK_POOL_STAKES,
  getPoolStakesByPoolId as mockGetPoolStakesByPoolId,
  getStakesByUser as mockGetStakesByUser,
} from '@/lib/mock-data';

/**
 * STAKING SERVICE
 *
 * ⭐ THIS IS THE INTEGRATION POINT FOR STAKING SMART CONTRACT ⭐
 *
 * This service abstracts data fetching and writing for STAKING operations.
 * Currently uses mock data, but designed to seamlessly integrate with smart contracts.
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
   * Contract Integration (IMPORTANT):
   * - Function: getStakesByPoolId(uint256 poolId)
   * - Returns: PoolStake[] struct array
   * - Used to display "Supporters" and "Opponents" on pool detail page
   */
  async getByPoolId(poolId: string): Promise<PoolStake[]> {
    // TODO: Add contract integration here
    // if (USE_CONTRACTS) {
    //   const data = await readContract({
    //     address: contracts.stakingManager,
    //     abi: StakingManagerABI,
    //     functionName: 'getStakesByPoolId',
    //     args: [BigInt(poolId)],
    //   });
    //   return this.mapContractToStakes(data);
    // }

    await new Promise(resolve => setTimeout(resolve, 300));

    return mockGetPoolStakesByPoolId(poolId);
  }

  /**
   * Get stakes by USER ADDRESS
   *
   * Contract Integration:
   * - Function: getStakesByUser(address user)
   * - Returns: PoolStake[] struct array
   * - Used for user profile page "Staking History"
   */
  async getByUser(userAddress: string): Promise<PoolStake[]> {
    // TODO: Add contract integration here
    // if (USE_CONTRACTS) {
    //   const data = await readContract({
    //     address: contracts.stakingManager,
    //     abi: StakingManagerABI,
    //     functionName: 'getStakesByUser',
    //     args: [userAddress as `0x${string}`],
    //   });
    //   return this.mapContractToStakes(data);
    // }

    await new Promise(resolve => setTimeout(resolve, 400));

    return mockGetStakesByUser(userAddress);
  }

  /**
   * Create new stake (agree or disagree with pool)
   *
   * Contract Integration (CRITICAL):
   * ```typescript
   * // Step 1: Approve USDC spending
   * const approveHash = await writeContract({
   *   address: contracts.usdc,
   *   abi: USDCABI,
   *   functionName: 'approve',
   *   args: [contracts.stakingManager, parseUnits(input.amount.toString(), 6)],
   * });
   * await waitForTransaction({ hash: approveHash });
   *
   * // Step 2: Execute stake
   * const hash = await writeContract({
   *   address: contracts.stakingManager,
   *   abi: StakingManagerABI,
   *   functionName: 'stake',
   *   args: [
   *     BigInt(input.poolId),
   *     input.position === 'agree', // bool: true = agree, false = disagree
   *     parseUnits(input.amount.toString(), 6), // uint256: USDC amount
   *   ],
   * });
   *
   * // Step 3: Wait for confirmation
   * const receipt = await waitForTransaction({ hash });
   *
   * // Step 4: Extract stakeId from event
   * const stakeId = receipt.logs[0].topics[1];
   *
   * return this.getById(stakeId);
   * ```
   */
  async stake(input: StakeInput): Promise<PoolStake> {
    // TODO: Add contract integration here
    // This will require:
    // 1. USDC approval transaction
    // 2. Stake transaction
    // 3. Event listening for confirmation

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 2000)); // Longer delay (2 txs)

    const newStake: PoolStake = {
      id: `stake-${Date.now()}`,
      poolId: input.poolId,
      userAddress: '0xuser...mock', // TODO: Get from connected wallet
      position: input.position,
      amount: input.amount,
      createdAt: new Date(),
    };

    return newStake;
  }

  /**
   * Withdraw stake (before pool resolution)
   *
   * Contract Integration:
   * ```typescript
   * const hash = await writeContract({
   *   address: contracts.stakingManager,
   *   abi: StakingManagerABI,
   *   functionName: 'withdrawStake',
   *   args: [BigInt(stakeId)],
   * });
   *
   * await waitForTransaction({ hash });
   * ```
   *
   * Note: Contract should enforce withdrawal rules:
   * - Only allow before pool resolution
   * - Apply withdrawal penalty (e.g., 2%)
   * - Update pool's agreeStakes/disagreeStakes
   */
  async withdraw(stakeId: string): Promise<void> {
    // TODO: Add contract integration here

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock: Remove stake from array
    console.log(`[Mock] Withdrew stake ${stakeId}`);
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
  async claimRewards(poolId: string, _userAddress: string): Promise<number> {
    // TODO: Add contract integration here

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock reward amount
    const mockReward = 50; // $50 USDC
    console.log(`[Mock] Claimed ${mockReward} USDC from pool ${poolId}`);

    return mockReward;
  }

  /**
   * Calculate claimable rewards for user (view function)
   *
   * Contract Integration:
   * ```typescript
   * const rewardAmount = await readContract({
   *   address: contracts.stakingManager,
   *   abi: StakingManagerABI,
   *   functionName: 'calculateRewards',
   *   args: [BigInt(poolId), userAddress as `0x${string}`],
   * });
   *
   * return Number(formatUnits(rewardAmount, 6));
   * ```
   */
  async getClaimableRewards(poolId: string, userAddress: string): Promise<number> {
    // TODO: Add contract integration here

    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock calculation
    const userStakes = await this.getByUser(userAddress);
    const poolStakes = userStakes.filter(s => s.poolId === poolId);

    if (poolStakes.length === 0) return 0;

    // Simplified mock reward calculation
    const totalStaked = poolStakes.reduce((sum, s) => sum + s.amount, 0);
    const mockMultiplier = 1.5; // 50% profit
    return totalStaked * mockMultiplier;
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

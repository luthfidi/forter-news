import { Pool, CreatePoolInput } from '@/types';
import {
  MOCK_POOLS,
  getPoolsByNewsId as mockGetPoolsByNewsId,
  getPoolById as mockGetPoolById,
  getPoolsByCreator as mockGetPoolsByCreator
} from '@/lib/mock-data';

/**
 * POOL SERVICE
 *
 * ⭐ THIS IS THE INTEGRATION POINT FOR POOL SMART CONTRACT ⭐
 *
 * This service abstracts data fetching for POOL entities.
 * Currently uses mock data, but designed to seamlessly integrate with smart contracts.
 *
 * SMART CONTRACT INTEGRATION GUIDE:
 *
 * 1. Add contract imports:
 *    ```typescript
 *    import { readContract, writeContract } from 'wagmi/actions';
 *    import { PoolFactoryABI } from '@/lib/abis/PoolFactory.abi';
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
 *    async getByNewsId(newsId: string) {
 *      if (USE_CONTRACTS) {
 *        const data = await readContract({
 *          address: contracts.poolFactory,
 *          abi: PoolFactoryABI,
 *          functionName: 'getPoolsByNewsId',
 *          args: [BigInt(newsId)],
 *        });
 *        return this.mapContractToPools(data);
 *      }
 *      return mockGetPoolsByNewsId(newsId);
 *    }
 *    ```
 *
 * See INTEGRATION_GUIDE.md for complete examples.
 */

class PoolService {
  /**
   * Get all pools (active + resolved)
   *
   * Contract Integration:
   * - Function: getAllPools() or filter events
   * - Returns: Pool[] struct array
   */
  async getAll(): Promise<Pool[]> {
    // TODO: Add contract integration here
    // if (USE_CONTRACTS) { ... }

    // Simulate API delay for realistic testing
    await new Promise(resolve => setTimeout(resolve, 500));

    return MOCK_POOLS;
  }

  /**
   * Get pools by NEWS ID
   *
   * Contract Integration (MOST IMPORTANT):
   * - Function: getPoolsByNewsId(uint256 newsId)
   * - Returns: Pool[] struct array
   * - This is the primary way to display pools on news detail page
   */
  async getByNewsId(newsId: string): Promise<Pool[]> {
    // TODO: Add contract integration here
    // if (USE_CONTRACTS) {
    //   const data = await readContract({
    //     address: contracts.poolFactory,
    //     abi: PoolFactoryABI,
    //     functionName: 'getPoolsByNewsId',
    //     args: [BigInt(newsId)],
    //   });
    //   return this.mapContractToPools(data);
    // }

    await new Promise(resolve => setTimeout(resolve, 300));

    return mockGetPoolsByNewsId(newsId);
  }

  /**
   * Get pool by ID
   *
   * Contract Integration:
   * - Function: getPool(uint256 poolId)
   * - Returns: Pool struct
   */
  async getById(id: string): Promise<Pool | undefined> {
    // TODO: Add contract integration here

    await new Promise(resolve => setTimeout(resolve, 300));

    return mockGetPoolById(id);
  }

  /**
   * Get pools by creator address
   *
   * Contract Integration:
   * - Option 1: Filter client-side after fetching all
   * - Option 2: Add getPoolsByCreator(address creator) to contract
   * - Option 3: Index events off-chain (The Graph, etc.)
   */
  async getByCreator(creatorAddress: string): Promise<Pool[]> {
    // TODO: Add contract integration here

    await new Promise(resolve => setTimeout(resolve, 400));

    return mockGetPoolsByCreator(creatorAddress);
  }

  /**
   * Get active pools only
   *
   * Contract Integration:
   * - Function: getAllActivePools()
   * - Filter: status === Status.Active
   */
  async getActive(): Promise<Pool[]> {
    const allPools = await this.getAll();
    return allPools.filter(p => p.status === 'active');
  }

  /**
   * Create new pool (analysis of NEWS)
   *
   * Contract Integration (CRITICAL):
   * ```typescript
   * const hash = await writeContract({
   *   address: contracts.poolFactory,
   *   abi: PoolFactoryABI,
   *   functionName: 'createPool',
   *   args: [
   *     BigInt(input.newsId),
   *     input.position === 'YES' ? 1 : 0, // Enum: YES=1, NO=0
   *     input.reasoning,
   *     input.evidenceLinks,
   *     parseUnits(input.creatorStake.toString(), 6), // USDC amount
   *   ],
   *   value: 0n, // Or gas token if needed
   * });
   *
   * // Wait for confirmation
   * const receipt = await waitForTransaction({ hash });
   *
   * // Extract poolId from event
   * const poolId = receipt.logs[0].topics[1];
   *
   * return this.getById(poolId);
   * ```
   */
  async create(input: CreatePoolInput): Promise<Pool> {
    // TODO: Add contract integration here

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newPool: Pool = {
      id: `pool-${Date.now()}`,
      newsId: input.newsId,
      creatorAddress: '0xuser...mock', // TODO: Get from connected wallet
      createdAt: new Date(),
      position: input.position,
      reasoning: input.reasoning,
      evidenceLinks: input.evidenceLinks,
      qualityScore: 0, // Calculated later
      creatorStake: input.creatorStake,
      agreeStakes: 0,
      disagreeStakes: 0,
      totalStaked: input.creatorStake, // Initial stake = creator stake
      status: 'active',
      outcome: null,
    };

    return newPool;
  }

  /**
   * Get pool statistics
   * (Can be calculated client-side or fetched from contract)
   */
  async getStats(newsId?: string) {
    const pools = newsId
      ? await this.getByNewsId(newsId)
      : await this.getAll();

    const activePools = pools.filter(p => p.status === 'active');
    const yesPools = activePools.filter(p => p.position === 'YES');
    const noPools = activePools.filter(p => p.position === 'NO');

    return {
      total: pools.length,
      active: activePools.length,
      resolved: pools.filter(p => p.status === 'resolved').length,
      yesPools: yesPools.length,
      noPools: noPools.length,
      totalStaked: activePools.reduce((sum, p) => sum + p.totalStaked, 0),
      avgQualityScore: activePools.length > 0
        ? activePools.reduce((sum, p) => sum + (p.qualityScore || 0), 0) / activePools.length
        : 0,
    };
  }

  /**
   * Search pools by query
   * (Client-side filtering, no contract needed)
   */
  async search(query: string, newsId?: string): Promise<Pool[]> {
    if (!query.trim()) {
      return newsId ? this.getByNewsId(newsId) : this.getAll();
    }

    const pools = newsId
      ? await this.getByNewsId(newsId)
      : await this.getAll();

    const lowercaseQuery = query.toLowerCase();

    return pools.filter(pool =>
      pool.reasoning.toLowerCase().includes(lowercaseQuery) ||
      pool.evidenceLinks.some(link => link.toLowerCase().includes(lowercaseQuery)) ||
      pool.creatorAddress.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Sort pools by various criteria
   * (Client-side sorting, can be done off-chain or in contract view function)
   */
  async getSorted(
    newsId: string,
    sortBy: 'quality' | 'stake' | 'recent' = 'quality'
  ): Promise<Pool[]> {
    const pools = await this.getByNewsId(newsId);

    switch (sortBy) {
      case 'quality':
        return [...pools].sort((a, b) =>
          (b.qualityScore || 0) - (a.qualityScore || 0)
        );

      case 'stake':
        return [...pools].sort((a, b) =>
          b.totalStaked - a.totalStaked
        );

      case 'recent':
        return [...pools].sort((a, b) =>
          b.createdAt.getTime() - a.createdAt.getTime()
        );

      default:
        return pools;
    }
  }
}

// Export singleton instance
export const poolService = new PoolService();

import { ReputationData } from '@/types';
import {
  getReputationData as mockGetReputationData,
  getAllAnalysts as mockGetAllAnalysts,
  getAnalystsByTier as mockGetAnalystsByTier,
  getAnalystsByCategory as mockGetAnalystsByCategory,
  sortAnalysts,
  calculateTier,
  getTierIcon,
} from '@/lib/mock-data';

/**
 * REPUTATION SERVICE
 *
 * ⭐ THIS IS THE INTEGRATION POINT FOR REPUTATION SMART CONTRACT ⭐
 *
 * This service abstracts data fetching for REPUTATION data.
 * Currently uses mock data, but designed to seamlessly integrate with smart contracts.
 *
 * SMART CONTRACT INTEGRATION OPTIONS:
 *
 * Option 1: On-Chain Reputation (Soulbound NFT)
 * ```typescript
 * import { ReputationNFTABI } from '@/lib/abis/ReputationNFT.abi';
 *
 * const reputationData = await readContract({
 *   address: contracts.reputationNFT,
 *   abi: ReputationNFTABI,
 *   functionName: 'getReputation',
 *   args: [userAddress as `0x${string}`],
 * });
 * ```
 *
 * Option 2: Off-Chain Calculation (The Graph Indexer)
 * ```typescript
 * // Query The Graph subgraph
 * const response = await fetch('https://api.thegraph.com/subgraphs/...');
 * const { data } = await response.json();
 * ```
 *
 * Option 3: Hybrid (On-Chain Score, Off-Chain Details)
 * - Store reputation score on-chain
 * - Calculate breakdown/history off-chain
 *
 * See INTEGRATION_GUIDE.md for complete examples.
 */

class ReputationService {
  /**
   * Get reputation data for a specific user
   *
   * Contract Integration:
   * - Function: getReputation(address user)
   * - Returns: Reputation struct with score, tier, stats
   */
  async getByAddress(address: string): Promise<ReputationData | undefined> {
    // TODO: Add contract integration here
    // if (USE_CONTRACTS) {
    //   const data = await readContract({
    //     address: contracts.reputationNFT,
    //     abi: ReputationNFTABI,
    //     functionName: 'getReputation',
    //     args: [address as `0x${string}`],
    //   });
    //   return this.mapContractToReputation(data);
    // }

    await new Promise(resolve => setTimeout(resolve, 300));

    return mockGetReputationData(address);
  }

  /**
   * Get all analysts (users with reputation)
   *
   * Contract Integration:
   * - Option 1: Query events (ReputationUpdated)
   * - Option 2: Off-chain indexer (The Graph)
   * - Option 3: Contract view function getAllAnalysts() (gas-intensive)
   *
   * Recommended: Use The Graph to index all reputation holders
   */
  async getAllAnalysts(): Promise<ReputationData[]> {
    // TODO: Add contract integration here
    // if (USE_CONTRACTS) {
    //   // Use The Graph query
    //   const response = await fetch(SUBGRAPH_URL, {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       query: `{
    //         reputations(orderBy: score, orderDirection: desc) {
    //           user
    //           score
    //           tier
    //           poolsCreated
    //           totalStaked
    //           successRate
    //         }
    //       }`
    //     })
    //   });
    //   const { data } = await response.json();
    //   return data.reputations;
    // }

    await new Promise(resolve => setTimeout(resolve, 500));

    return mockGetAllAnalysts();
  }

  /**
   * Get analysts by tier
   *
   * Contract Integration:
   * - Filter from getAllAnalysts() or
   * - Query subgraph with tier filter
   */
  async getByTier(tier: string): Promise<ReputationData[]> {
    // TODO: Add contract integration here

    await new Promise(resolve => setTimeout(resolve, 400));

    return mockGetAnalystsByTier(tier);
  }

  /**
   * Get analysts by category specialization
   *
   * Contract Integration:
   * - Calculate from user's pool creation history
   * - Query subgraph with category filter
   */
  async getByCategory(category: string): Promise<ReputationData[]> {
    // TODO: Add contract integration here

    await new Promise(resolve => setTimeout(resolve, 400));

    return mockGetAnalystsByCategory(category);
  }

  /**
   * Get top analysts (leaderboard)
   *
   * Contract Integration:
   * - Query subgraph: orderBy: score, orderDirection: desc, first: N
   */
  async getTopAnalysts(limit: number = 10): Promise<ReputationData[]> {
    const allAnalysts = await this.getAllAnalysts();
    const sorted = sortAnalysts(allAnalysts, 'score');
    return sorted.slice(0, limit);
  }

  /**
   * Get reputation stats (global)
   *
   * Contract Integration:
   * - Can be calculated on-chain or off-chain
   * - Aggregate data from all analysts
   */
  async getGlobalStats() {
    const allAnalysts = await this.getAllAnalysts();

    if (allAnalysts.length === 0) {
      return {
        totalAnalysts: 0,
        avgScore: 0,
        avgSuccessRate: 0,
        totalPoolsCreated: 0,
        totalStaked: 0,
        tierDistribution: {
          'Legend': 0,
          'Master': 0,
          'Expert': 0,
          'Analyst': 0,
          'Novice': 0,
        },
      };
    }

    return {
      totalAnalysts: allAnalysts.length,
      avgScore: allAnalysts.reduce((sum, a) => sum + a.accuracy, 0) / allAnalysts.length,
      avgSuccessRate:
        allAnalysts.reduce((sum, a) => sum + a.accuracy, 0) / allAnalysts.length,
      totalPoolsCreated: allAnalysts.reduce((sum, a) => sum + a.totalPools, 0),
      totalStaked: 0, // ReputationData doesn't track totalStaked
      tierDistribution: {
        'Legend': allAnalysts.filter(a => a.tier === 'Legend').length,
        'Master': allAnalysts.filter(a => a.tier === 'Master').length,
        'Expert': allAnalysts.filter(a => a.tier === 'Expert').length,
        'Analyst': allAnalysts.filter(a => a.tier === 'Analyst').length,
        'Novice': allAnalysts.filter(a => a.tier === 'Novice').length,
      },
    };
  }

  /**
   * Search analysts by name or address
   *
   * Contract Integration:
   * - Query subgraph with search filter
   * - Note: Names are off-chain data (from Farcaster/Lens)
   */
  async search(query: string): Promise<ReputationData[]> {
    if (!query.trim()) return this.getAllAnalysts();

    const allAnalysts = await this.getAllAnalysts();
    const lowercaseQuery = query.toLowerCase();

    return allAnalysts.filter(analyst =>
      analyst.address.toLowerCase().includes(lowercaseQuery) ||
      (analyst.farcasterName && analyst.farcasterName.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Calculate reputation score for an address
   *
   * Contract Integration:
   * - Can be done on-chain (expensive) or off-chain (The Graph)
   * - Algorithm factors:
   *   1. Pool creation quality (quality scores)
   *   2. Prediction accuracy (correct outcomes)
   *   3. Total value staked
   *   4. Community engagement
   *
   * Formula (example):
   * score = (avgQualityScore * 40) + (successRate * 30) + (totalStaked * 0.01) + (poolsCreated * 5)
   */
  async calculateScore(address: string): Promise<number> {
    // TODO: Add contract integration here
    // if (USE_CONTRACTS) {
    //   const score = await readContract({
    //     address: contracts.reputationNFT,
    //     abi: ReputationNFTABI,
    //     functionName: 'calculateScore',
    //     args: [address as `0x${string}`],
    //   });
    //   return Number(score);
    // }

    // Mock calculation
    const reputation = await this.getByAddress(address);
    if (!reputation) return 0;

    // ReputationData only has: accuracy, totalPools, correctPools, wrongPools, activePools
    // Simplified score calculation using available fields
    const score =
      (reputation.accuracy * 0.7) + // 70% weight on accuracy
      (reputation.totalPools * 5);    // 5 points per pool created

    return Math.round(score);
  }

  /**
   * Update reputation (called after pool resolution)
   *
   * Contract Integration (WRITE OPERATION):
   * ```typescript
   * const hash = await writeContract({
   *   address: contracts.reputationNFT,
   *   abi: ReputationNFTABI,
   *   functionName: 'updateReputation',
   *   args: [
   *     userAddress as `0x${string}`,
   *     qualityScore,
   *     wasCorrect,
   *     amountStaked,
   *   ],
   * });
   *
   * await waitForTransaction({ hash });
   * ```
   *
   * Note: This should be called by the contract itself (internal function)
   * when a pool is resolved, not directly by frontend.
   */
  async updateReputation(
    address: string,
    _qualityScore: number,
    _wasCorrect: boolean,
    _amountStaked: number
  ): Promise<void> {
    // TODO: This should be done by smart contract internally
    // Frontend should never call this directly
    console.warn('[ReputationService] updateReputation should be called by contract, not frontend');

    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[Mock] Updated reputation for ${address}`);
  }

  /**
   * Mint reputation NFT (Soulbound Token)
   *
   * Contract Integration:
   * ```typescript
   * const hash = await writeContract({
   *   address: contracts.reputationNFT,
   *   abi: ReputationNFTABI,
   *   functionName: 'mint',
   *   args: [userAddress as `0x${string}`],
   * });
   *
   * await waitForTransaction({ hash });
   * ```
   *
   * Note: Usually auto-minted when user creates first pool
   */
  async mintNFT(address: string): Promise<string> {
    // TODO: Add contract integration here

    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockTokenId = `token-${Date.now()}`;
    console.log(`[Mock] Minted reputation NFT ${mockTokenId} for ${address}`);

    return mockTokenId;
  }

  /**
   * Get reputation tier for a score
   * (Pure function, no contract call needed)
   */
  getTier(score: number): string {
    return calculateTier(score);
  }

  /**
   * Get tier icon emoji
   * (Pure function, no contract call needed)
   */
  getTierIcon(tier: string): string {
    return getTierIcon(tier);
  }

  /**
   * Sort analysts by various criteria
   * (Client-side sorting, or use subgraph orderBy)
   */
  async getSorted(
    sortBy: 'score' | 'successRate' | 'poolsCreated' | 'totalStaked' = 'score'
  ): Promise<ReputationData[]> {
    const allAnalysts = await this.getAllAnalysts();
    return sortAnalysts(allAnalysts, sortBy);
  }
}

// Export singleton instance
export const reputationService = new ReputationService();

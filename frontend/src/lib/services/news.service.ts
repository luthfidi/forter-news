import { News, CreateNewsInput } from '@/types';
import { MOCK_NEWS, getNewsById as mockGetNewsById, getNewsByCategory as mockGetNewsByCategory } from '@/lib/mock-data';

/**
 * NEWS SERVICE
 *
 * ⭐ THIS IS THE INTEGRATION POINT FOR NEWS SMART CONTRACT ⭐
 *
 * This service abstracts data fetching for NEWS entities.
 * Currently uses mock data, but designed to seamlessly integrate with smart contracts.
 *
 * SMART CONTRACT INTEGRATION GUIDE:
 *
 * 1. Add contract imports:
 *    ```typescript
 *    import { readContract, writeContract } from 'wagmi/actions';
 *    import { NewsFactoryABI } from '@/lib/abis/NewsFactory.abi';
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
 *    async getAll() {
 *      if (USE_CONTRACTS) {
 *        const data = await readContract({
 *          address: contracts.newsFactory,
 *          abi: NewsFactoryABI,
 *          functionName: 'getAllActiveNews',
 *        });
 *        return this.mapContractToNews(data);
 *      }
 *      return MOCK_NEWS; // Fallback
 *    }
 *    ```
 *
 * 4. Add mapping functions:
 *    ```typescript
 *    private mapContractToNews(data: any[]): News[] {
 *      return data.map(item => ({
 *        id: item.id.toString(),
 *        title: item.title,
 *        // ... map all fields
 *      }));
 *    }
 *    ```
 *
 * See INTEGRATION_GUIDE.md for complete examples.
 */

class NewsService {
  /**
   * Get all news (active + resolved)
   *
   * Contract Integration:
   * - Function: getAllNews() or filter events
   * - Returns: News[] struct array
   */
  async getAll(): Promise<News[]> {
    // TODO: Add contract integration here
    // if (USE_CONTRACTS) { ... }

    // Simulate API delay for realistic testing
    await new Promise(resolve => setTimeout(resolve, 500));

    return MOCK_NEWS;
  }

  /**
   * Get news by ID
   *
   * Contract Integration:
   * - Function: getNews(uint256 newsId)
   * - Returns: News struct
   */
  async getById(id: string): Promise<News | undefined> {
    // TODO: Add contract integration here
    // if (USE_CONTRACTS) { ... }

    await new Promise(resolve => setTimeout(resolve, 300));

    return mockGetNewsById(id);
  }

  /**
   * Get news by category
   *
   * Contract Integration:
   * - Option 1: Filter client-side after fetching all
   * - Option 2: Add getNewsByCategory(Category category) to contract
   */
  async getByCategory(category: string): Promise<News[]> {
    // TODO: Add contract integration here

    await new Promise(resolve => setTimeout(resolve, 400));

    return mockGetNewsByCategory(category);
  }

  /**
   * Get active news only
   *
   * Contract Integration:
   * - Function: getAllActiveNews()
   * - Filter: status === Status.Active
   */
  async getActive(): Promise<News[]> {
    const allNews = await this.getAll();
    return allNews.filter(n => n.status === 'active');
  }

  /**
   * Create new news
   *
   * Contract Integration (CRITICAL):
   * ```typescript
   * const hash = await writeContract({
   *   address: contracts.newsFactory,
   *   abi: NewsFactoryABI,
   *   functionName: 'createNews',
   *   args: [
   *     input.title,
   *     input.description,
   *     Math.floor(input.endDate.getTime() / 1000), // Unix timestamp
   *     input.resolutionCriteria,
   *     categoryToEnum(input.category), // Convert to uint8
   *   ],
   *   value: parseUnits('10', 6), // $10 USDC deposit
   * });
   *
   * // Wait for confirmation
   * const receipt = await waitForTransaction({ hash });
   *
   * // Extract newsId from event
   * const newsId = receipt.logs[0].topics[1];
   *
   * return this.getById(newsId);
   * ```
   */
  async create(input: CreateNewsInput): Promise<News> {
    // TODO: Add contract integration here

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newNews: News = {
      id: `news-${Date.now()}`,
      title: input.title,
      description: input.description,
      category: input.category,
      endDate: input.endDate,
      resolutionCriteria: input.resolutionCriteria,
      creatorAddress: '0xuser...mock', // TODO: Get from connected wallet
      createdAt: new Date(),
      status: 'active',
      totalPools: 0,
      totalStaked: 0
    };

    return newNews;
  }

  /**
   * Search news by query
   * (Client-side filtering, no contract needed)
   */
  async search(query: string): Promise<News[]> {
    if (!query.trim()) return this.getAll();

    const allNews = await this.getAll();
    const lowercaseQuery = query.toLowerCase();

    return allNews.filter(news =>
      news.title.toLowerCase().includes(lowercaseQuery) ||
      news.description.toLowerCase().includes(lowercaseQuery) ||
      news.resolutionCriteria.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get news statistics
   * (Can be calculated client-side or fetched from contract)
   */
  async getStats() {
    const allNews = await this.getAll();
    const activeNews = allNews.filter(n => n.status === 'active');

    return {
      total: allNews.length,
      active: activeNews.length,
      resolved: allNews.filter(n => n.status === 'resolved').length,
      totalStaked: activeNews.reduce((sum, n) => sum + n.totalStaked, 0),
      totalPools: activeNews.reduce((sum, n) => sum + n.totalPools, 0),
    };
  }
}

// Export singleton instance
export const newsService = new NewsService();

import { useState, useEffect } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { Pool, CreatePoolInput } from '@/types';
import { MOCK_POOLS, getPoolsByNewsId, getPoolById, getPoolStats } from '@/lib/mock-data';

export function usePools(newsId?: string) {
  const { pools, setPools, loading, setLoading } = useGlobalStore();
  const [error, setError] = useState<string | null>(null);

  const fetchPools = async (targetNewsId?: string) => {
    try {
      setLoading('pools', true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // In a real app, this would be an API call
      // const response = await fetch(`/api/pools?newsId=${targetNewsId || newsId}`);
      // const data = await response.json();

      const poolsData = targetNewsId || newsId
        ? getPoolsByNewsId(targetNewsId || newsId)
        : MOCK_POOLS;

      setPools(poolsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pools');
      console.error('Error fetching pools:', err);
    } finally {
      setLoading('pools', false);
    }
  };

  const getPool = (id: string): Pool | undefined => {
    return getPoolById(id);
  };

  const getPoolsByNews = (targetNewsId: string): Pool[] => {
    return getPoolsByNewsId(targetNewsId);
  };

  const filterPoolsByPosition = (position: 'YES' | 'NO'): Pool[] => {
    return pools.filter(pool => pool.position === position);
  };

  const sortPools = (
    poolsToSort: Pool[],
    sortBy: 'totalStaked' | 'agreeStakes' | 'createdAt'
  ): Pool[] => {
    return [...poolsToSort].sort((a, b) => {
      switch (sortBy) {
        case 'totalStaked':
          return b.totalStaked - a.totalStaked;
        case 'agreeStakes':
          return b.agreeStakes - a.agreeStakes;
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  };

  const createPool = async (input: CreatePoolInput): Promise<Pool | null> => {
    try {
      setLoading('pools', true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock: Create new pool object
      const newPool: Pool = {
        id: `pool-${Date.now()}`,
        newsId: input.newsId,
        creatorAddress: '0xuser...mock', // TODO: Get from wallet
        position: input.position,
        reasoning: input.reasoning,
        evidence: input.evidence.filter(e => e.trim()),
        imageUrl: input.imageUrl,
        imageCaption: input.imageCaption,
        creatorStake: input.creatorStake,
        agreeStakes: 0,
        disagreeStakes: 0,
        totalStaked: input.creatorStake,
        status: 'active',
        outcome: null,
        createdAt: new Date()
      };

      // Mock: Auto-post to Farcaster
      console.log('Creating pool and posting to Farcaster:', {
        poolId: newPool.id,
        text: `Just created a pool on @forter!\n\nPosition: ${newPool.position}\n\nStake & discuss: forter.app/news/${input.newsId}`,
        embeds: input.imageUrl ? [input.imageUrl] : []
      });

      // Update local state
      setPools([newPool, ...pools]);

      return newPool;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pool');
      console.error('Error creating pool:', err);
      return null;
    } finally {
      setLoading('pools', false);
    }
  };

  const getPoolStatistics = (poolId: string) => {
    const pool = pools.find(p => p.id === poolId);
    if (!pool) return null;

    return getPoolStats(pool);
  };

  // Auto-fetch pools when newsId is provided
  useEffect(() => {
    if (newsId) {
      fetchPools(newsId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsId]);

  return {
    pools,
    loading: loading.pools,
    error,
    fetchPools,
    getPool,
    getPoolsByNews,
    filterPoolsByPosition,
    sortPools,
    createPool,
    getPoolStatistics,
    refetch: fetchPools
  };
}

// Hook for filtered pools by position
export function useFilteredPools(
  newsId: string,
  positionFilter: 'all' | 'YES' | 'NO' = 'all'
) {
  const { pools } = usePools(newsId);
  const [filteredPools, setFilteredPools] = useState<Pool[]>([]);

  useEffect(() => {
    const filtered = positionFilter === 'all'
      ? pools
      : pools.filter(pool => pool.position === positionFilter);

    setFilteredPools(filtered);
  }, [pools, positionFilter]);

  return filteredPools;
}

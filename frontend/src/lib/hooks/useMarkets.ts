import { useState, useEffect } from 'react';
import { Market } from '@/types';
import { useGlobalStore } from '@/store/useGlobalStore';

// Mock data service - replace with actual API calls
const MOCK_MARKETS: Market[] = [
  {
    id: '1',
    title: 'Will Bitcoin reach $100,000 by December 2024?',
    description: 'Predicting whether Bitcoin will hit the $100k milestone before the end of 2024, considering current market conditions, institutional adoption, and regulatory developments.',
    category: 'Crypto',
    endDate: new Date('2024-12-31'),
    totalStaked: 25000,
    analysisCount: 12,
    status: 'active'
  },
  {
    id: '2',
    title: 'Will the Federal Reserve cut interest rates in Q1 2025?',
    description: 'Analyzing Federal Reserve monetary policy decisions and economic indicators to predict rate cuts in the first quarter of 2025.',
    category: 'Macro',
    endDate: new Date('2025-03-31'),
    totalStaked: 18500,
    analysisCount: 8,
    status: 'active'
  },
  {
    id: '3',
    title: 'Will OpenAI release GPT-5 before June 2025?',
    description: 'Tracking OpenAI development timelines, computational requirements, and public statements to predict GPT-5 release timing.',
    category: 'Tech',
    endDate: new Date('2025-06-01'),
    totalStaked: 32000,
    analysisCount: 15,
    status: 'active'
  },
  {
    id: '4',
    title: 'Will Ethereum ETF see $1B+ inflows by March 2025?',
    description: 'Analyzing institutional investment patterns and ETF adoption rates for Ethereum-based financial products.',
    category: 'Crypto',
    endDate: new Date('2025-03-15'),
    totalStaked: 15000,
    analysisCount: 6,
    status: 'active'
  },
  {
    id: '5',
    title: 'Will US unemployment rate exceed 5% in 2025?',
    description: 'Economic analysis of labor market trends, recession indicators, and employment data to predict unemployment rates.',
    category: 'Macro',
    endDate: new Date('2025-12-31'),
    totalStaked: 22000,
    analysisCount: 9,
    status: 'active'
  },
  {
    id: '6',
    title: 'Will Tesla achieve full self-driving by end of 2025?',
    description: 'Evaluating Tesla AI progress, regulatory approvals, and technical milestones for autonomous driving capabilities.',
    category: 'Tech',
    endDate: new Date('2025-12-31'),
    totalStaked: 28000,
    analysisCount: 11,
    status: 'active'
  }
];

export function useMarkets() {
  const { markets, setMarkets, loading, setLoading } = useGlobalStore();
  const [error, setError] = useState<string | null>(null);

  const fetchMarkets = async () => {
    try {
      setLoading('markets', true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      // const response = await fetch('/api/markets');
      // const data = await response.json();
      
      setMarkets(MOCK_MARKETS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch markets');
      console.error('Error fetching markets:', err);
    } finally {
      setLoading('markets', false);
    }
  };

  const getMarketById = (id: string): Market | undefined => {
    return markets.find(market => market.id === id);
  };

  const getMarketsByCategory = (category: string): Market[] => {
    if (category === 'All') return markets;
    return markets.filter(market => market.category === category);
  };

  const searchMarkets = (query: string): Market[] => {
    if (!query.trim()) return markets;
    
    const lowercaseQuery = query.toLowerCase();
    return markets.filter(market => 
      market.title.toLowerCase().includes(lowercaseQuery) ||
      market.description.toLowerCase().includes(lowercaseQuery) ||
      market.category.toLowerCase().includes(lowercaseQuery)
    );
  };

  const sortMarkets = (
    marketsToSort: Market[], 
    sortBy: 'endDate' | 'totalStaked' | 'analysisCount'
  ): Market[] => {
    return [...marketsToSort].sort((a, b) => {
      switch (sortBy) {
        case 'endDate':
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        case 'totalStaked':
          return b.totalStaked - a.totalStaked;
        case 'analysisCount':
          return b.analysisCount - a.analysisCount;
        default:
          return 0;
      }
    });
  };

  const getMarketStats = () => {
    const activeMarkets = markets.filter(m => m.status === 'active');
    const totalStaked = activeMarkets.reduce((sum, market) => sum + market.totalStaked, 0);
    const totalAnalyses = activeMarkets.reduce((sum, market) => sum + market.analysisCount, 0);
    
    return {
      activeCount: activeMarkets.length,
      totalStaked,
      totalAnalyses,
      categories: [...new Set(markets.map(m => m.category))]
    };
  };

  // Auto-fetch markets on mount
  useEffect(() => {
    if (markets.length === 0) {
      fetchMarkets();
    }
  }, []);

  return {
    markets,
    loading: loading.markets,
    error,
    fetchMarkets,
    getMarketById,
    getMarketsByCategory,
    searchMarkets,
    sortMarkets,
    getMarketStats,
    refetch: fetchMarkets
  };
}

// Hook for filtering and sorting markets
export function useFilteredMarkets(
  searchQuery: string = '',
  selectedCategory: string = 'All',
  sortBy: 'endDate' | 'totalStaked' | 'analysisCount' = 'totalStaked'
) {
  const { markets } = useMarkets();
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);

  useEffect(() => {
    let filtered = markets;

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(market => market.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(market => 
        market.title.toLowerCase().includes(query) ||
        market.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'endDate':
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        case 'totalStaked':
          return b.totalStaked - a.totalStaked;
        case 'analysisCount':
          return b.analysisCount - a.analysisCount;
        default:
          return 0;
      }
    });

    setFilteredMarkets(filtered);
  }, [markets, searchQuery, selectedCategory, sortBy]);

  return filteredMarkets;
}
'use client';

import { useState, useEffect } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { Market } from '@/types';
import MarketCard from '@/components/markets/MarketCard';
import MarketFilters from '@/components/markets/MarketFilters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Mock data for development
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

const CATEGORIES = ['All', 'Crypto', 'Macro', 'Tech', 'Sports', 'Politics'];

export default function MarketsPage() {
  const { markets, setMarkets, loading, setLoading } = useGlobalStore();
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'endDate' | 'totalStaked' | 'analysisCount'>('totalStaked');

  // Load mock data on component mount
  useEffect(() => {
    setLoading('markets', true);
    // Simulate API call
    setTimeout(() => {
      setMarkets(MOCK_MARKETS);
      setLoading('markets', false);
    }, 1000);
  }, [setMarkets, setLoading]);

  // Filter and sort markets
  useEffect(() => {
    let filtered = markets;

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(market => market.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(market => 
        market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        market.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
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
  }, [markets, selectedCategory, searchQuery, sortBy]);

  const activeMarkets = filteredMarkets.filter(m => m.status === 'active');
  const totalStaked = activeMarkets.reduce((sum, market) => sum + market.totalStaked, 0);
  const totalAnalyses = activeMarkets.reduce((sum, market) => sum + market.analysisCount, 0);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent"></div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Market Explorer
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Discover active prediction markets. Stake on outcomes or back credible analysts building verifiable, on-chain reputation.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {activeMarkets.length}
              </div>
              <div className="text-sm text-muted-foreground">Active Markets</div>
            </CardContent>
          </Card>
          <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-accent mb-1">
                ${totalStaked.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Staked</div>
            </CardContent>
          </Card>
          <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-foreground mb-1">
                {totalAnalyses}
              </div>
              <div className="text-sm text-muted-foreground">Expert Analyses</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <MarketFilters
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Markets Grid */}
        {loading.markets ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border border-border/50 bg-background/80 backdrop-blur-sm animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3 mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-muted rounded w-16"></div>
                    <div className="h-6 bg-muted rounded w-20"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredMarkets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        ) : (
          <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No markets found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or explore different categories.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        {filteredMarkets.length > 0 && (
          <div className="mt-12 text-center">
            <Card className="border border-border/50 bg-background/90 backdrop-blur-sm max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Ready to Start Analyzing?</h3>
                <p className="text-muted-foreground mb-6">
                  Join the Information Finance revolution. Stake on credibility and build your on-chain reputation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90">
                    Submit Analysis
                  </Button>
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
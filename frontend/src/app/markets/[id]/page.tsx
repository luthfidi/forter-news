'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useGlobalStore } from '@/store/useGlobalStore';
import { Market, Analysis, StakePosition } from '@/types';
import MarketOverview from '@/components/markets/MarketOverview';
import AnalysisSection from '@/components/markets/AnalysisSection';
import StakingInterface from '@/components/markets/StakingInterface';
import InformerProfiles from '@/components/markets/InformerProfiles';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Mock analysis data
const MOCK_ANALYSES: Analysis[] = [
  {
    id: '1',
    marketId: '1',
    authorAddress: '0x1234...5678',
    position: 'YES',
    reasoning: 'Bitcoin is showing strong institutional adoption with recent ETF approvals and corporate treasury allocations. The technical analysis indicates a bullish continuation pattern, and the upcoming halving event historically drives significant price appreciation. Current support levels at $65k provide a strong foundation for the next leg up.',
    evidence: [
      'https://example.com/btc-etf-data',
      'https://example.com/institutional-flows',
      'https://example.com/technical-analysis'
    ],
    stakeAmount: 1000,
    createdAt: new Date('2024-10-01'),
    farcasterCastHash: 'cast123'
  },
  {
    id: '2',
    marketId: '1',
    authorAddress: '0xabcd...efgh',
    position: 'NO',
    reasoning: 'While Bitcoin has shown resilience, the macro environment presents significant headwinds. Rising interest rates, potential recession indicators, and regulatory uncertainty in key markets could limit upside potential. The $100k target represents a 50%+ gain from current levels, which seems optimistic given current market conditions.',
    evidence: [
      'https://example.com/macro-analysis',
      'https://example.com/regulatory-risks',
      'https://example.com/market-sentiment'
    ],
    stakeAmount: 750,
    createdAt: new Date('2024-10-02'),
    farcasterCastHash: 'cast456'
  }
];

export default function MarketDetailPage() {
  const params = useParams();
  const marketId = params.id as string;
  const { markets, currentMarket, setCurrentMarket, analyses, setAnalyses, loading, setLoading } = useGlobalStore();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'staking'>('overview');
  const [showStakingModal, setShowStakingModal] = useState(false);

  // Find current market
  useEffect(() => {
    if (markets.length > 0) {
      const market = markets.find(m => m.id === marketId);
      setCurrentMarket(market || null);
    }
  }, [marketId, markets, setCurrentMarket]);

  // Load analyses for current market
  useEffect(() => {
    if (marketId) {
      setLoading('analyses', true);
      // Simulate API call
      setTimeout(() => {
        const marketAnalyses = MOCK_ANALYSES.filter(a => a.marketId === marketId);
        setAnalyses(marketAnalyses);
        setLoading('analyses', false);
      }, 800);
    }
  }, [marketId, setAnalyses, setLoading]);

  if (!currentMarket) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Market not found</h3>
              <p className="text-muted-foreground mb-6">
                The market you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/markets">
                <Button>Browse Markets</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const yesStakes = analyses.filter(a => a.position === 'YES').reduce((sum, a) => sum + a.stakeAmount, 0);
  const noStakes = analyses.filter(a => a.position === 'NO').reduce((sum, a) => sum + a.stakeAmount, 0);
  const totalAnalysisStakes = yesStakes + noStakes;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/markets" className="hover:text-foreground transition-colors">
            Markets
          </Link>
          <span>/</span>
          <span className="text-foreground">Market Details</span>
        </div>

        {/* Market Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {currentMarket.category}
                </Badge>
                <Badge variant={currentMarket.status === 'active' ? 'default' : 'secondary'}>
                  {currentMarket.status.charAt(0).toUpperCase() + currentMarket.status.slice(1)}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3">
                {currentMarket.title}
              </h1>
              <p className="text-muted-foreground text-lg">
                {currentMarket.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowStakingModal(true)}
                className="bg-gradient-to-r from-primary to-primary/90"
              >
                Stake Now
              </Button>
              <Button variant="outline">
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 p-1 bg-background/50 rounded-lg border border-border/50 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'analysis', label: 'Analysis', icon: '🔍' },
            { id: 'staking', label: 'Staking', icon: '💰' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2">
            {activeTab === 'overview' && (
              <MarketOverview 
                market={currentMarket} 
                analyses={analyses}
                loading={loading.analyses}
              />
            )}
            {activeTab === 'analysis' && (
              <AnalysisSection 
                market={currentMarket}
                analyses={analyses}
                loading={loading.analyses}
              />
            )}
            {activeTab === 'staking' && (
              <StakingInterface 
                market={currentMarket}
                analyses={analyses}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Market Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Staked</span>
                    <span className="font-semibold">${currentMarket.totalStaked.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Analyses</span>
                    <span className="font-semibold">{currentMarket.analysisCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ends</span>
                    <span className="font-semibold">
                      {new Date(currentMarket.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border/30">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">YES Stakes</span>
                      <span className="font-semibold text-green-600">${yesStakes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">NO Stakes</span>
                      <span className="font-semibold text-red-600">${noStakes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Informers */}
            <InformerProfiles analyses={analyses} />

            {/* Market Activity */}
            <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {analyses.slice(0, 3).map((analysis) => (
                    <div key={analysis.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <div className={`w-2 h-2 rounded-full ${
                        analysis.position === 'YES' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {analysis.authorAddress}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Staked ${analysis.stakeAmount} on {analysis.position}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Staking Modal */}
        {showStakingModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] border border-border/50 bg-background flex flex-col">
              <CardContent className="p-6 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                  <h3 className="text-xl font-bold">Stake on Market</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowStakingModal(false)}
                  >
                    ✕
                  </Button>
                </div>
                <div className="overflow-y-auto flex-1 min-h-0 pr-2 -mr-2">
                  <StakingInterface 
                    market={currentMarket}
                    analyses={analyses}
                    onComplete={() => setShowStakingModal(false)}
                    isModal={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
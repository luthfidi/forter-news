'use client';

import { Market, Analysis } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MarketOverviewProps {
  market: Market;
  analyses: Analysis[];
  loading: boolean;
}

export default function MarketOverview({ market, analyses, loading }: MarketOverviewProps) {
  const yesAnalyses = analyses.filter(a => a.position === 'YES');
  const noAnalyses = analyses.filter(a => a.position === 'NO');
  const yesStakes = yesAnalyses.reduce((sum, a) => sum + a.stakeAmount, 0);
  const noStakes = noAnalyses.reduce((sum, a) => sum + a.stakeAmount, 0);
  const totalStakes = yesStakes + noStakes;

  const yesPercentage = totalStakes > 0 ? (yesStakes / totalStakes) * 100 : 50;
  const noPercentage = totalStakes > 0 ? (noStakes / totalStakes) * 100 : 50;

  const timeRemaining = () => {
    const now = new Date();
    const endDate = new Date(market.endDate);
    const diffMs = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Market ended';
    if (diffDays === 0) return 'Ends today';
    if (diffDays === 1) return '1 day remaining';
    if (diffDays < 30) return `${diffDays} days remaining`;
    
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} remaining`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border border-border/50 bg-background/80 backdrop-blur-sm animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Outcome Prediction */}
      <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6">Market Sentiment</h3>
          
          {/* YES/NO Visualization */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="font-semibold">YES</span>
                <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                  {yesAnalyses.length} analyses
                </Badge>
              </div>
              <span className="text-lg font-bold text-green-600">
                {yesPercentage.toFixed(1)}%
              </span>
            </div>
            
            <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                style={{ width: `${yesPercentage}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="font-semibold">NO</span>
                <Badge variant="secondary" className="bg-red-500/10 text-red-600">
                  {noAnalyses.length} analyses
                </Badge>
              </div>
              <span className="text-lg font-bold text-red-600">
                {noPercentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Stake Distribution */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-500/5 border border-green-500/20">
              <div className="text-2xl font-bold text-green-600">
                ${yesStakes.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">YES Stakes</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-500/5 border border-red-500/20">
              <div className="text-2xl font-bold text-red-600">
                ${noStakes.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">NO Stakes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Information */}
      <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6">Market Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Category</div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {market.category}
                </Badge>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Resolution Date</div>
                <div className="font-medium">
                  {new Date(market.endDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Time Remaining</div>
                <div className="font-medium">{timeRemaining()}</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Total Staked</div>
                <div className="text-2xl font-bold text-primary">
                  ${market.totalStaked.toLocaleString()}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Expert Analyses</div>
                <div className="text-2xl font-bold text-accent">
                  {market.analysisCount}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Status</div>
                <Badge variant={market.status === 'active' ? 'default' : 'secondary'}>
                  {market.status.charAt(0).toUpperCase() + market.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resolution Criteria */}
      <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">Resolution Criteria</h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-background/50 border border-border/30">
              <h4 className="font-semibold mb-2">✅ Market resolves YES if:</h4>
              <p className="text-muted-foreground">
                The outcome described in the market title occurs before the resolution date.
                Verification will be done through oracles and verifiable data sources.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-background/50 border border-border/30">
              <h4 className="font-semibold mb-2">❌ Market resolves NO if:</h4>
              <p className="text-muted-foreground">
                The outcome does not occur by the resolution date, or verifiable evidence
                shows the outcome will not occur within the specified timeframe.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-background/50 border border-border/30">
              <h4 className="font-semibold mb-2">🔍 Verification Process:</h4>
              <p className="text-muted-foreground">
                Resolution will be determined by oracle data and AI verification systems.
                There is a 24-hour challenge period for disputed resolutions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
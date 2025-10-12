'use client';

import { Analysis } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface InformerProfilesProps {
  analyses: Analysis[];
}

export default function InformerProfiles({ analyses }: InformerProfilesProps) {
  // Group analyses by author and calculate stats
  const informerStats = analyses.reduce((acc, analysis) => {
    const address = analysis.authorAddress;
    
    if (!acc[address]) {
      acc[address] = {
        address,
        analyses: [],
        totalStaked: 0,
        positions: { YES: 0, NO: 0 }
      };
    }
    
    acc[address].analyses.push(analysis);
    acc[address].totalStaked += analysis.stakeAmount;
    acc[address].positions[analysis.position]++;
    
    return acc;
  }, {} as Record<string, {
    address: string;
    analyses: Analysis[];
    totalStaked: number;
    positions: { YES: number; NO: number };
  }>);

  const informers = Object.values(informerStats).sort((a, b) => b.totalStaked - a.totalStaked);

  const getReputationData = (address: string) => {
    // Mock reputation data - in real app, fetch from blockchain/API
    const mockReputations: Record<string, { 
      accuracy: number; 
      tier: string; 
      totalMarkets: number;
      streak: number;
      specialty: string;
    }> = {
      '0x1234...5678': { 
        accuracy: 87, 
        tier: 'Master', 
        totalMarkets: 23,
        streak: 5,
        specialty: 'Crypto'
      },
      '0xabcd...efgh': { 
        accuracy: 72, 
        tier: 'Expert', 
        totalMarkets: 15,
        streak: 2,
        specialty: 'Macro'
      }
    };
    return mockReputations[address] || { 
      accuracy: 0, 
      tier: 'Novice', 
      totalMarkets: 0,
      streak: 0,
      specialty: 'General'
    };
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Novice': return '🥉';
      case 'Analyst': return '🥈';
      case 'Expert': return '🥇';
      case 'Master': return '💎';
      case 'Legend': return '👑';
      default: return '❓';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Novice': return 'from-slate-400 to-slate-500';
      case 'Analyst': return 'from-slate-500 to-slate-600';
      case 'Expert': return 'from-yellow-500 to-yellow-600';
      case 'Master': return 'from-blue-500 to-purple-600';
      case 'Legend': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  if (informers.length === 0) {
    return (
      <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="font-bold mb-4">Top Informers</h3>
          <div className="text-center py-6">
            <div className="text-3xl mb-3">👤</div>
            <div className="text-muted-foreground text-sm">
              No informers yet. Be the first to submit an analysis!
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <h3 className="font-bold mb-4">Top Informers ({informers.length})</h3>
        
        <div className="space-y-4">
          {informers.slice(0, 5).map((informer, index) => {
            const reputation = getReputationData(informer.address);
            const dominantPosition = informer.positions.YES >= informer.positions.NO ? 'YES' : 'NO';
            
            return (
              <div
                key={informer.address}
                className="group p-4 rounded-lg border border-border/30 hover:border-accent/50 transition-all duration-200 hover:bg-background/50"
              >
                {/* Rank Badge */}
                {index < 3 && (
                  <div className="float-right">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        index === 0 ? 'bg-yellow-500/10 text-yellow-600' :
                        index === 1 ? 'bg-gray-400/10 text-gray-600' :
                        'bg-orange-500/10 text-orange-600'
                      }`}
                    >
                      #{index + 1}
                    </Badge>
                  </div>
                )}

                {/* Informer Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTierColor(reputation.tier)} flex items-center justify-center text-white font-bold shadow-md`}>
                    {informer.address.slice(2, 4).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm truncate">{informer.address}</span>
                      <Badge variant="secondary" className="text-xs">
                        {getTierIcon(reputation.tier)} {reputation.tier}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {reputation.accuracy}% accuracy • {reputation.totalMarkets} markets
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="text-center p-2 rounded bg-background/50">
                    <div className="text-sm font-semibold text-primary">
                      ${informer.totalStaked.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Staked</div>
                  </div>
                  <div className="text-center p-2 rounded bg-background/50">
                    <div className="text-sm font-semibold text-accent">
                      {informer.analyses.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Analyses</div>
                  </div>
                </div>

                {/* Position Distribution */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 text-xs text-muted-foreground">Positions:</div>
                  <div className="flex gap-1">
                    {informer.positions.YES > 0 && (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600 text-xs">
                        {informer.positions.YES} YES
                      </Badge>
                    )}
                    {informer.positions.NO > 0 && (
                      <Badge variant="secondary" className="bg-red-500/10 text-red-600 text-xs">
                        {informer.positions.NO} NO
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {reputation.streak > 0 && (
                      <span className="text-muted-foreground">
                        🔥 {reputation.streak} streak
                      </span>
                    )}
                    <span className="text-muted-foreground">
                      📊 {reputation.specialty}
                    </span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs py-1 px-2 h-auto"
                  >
                    Back Informer
                  </Button>
                </div>

                {/* Progress indicator for accuracy */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Accuracy</span>
                    <span className="font-medium">{reputation.accuracy}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getTierColor(reputation.tier)} transition-all duration-500`}
                      style={{ width: `${reputation.accuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        {informers.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All {informers.length} Informers
            </Button>
          </div>
        )}

        {/* Reputation Explanation */}
        <div className="mt-4 p-3 rounded-lg bg-background/50 border border-border/30">
          <div className="text-xs text-muted-foreground">
            <div className="font-medium mb-1">💡 About Reputation</div>
            <div>
              Informer credibility is based on historical accuracy, market participation, 
              and stake conviction. Higher tiers unlock better rewards and visibility.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
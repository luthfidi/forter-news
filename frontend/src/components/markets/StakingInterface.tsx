'use client';

import { useState } from 'react';
import { Market, Analysis } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StakingInterfaceProps {
  market: Market;
  analyses: Analysis[];
  onComplete?: () => void;
  isModal?: boolean;
}

export default function StakingInterface({ market, analyses, onComplete, isModal }: StakingInterfaceProps) {
  const [stakingType, setStakingType] = useState<'outcome' | 'informer'>('outcome');
  const [selectedOutcome, setSelectedOutcome] = useState<'YES' | 'NO'>('YES');
  const [selectedInformer, setSelectedInformer] = useState<string>('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const uniqueInformers = Array.from(new Set(analyses.map(a => a.authorAddress)))
    .map(address => {
      const informerAnalyses = analyses.filter(a => a.authorAddress === address);
      const totalStaked = informerAnalyses.reduce((sum, a) => sum + a.stakeAmount, 0);
      return {
        address,
        analysisCount: informerAnalyses.length,
        totalStaked,
        positions: informerAnalyses.map(a => a.position)
      };
    });

  const getReputationData = (address: string) => {
    // Mock reputation data
    const mockReputations: Record<string, { accuracy: number; tier: string; totalMarkets: number }> = {
      '0x1234...5678': { accuracy: 87, tier: 'Master', totalMarkets: 23 },
      '0xabcd...efgh': { accuracy: 72, tier: 'Expert', totalMarkets: 15 }
    };
    return mockReputations[address] || { accuracy: 0, tier: 'Novice', totalMarkets: 0 };
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

  const calculatePotentialReward = () => {
    const amount = parseFloat(stakeAmount);
    if (!amount) return 0;

    if (stakingType === 'outcome') {
      // Simplified calculation - in reality would depend on pool ratios
      return amount * 1.8; // Assume 80% return
    } else {
      // Informer staking typically has higher returns due to 70% pool allocation
      return amount * 2.3; // Assume 130% return
    }
  };

  const handleStake = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Stake submitted:', {
        type: stakingType,
        amount: parseFloat(stakeAmount),
        target: stakingType === 'outcome' ? selectedOutcome : selectedInformer,
        marketId: market.id
      });
      
      // Reset form
      setStakeAmount('');
      setSelectedInformer('');
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Staking failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const yesAnalyses = analyses.filter(a => a.position === 'YES');
  const noAnalyses = analyses.filter(a => a.position === 'NO');
  const yesStakes = yesAnalyses.reduce((sum, a) => sum + a.stakeAmount, 0);
  const noStakes = noAnalyses.reduce((sum, a) => sum + a.stakeAmount, 0);

  return (
    <div className={`space-y-4 ${isModal ? 'space-y-3' : 'space-y-6'}`}>
      {/* Staking Type Selection */}
      <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
        <CardContent className={`${isModal ? 'p-4' : 'p-6'}`}>
          <h3 className={`font-bold mb-3 ${isModal ? 'text-lg' : 'text-xl'}`}>Choose Your Staking Strategy</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setStakingType('outcome')}
              className={`${isModal ? 'p-4' : 'p-6'} rounded-lg border-2 transition-all text-left ${
                stakingType === 'outcome'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-border/30 hover:border-blue-500/50'
              }`}
            >
              <div className={`flex items-center gap-3 ${isModal ? 'mb-2' : 'mb-3'}`}>
                <div className={`${isModal ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold`}>
                  A
                </div>
                <div>
                  <div className={`font-bold ${isModal ? 'text-sm' : ''}`}>Outcome Staking</div>
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 text-xs">
                    30% Reward Pool
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Stake directly on YES/NO outcomes. Traditional prediction market approach.
              </p>
            </button>

            <button
              onClick={() => setStakingType('informer')}
              className={`${isModal ? 'p-4' : 'p-6'} rounded-lg border-2 transition-all text-left ${
                stakingType === 'informer'
                  ? 'border-accent bg-accent/10'
                  : 'border-border/30 hover:border-accent/50'
              }`}
            >
              <div className={`flex items-center gap-3 ${isModal ? 'mb-2' : 'mb-3'}`}>
                <div className={`${isModal ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-xs font-bold`}>
                  B
                </div>
                <div>
                  <div className={`font-bold ${isModal ? 'text-sm' : ''}`}>Informer Staking</div>
                  <Badge variant="secondary" className="bg-accent/10 text-accent text-xs">
                    70% Reward Pool
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Back specific analysts based on their credibility and track record.
              </p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Outcome Staking Interface */}
      {stakingType === 'outcome' && (
        <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
          <CardContent className={`${isModal ? 'p-4' : 'p-6'}`}>
            <h3 className={`font-bold ${isModal ? 'text-lg mb-4' : 'text-xl mb-6'}`}>Stake on Outcome</h3>
            
            {/* YES/NO Selection */}
            <div className={`${isModal ? 'mb-4' : 'mb-6'}`}>
              <label className="block text-sm font-medium mb-2">Select Outcome</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedOutcome('YES')}
                  className={`${isModal ? 'p-3' : 'p-4'} rounded-lg border-2 transition-all ${
                    selectedOutcome === 'YES'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-border/30 hover:border-green-500/50'
                  }`}
                >
                  <div className={`font-bold text-green-600 ${isModal ? 'text-base' : 'text-lg'}`}>YES</div>
                  <div className="text-xs text-muted-foreground">
                    {yesAnalyses.length} analyses • ${yesStakes.toLocaleString()} staked
                  </div>
                </button>
                
                <button
                  onClick={() => setSelectedOutcome('NO')}
                  className={`${isModal ? 'p-3' : 'p-4'} rounded-lg border-2 transition-all ${
                    selectedOutcome === 'NO'
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-border/30 hover:border-red-500/50'
                  }`}
                >
                  <div className={`font-bold text-red-600 ${isModal ? 'text-base' : 'text-lg'}`}>NO</div>
                  <div className="text-xs text-muted-foreground">
                    {noAnalyses.length} analyses • ${noStakes.toLocaleString()} staked
                  </div>
                </button>
              </div>
            </div>

            {/* Stake Amount */}
            <div className={`${isModal ? 'mb-4' : 'mb-6'}`}>
              <label className="block text-sm font-medium mb-2">Stake Amount (USDC)</label>
              <Input
                type="number"
                placeholder="100"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="bg-background/50 border-border/50"
              />
              <div className="text-xs text-muted-foreground mt-1">
                Minimum $1 USDC
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informer Staking Interface */}
      {stakingType === 'informer' && (
        <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
          <CardContent className={`${isModal ? 'p-4' : 'p-6'}`}>
            <h3 className={`font-bold ${isModal ? 'text-lg mb-4' : 'text-xl mb-6'}`}>Back an Informer</h3>
            
            {uniqueInformers.length > 0 ? (
              <div className={`space-y-3 ${isModal ? 'mb-4' : 'mb-6'}`}>
                {uniqueInformers.map((informer) => {
                  const reputation = getReputationData(informer.address);
                  
                  return (
                    <button
                      key={informer.address}
                      onClick={() => setSelectedInformer(informer.address)}
                      className={`w-full ${isModal ? 'p-3' : 'p-4'} rounded-lg border-2 transition-all text-left ${
                        selectedInformer === informer.address
                          ? 'border-accent bg-accent/10'
                          : 'border-border/30 hover:border-accent/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                            {informer.address.slice(2, 4).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{informer.address}</span>
                              <Badge variant="secondary" className="text-xs">
                                {getTierIcon(reputation.tier)} {reputation.tier}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {reputation.accuracy}% accuracy • {reputation.totalMarkets} markets
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            ${informer.totalStaked.toLocaleString()} staked
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {informer.analysisCount} analysis{informer.analysisCount !== 1 ? 'es' : ''}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex gap-1">
                        {informer.positions.map((position, index) => (
                          <Badge 
                            key={index}
                            variant="secondary"
                            className={`text-xs ${
                              position === 'YES' 
                                ? 'bg-green-500/10 text-green-600' 
                                : 'bg-red-500/10 text-red-600'
                            }`}
                          >
                            {position}
                          </Badge>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 mb-6">
                <div className="text-4xl mb-3">👤</div>
                <div className="text-muted-foreground">
                  No analysts have submitted analyses yet. Be the first to analyze this market!
                </div>
              </div>
            )}

            {/* Stake Amount */}
            {selectedInformer && (
              <div className={`${isModal ? 'mb-4' : 'mb-6'}`}>
                <label className="block text-sm font-medium mb-2">Stake Amount (USDC)</label>
                <Input
                  type="number"
                  placeholder="100"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="bg-background/50 border-border/50"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Minimum $1 USDC
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stake Summary & Submit */}
      {stakeAmount && parseFloat(stakeAmount) >= 1 && (
        <Card className="border border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className={`${isModal ? 'p-4' : 'p-6'}`}>
            <h3 className={`font-bold ${isModal ? 'text-base mb-3' : 'text-lg mb-4'}`}>Stake Summary</h3>
            
            <div className={`space-y-2 ${isModal ? 'mb-4' : 'mb-6'}`}>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Staking Type</span>
                <span className="font-medium capitalize">{stakingType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target</span>
                <span className="font-medium">
                  {stakingType === 'outcome' ? selectedOutcome : selectedInformer}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stake Amount</span>
                <span className="font-medium">${parseFloat(stakeAmount).toLocaleString()} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Potential Reward</span>
                <span className="font-medium text-green-600">
                  ${calculatePotentialReward().toLocaleString()} USDC
                </span>
              </div>
            </div>

            <Button
              onClick={handleStake}
              disabled={
                isProcessing || 
                !stakeAmount || 
                parseFloat(stakeAmount) < 1 ||
                (stakingType === 'informer' && !selectedInformer)
              }
              className="w-full bg-gradient-to-r from-primary to-primary/90"
            >
              {isProcessing ? 'Processing...' : `Stake ${stakeAmount} USDC`}
            </Button>
            
            <div className="text-xs text-muted-foreground text-center mt-3">
              By staking, you agree to the market resolution criteria and platform terms.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
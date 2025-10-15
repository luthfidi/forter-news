'use client';

import { Pool } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PoolCardProps {
  pool: Pool;
  onStake?: (poolId: string, position: 'agree' | 'disagree') => void;
}

export default function PoolCard({ pool, onStake }: PoolCardProps) {
  const [showFullReasoning, setShowFullReasoning] = useState(false);
  const [showStakeInput, setShowStakeInput] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<'agree' | 'disagree' | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');

  // Calculate percentages
  const agreePercentage = pool.totalStaked > 0
    ? Math.round((pool.agreeStakes / pool.totalStaked) * 100)
    : 0;
  const disagreePercentage = pool.totalStaked > 0
    ? Math.round((pool.disagreeStakes / pool.totalStaked) * 100)
    : 0;

  // Mock reputation data
  const getReputationDisplay = (address: string) => {
    const mockReputations: Record<string, { accuracy: number; tier: string }> = {
      '0x1234...5678': { accuracy: 87, tier: 'Master' },
      '0xabcd...efgh': { accuracy: 72, tier: 'Expert' },
      '0x2222...3333': { accuracy: 91, tier: 'Legend' },
      '0x4444...5555': { accuracy: 65, tier: 'Analyst' },
      '0x6666...7777': { accuracy: 78, tier: 'Expert' },
      '0x8888...9999': { accuracy: 70, tier: 'Expert' },
      '0xaaaa...bbbb': { accuracy: 88, tier: 'Master' },
      '0xcccc...dddd': { accuracy: 75, tier: 'Expert' },
      '0x9999...1111': { accuracy: 82, tier: 'Master' }
    };

    return mockReputations[address] || { accuracy: 0, tier: 'Novice' };
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

  const reputation = getReputationDisplay(pool.creatorAddress);

  const handleStakeButtonClick = (position: 'agree' | 'disagree') => {
    setSelectedPosition(position);
    setShowStakeInput(true);
    setStakeAmount('');
  };

  const handleConfirmStake = () => {
    if (stakeAmount && parseFloat(stakeAmount) >= 1 && selectedPosition) {
      onStake?.(pool.id, selectedPosition);
      // Reset state
      setShowStakeInput(false);
      setSelectedPosition(null);
      setStakeAmount('');
    }
  };

  const handleCancelStake = () => {
    setShowStakeInput(false);
    setSelectedPosition(null);
    setStakeAmount('');
  };

  return (
    <Card className={`border backdrop-blur-sm transition-all duration-200 ${
      pool.status === 'resolved'
        ? 'border-accent/50 bg-accent/5 hover:bg-accent/10'
        : 'border-border/50 bg-background/80 hover:bg-background/90'
    }`}>
      <CardContent className="p-6">
        {/* Resolved Badge (if resolved) */}
        {pool.status === 'resolved' && pool.outcome && (
          <div className="mb-4 pb-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <Badge className={`px-3 py-1 ${
                pool.outcome === 'creator_correct'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}>
                {pool.outcome === 'creator_correct' ? '✅ CORRECT' : '❌ WRONG'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Resolved Pool
              </span>
            </div>
            {pool.outcome === 'creator_correct' ? (
              <p className="text-xs text-muted-foreground mt-2">
                Pool creator was correct. "Agree" stakers won.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground mt-2">
                Pool creator was wrong. "Disagree" stakers won.
              </p>
            )}
          </div>
        )}

        {/* Creator Info */}
        <div className="flex items-start justify-between mb-4">
          <Link href={`/profile/${pool.creatorAddress}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
              {pool.creatorAddress.slice(2, 4).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm hover:underline">{pool.creatorAddress}</span>
                <Badge variant="secondary" className="text-xs">
                  {getTierIcon(reputation.tier)} {reputation.tier}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {reputation.accuracy}% accuracy
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Badge
              variant={pool.position === 'YES' ? 'default' : 'secondary'}
              className={pool.position === 'YES'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
              }
            >
              {pool.position}
            </Badge>
          </div>
        </div>

        {/* Image if exists */}
        {pool.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden border border-border/30">
            <div className="relative w-full h-48">
              <Image
                src={pool.imageUrl}
                alt={pool.imageCaption || 'Pool analysis chart'}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            {pool.imageCaption && (
              <div className="p-2 bg-background/50 text-xs text-muted-foreground text-center">
                📊 {pool.imageCaption}
              </div>
            )}
          </div>
        )}

        {/* Reasoning */}
        <div className="mb-4">
          <p className={`text-sm text-foreground leading-relaxed ${!showFullReasoning && pool.reasoning.length > 150 ? 'line-clamp-3' : ''}`}>
            {pool.reasoning}
          </p>
          {pool.reasoning.length > 150 && (
            <button
              onClick={() => setShowFullReasoning(!showFullReasoning)}
              className="text-xs text-primary hover:underline mt-1"
            >
              {showFullReasoning ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Evidence Links */}
        {pool.evidence.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-medium text-muted-foreground mb-2">
              Supporting Evidence:
            </div>
            <div className="flex flex-wrap gap-2">
              {pool.evidence.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2 py-1 bg-accent/10 text-accent rounded hover:bg-accent/20 transition-colors"
                >
                  Source {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Stakes Visualization */}
        <div className="mb-4 p-4 rounded-lg bg-background/50 border border-border/30">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Pool Stakes</span>
            <span className="text-muted-foreground">${pool.totalStaked.toLocaleString()}</span>
          </div>

          {/* Progress bars */}
          <div className="space-y-2">
            {/* Agree (Back Pool) */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-green-600">Agree (Back this pool)</span>
                <span className="font-medium">${pool.agreeStakes.toLocaleString()} ({agreePercentage}%)</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                  style={{ width: `${agreePercentage}%` }}
                />
              </div>
            </div>

            {/* Disagree (Against Pool) */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-red-600">Disagree (Against pool)</span>
                <span className="font-medium">${pool.disagreeStakes.toLocaleString()} ({disagreePercentage}%)</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
                  style={{ width: `${disagreePercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Creator Stake */}
          <div className="mt-3 pt-3 border-t border-border/30">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Creator&apos;s Stake</span>
              <span className="font-medium">${pool.creatorStake.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {pool.status === 'resolved' ? (
          <div className="p-3 bg-accent/10 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              🔒 Pool Settled - Staking Closed
            </p>
          </div>
        ) : !showStakeInput ? (
          <div className="flex gap-2">
            <Button
              onClick={() => handleStakeButtonClick('agree')}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              Stake Agree
            </Button>
            <Button
              onClick={() => handleStakeButtonClick('disagree')}
              variant="outline"
              className="flex-1 border-red-500/50 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500"
              size="sm"
            >
              Stake Disagree
            </Button>
          </div>
        ) : (
          /* Inline Stake Input */
          <div className="space-y-3 p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Staking on:{' '}
                <span className={selectedPosition === 'agree' ? 'text-green-600' : 'text-red-600'}>
                  {selectedPosition === 'agree' ? 'Agree' : 'Disagree'}
                </span>
              </span>
              <button
                onClick={handleCancelStake}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕ Cancel
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Amount (USDC)
              </label>
              <Input
                type="number"
                placeholder="Min $1"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                min="1"
                className="bg-background/50"
              />
            </div>

            <Button
              onClick={handleConfirmStake}
              disabled={!stakeAmount || parseFloat(stakeAmount) < 1}
              className={`w-full ${
                selectedPosition === 'agree'
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-red-500 hover:bg-red-600'
              } text-white`}
              size="sm"
            >
              Confirm Stake ${stakeAmount || '0'}
            </Button>
          </div>
        )}

        {/* Metadata */}
        <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>Created {pool.createdAt.toLocaleDateString()}</span>
          {pool.farcasterCastHash && (
            <a
              href={`https://warpcast.com/~/conversations/${pool.farcasterCastHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              📱 View on Farcaster
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

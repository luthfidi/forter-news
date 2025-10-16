'use client';

import { ReputationData } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getTierIcon, getPoolsByCreator } from '@/lib/mock-data';

interface AnalystCardProps {
  analyst: ReputationData;
}

export default function AnalystCard({ analyst }: AnalystCardProps) {
  // Get recent pools for this analyst
  const pools = getPoolsByCreator(analyst.address);
  const recentPools = pools
    .filter(p => p.status === 'resolved')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 2);

  return (
    <Card className="border border-border bg-card hover:bg-secondary transition-all duration-300 hover:shadow-lg h-full">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
              {analyst.address.slice(2, 4).toUpperCase()}
            </div>
            <div>
              <Link
                href={`/profile/${analyst.address}`}
                className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
              >
                {analyst.address}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {getTierIcon(analyst.tier)} {analyst.tier}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {analyst.accuracy}% Accuracy
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-border/30">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{analyst.totalPools}</div>
            <div className="text-[10px] text-muted-foreground">Pools</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-600">{analyst.correctPools}</div>
            <div className="text-[10px] text-muted-foreground">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-rose-600">{analyst.wrongPools}</div>
            <div className="text-[10px] text-muted-foreground">Wrong</div>
          </div>
        </div>

        {/* Specialty */}
        <div className="mb-4">
          <div className="text-xs font-medium text-muted-foreground mb-1">Specialty</div>
          <div className="flex flex-wrap gap-1">
            {analyst.specialty.split(',').map((spec, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {spec.trim()}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {recentPools.length > 0 && (
          <div className="mb-4 flex-grow">
            <div className="text-xs font-medium text-muted-foreground mb-2">Recent Activity</div>
            <div className="space-y-1.5">
              {recentPools.map((pool) => (
                <div key={pool.id} className="text-xs flex items-center gap-1.5">
                  <span className="text-base">
                    {pool.outcome === 'creator_correct' ? '✅' : '❌'}
                  </span>
                  <span className="text-muted-foreground line-clamp-1 flex-1">
                    {pool.position} position
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Streak */}
        {analyst.currentStreak > 0 && (
          <div className="mb-4 p-2 rounded-lg bg-primary/5 border border-primary/20">
            <div className="text-xs font-medium text-primary">
              🔥 {analyst.currentStreak} Win Streak
            </div>
          </div>
        )}

        {/* CTA */}
        <Link href={`/profile/${analyst.address}`} className="mt-auto">
          <Button
            variant="outline"
            className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
            size="sm"
          >
            View Profile →
          </Button>
        </Link>

        {/* Member Since */}
        <div className="mt-3 pt-3 border-t border-border/30 text-center">
          <span className="text-[10px] text-muted-foreground">
            Member since {analyst.memberSince.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

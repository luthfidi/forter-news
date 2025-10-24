'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { getTierIcon } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { poolService, stakingService, newsService, reputationService } from '@/lib/services';
import type { Pool, PoolStake, News, ReputationData } from '@/types';
import {
  ExternalLink,
  FileText,
  Layers,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Activity
} from 'lucide-react';

export default function ProfilePage() {
  const params = useParams();
  const profileAddress = params.address as string;
  const address = profileAddress; // Alias for compatibility with render code
  const { address: connectedAddress, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'pools' | 'stakes' | 'news' | 'activity'>('pools');

  // State for contract data
  const [pools, setPools] = useState<Pool[]>([]);
  const [stakes, setStakes] = useState<PoolStake[]>([]);
  const [newsCreated, setNewsCreated] = useState<News[]>([]);
  const [reputation, setReputation] = useState<ReputationData | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if viewing own profile
  const isOwnProfile = isConnected && connectedAddress?.toLowerCase() === profileAddress.toLowerCase();

  // Load profile data from contract
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        console.log('[ProfilePage] Loading data for:', profileAddress);

        // Load all data in parallel
        const [poolsData, stakesData, allNews, reputationData] = await Promise.all([
          poolService.getByCreator(profileAddress),
          stakingService.getByUser(profileAddress),
          newsService.getAll(),
          reputationService.getByAddress(profileAddress)
        ]);

        // Filter news created by this user
        const userNews = allNews.filter(n =>
          n.creatorAddress.toLowerCase() === profileAddress.toLowerCase()
        );

        setPools(poolsData);
        setStakes(stakesData);
        setNewsCreated(userNews);
        setReputation(reputationData || null);

        console.log('[ProfilePage] Loaded:', {
          pools: poolsData.length,
          poolsData: poolsData,
          stakes: stakesData.length,
          stakesData: stakesData,
          news: userNews.length,
          newsData: userNews,
          reputation: reputationData,
          address: profileAddress
        });
      } catch (error) {
        console.error('[ProfilePage] Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profileAddress) {
      loadProfileData();
    }
  }, [profileAddress]);

  // Compute stake statistics with pool outcome correlation
  const poolsCreated = pools;
  const stakesHistory = stakes;

  // Create a map of poolId to Pool for quick lookup
  const poolMap = new Map<string, Pool>();
  pools.forEach(pool => {
    poolMap.set(pool.id, pool);
  });

  // Calculate resolved stakes and won stakes with proper pool correlation
  const resolvedStakes = stakes.filter(stake => {
    const pool = poolMap.get(stake.poolId);
    return pool?.status === 'resolved';
  });

  const wonStakes = resolvedStakes.filter(stake => {
    const pool = poolMap.get(stake.poolId);
    if (!pool || pool.status !== 'resolved' || !pool.outcome) return false;

    // User wins if:
    // - User agreed AND pool creator was correct
    // - User disagreed AND pool creator was wrong
    const userWon = (
      (stake.position === 'agree' && pool.outcome === 'creator_correct') ||
      (stake.position === 'disagree' && pool.outcome === 'creator_wrong')
    );

    return userWon;
  });

  // Calculate accurate staking win rate from actual outcomes
  const stakingWinRate = resolvedStakes.length > 0
    ? Math.round((wonStakes.length / resolvedStakes.length) * 100)
    : 0;

  // Calculate Member Since date from first pool or stake
  const memberSince = (() => {
    const dates: Date[] = [];

    // Add pool creation dates
    pools.forEach(pool => {
      if (pool.createdAt) dates.push(new Date(pool.createdAt));
    });

    // Add stake dates
    stakes.forEach(stake => {
      if (stake.createdAt) dates.push(new Date(stake.createdAt));
    });

    // Add news creation dates
    newsCreated.forEach(news => {
      if (news.createdAt) dates.push(new Date(news.createdAt));
    });

    // Find earliest date
    if (dates.length === 0) return null;
    return new Date(Math.min(...dates.map(d => d.getTime())));
  })();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-20 md:pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">
          <Link href="/news" className="hover:text-foreground transition-colors">
            News
          </Link>
          <span>/</span>
          <span className="text-foreground">Profile</span>
        </div>

        {/* Profile Header */}
        <Card className="border border-border bg-gradient-to-br from-primary/5 to-accent/5 mb-6 md:mb-8">
          <CardContent className="p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
              <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
                {/* Avatar */}
                <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-lg md:text-xl lg:text-2xl font-bold shrink-0">
                  {address.slice(2, 4).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1.5 md:mb-2">
                    <h1 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold truncate">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </h1>
                    {reputation && (
                      <Badge variant="secondary" className="text-xs md:text-sm lg:text-base px-2 md:px-3 py-0.5 md:py-1 w-fit">
                        {getTierIcon(reputation.tier)} {reputation.tier}
                      </Badge>
                    )}
                  </div>

                  {reputation && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs md:text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Award className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="font-semibold text-foreground">{reputation.accuracy}%</span> Accuracy
                      </span>
                      {memberSince && (
                        <>
                          <span className="text-muted-foreground hidden sm:inline">•</span>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                            Member since {memberSince.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full md:w-auto">
                <Button variant="outline" size="sm" className="w-full md:w-auto text-xs md:text-sm" asChild>
                  <a
                    href={`https://basescan.org/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>View on Explorer</span>
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {/* News Created */}
          <Card className="border border-border bg-card">
            <CardContent className="p-4 md:p-5 lg:p-6 text-center">
              <FileText className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-xl md:text-2xl font-bold text-foreground mb-1">
                {newsCreated.length}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">News Created</div>
            </CardContent>
          </Card>

          {/* Pools Created */}
          <Card className="border border-border bg-card">
            <CardContent className="p-4 md:p-5 lg:p-6 text-center">
              <Layers className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-primary" />
              <div className="text-xl md:text-2xl font-bold text-primary mb-1">
                {poolsCreated.length}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">Pools Created</div>
              {reputation && reputation.correctPools > 0 && (
                <div className="text-xs text-green-600 mt-1">
                  {reputation.correctPools}W / {reputation.wrongPools}L
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stakes Made */}
          <Card className="border border-border bg-card">
            <CardContent className="p-4 md:p-5 lg:p-6 text-center">
              <DollarSign className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-accent" />
              <div className="text-xl md:text-2xl font-bold text-accent mb-1">
                {stakesHistory.length}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">Stakes Made</div>
              {resolvedStakes.length > 0 && (
                <div className="text-xs text-blue-600 mt-1">
                  {wonStakes.length}W / {resolvedStakes.length - wonStakes.length}L
                </div>
              )}
            </CardContent>
          </Card>

          {/* Win Rate (Staking) */}
          <Card className="border border-border bg-card">
            <CardContent className="p-4 md:p-5 lg:p-6 text-center">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-green-500" />
              <div className="text-xl md:text-2xl font-bold text-foreground mb-1">
                {stakingWinRate}%
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">Win Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="border border-border bg-card mb-4 md:mb-6">
          <CardContent className="p-1.5 md:p-2">
            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-1.5 md:gap-2">
              <button
                onClick={() => setActiveTab('pools')}
                className={`px-3 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  activeTab === 'pools'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                }`}
              >
                <span className="hidden sm:inline">Pools ({poolsCreated.length})</span>
                <span className="sm:hidden">Pools</span>
              </button>
              <button
                onClick={() => setActiveTab('stakes')}
                className={`px-3 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  activeTab === 'stakes'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                }`}
              >
                <span className="hidden sm:inline">Stakes ({stakesHistory.length})</span>
                <span className="sm:hidden">Stakes</span>
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`px-3 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  activeTab === 'news'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                }`}
              >
                <span className="hidden sm:inline">News ({newsCreated.length})</span>
                <span className="sm:hidden">News</span>
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-3 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  activeTab === 'activity'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                }`}
              >
                Activity
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Tab Content */}
        <div>
          {activeTab === 'pools' && (
            <div>
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Pools Created</h2>
              {poolsCreated.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {poolsCreated.map(pool => {
                    const news = newsCreated.find(n => n.id === pool.newsId);
                    return (
                      <Card key={pool.id} className="border border-border bg-card">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <Link href={`/news/${pool.newsId}`} className="hover:underline">
                                <div className="font-semibold text-xs md:text-sm text-muted-foreground mb-1.5 line-clamp-2">
                                  {news?.title || 'Unknown News'}
                                </div>
                              </Link>
                              <div className="flex items-center gap-1.5 md:gap-2 flex-wrap mt-2">
                                <Badge
                                  className={pool.position === 'YES'
                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs'
                                    : 'bg-rose-500/10 text-rose-600 border-rose-500/30 text-xs'
                                  }
                                >
                                  {pool.position}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {pool.status === 'resolved' ? (
                                    pool.outcome === 'creator_correct' ? (
                                      <span className="flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" /> Correct
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1">
                                        <XCircle className="h-3 w-3" /> Wrong
                                      </span>
                                    )
                                  ) : (
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" /> Active
                                    </span>
                                  )}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-sm md:text-base font-semibold">${pool.totalStaked.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">Staked</div>
                            </div>
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-2 md:mb-3">
                            {pool.reasoning}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            Created {pool.createdAt.toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="border border-border bg-card">
                  <CardContent className="p-8 md:p-12 text-center">
                    <Layers className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm md:text-base text-muted-foreground">
                      {isOwnProfile
                        ? "You haven't created any analysis pools yet. Start building your reputation!"
                        : "This user hasn't created any analysis pools yet."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'stakes' && (
            <div>
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Stakes History</h2>
              {stakesHistory.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {stakesHistory.map(stake => {
                    const pool = poolMap.get(stake.poolId);
                    const news = newsCreated.find(n => n.id === pool?.newsId);

                    // Calculate if this stake won/lost based on pool outcome
                    const isResolved = pool?.status === 'resolved';
                    const isWon = isResolved && pool?.outcome ? (
                      (stake.position === 'agree' && pool.outcome === 'creator_correct') ||
                      (stake.position === 'disagree' && pool.outcome === 'creator_wrong')
                    ) : false;

                    return (
                      <Card key={stake.id} className="border border-border bg-card">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <Link href={`/news/${pool?.newsId}`} className="hover:underline">
                                <div className="font-semibold text-xs md:text-sm text-muted-foreground mb-1.5 line-clamp-2">
                                  {news?.title || 'Unknown News'}
                                </div>
                              </Link>
                              <div className="flex items-center gap-1.5 md:gap-2 flex-wrap mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  {stake.position === 'agree' ? (
                                    <span className="flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3" /> Agreed
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1">
                                      <XCircle className="h-3 w-3" /> Disagreed
                                    </span>
                                  )}
                                </Badge>
                                {isResolved && (
                                  <Badge className={isWon ? 'bg-green-500/10 text-green-600 border-green-500/30 text-xs' : 'bg-red-500/10 text-red-600 border-red-500/30 text-xs'}>
                                    {isWon ? (
                                      <span className="flex items-center gap-1">
                                        <Award className="h-3 w-3" /> Won
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1">
                                        <XCircle className="h-3 w-3" /> Lost
                                      </span>
                                    )}
                                  </Badge>
                                )}
                                {!isResolved && (
                                  <Badge variant="secondary" className="text-xs">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" /> Pending
                                    </span>
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-sm md:text-base font-semibold">${stake.amount.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">Staked</div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Staked {stake.createdAt.toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="border border-border bg-card">
                  <CardContent className="p-8 md:p-12 text-center">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm md:text-base text-muted-foreground">
                      {isOwnProfile
                        ? "You haven't staked on any pools yet. Browse news and support analysts!"
                        : "This user hasn't staked on any pools yet."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'news' && (
            <div>
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">News Created</h2>
              {newsCreated.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {newsCreated.map(news => (
                    <Card key={news.id} className="border border-border bg-card">
                      <CardContent className="p-4 md:p-6">
                        <Link href={`/news/${news.id}`}>
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm md:text-base mb-2 hover:text-primary transition-colors line-clamp-2">
                                {news.title}
                              </h3>
                              <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                                <Badge variant="secondary" className="text-xs">{news.category}</Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {news.status === 'resolved' ? (
                                    <span className="flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3" /> Resolved
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" /> Active
                                    </span>
                                  )}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-sm md:text-base font-semibold">{news.totalPools}</div>
                              <div className="text-xs text-muted-foreground">Pools</div>
                            </div>
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-2 md:mb-3">
                            {news.description}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            Created {news.createdAt.toLocaleDateString()} • Resolves {news.endDate.toLocaleDateString()}
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border border-border bg-card">
                  <CardContent className="p-8 md:p-12 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm md:text-base text-muted-foreground">
                      {isOwnProfile
                        ? "You haven't created any news yet. Submit predictions for analysts to analyze!"
                        : "This user hasn't created any news yet."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Recent Activity</h2>
              <Card className="border border-border bg-card">
                <CardContent className="p-8 md:p-12 text-center">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm md:text-base text-muted-foreground">Activity timeline coming soon</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

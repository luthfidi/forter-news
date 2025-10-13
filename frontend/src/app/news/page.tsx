'use client';

import { useState, useEffect } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { News } from '@/types';
import { MOCK_NEWS } from '@/lib/mock-data';
import NewsCard from '@/components/news/NewsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const CATEGORIES = ['All', 'Crypto', 'Macro', 'Tech', 'Sports', 'Politics'];

export default function NewsPage() {
  const { newsList, setNewsList, loading, setLoading } = useGlobalStore();
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'endDate' | 'totalStaked' | 'totalPools'>('totalStaked');

  // Load mock data on component mount
  useEffect(() => {
    setLoading('news', true);
    // Simulate API call
    setTimeout(() => {
      setNewsList(MOCK_NEWS);
      setLoading('news', false);
    }, 1000);
  }, [setNewsList, setLoading]);

  // Filter and sort news
  useEffect(() => {
    let filtered = newsList;

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(news => news.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(news =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'endDate':
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        case 'totalStaked':
          return b.totalStaked - a.totalStaked;
        case 'totalPools':
          return b.totalPools - a.totalPools;
        default:
          return 0;
      }
    });

    setFilteredNews(filtered);
  }, [newsList, selectedCategory, searchQuery, sortBy]);

  const activeNews = filteredNews.filter(n => n.status === 'active');
  const totalStaked = activeNews.reduce((sum, news) => sum + news.totalStaked, 0);
  const totalPools = activeNews.reduce((sum, news) => sum + news.totalPools, 0);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent"></div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                News Explorer
              </h1>
            </div>
            <Link href="/news/create">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/25">
                + Create NEWS
              </Button>
            </Link>
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Discover active predictions. Create pools with your analysis or stake on existing pools to back credible reasoning.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {activeNews.length}
              </div>
              <div className="text-sm text-muted-foreground">Active News</div>
            </CardContent>
          </Card>
          <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-accent mb-1">
                {totalPools}
              </div>
              <div className="text-sm text-muted-foreground">Total Pools</div>
            </CardContent>
          </Card>
          <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-foreground mb-1">
                ${totalStaked.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Staked</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border border-border/50 bg-background/80 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <Input
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'endDate' | 'totalStaked' | 'totalPools')}
                className="px-4 py-2 rounded-md border border-border/50 bg-background/50 text-sm"
              >
                <option value="totalStaked">Most Staked</option>
                <option value="totalPools">Most Pools</option>
                <option value="endDate">Ending Soon</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mt-4">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-background/50 text-muted-foreground hover:bg-accent/10 hover:text-foreground'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Active Filters Display */}
            {(searchQuery || selectedCategory !== 'All') && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Active filters:</span>
                {selectedCategory !== 'All' && (
                  <span className="px-2 py-1 rounded bg-primary/10 text-primary">
                    {selectedCategory}
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2 py-1 rounded bg-accent/10 text-accent">
                    Search: &quot;{searchQuery}&quot;
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="text-muted-foreground hover:text-foreground ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* News Grid */}
        {loading.news ? (
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
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {filteredNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        ) : (
          <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No news found</h3>
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
        {filteredNews.length > 0 && (
          <div className="mt-12 text-center">
            <Card className="border border-border/50 bg-background/90 backdrop-blur-sm max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Ready to Share Your Prediction?</h3>
                <p className="text-muted-foreground mb-6">
                  Create a NEWS prediction or build a POOL with your analysis to stake on credibility and build on-chain reputation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/news/create">
                    <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90">
                      Create NEWS
                    </Button>
                  </Link>
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

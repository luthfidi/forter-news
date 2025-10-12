'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface MarketFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'endDate' | 'totalStaked' | 'analysisCount';
  onSortChange: (sort: 'endDate' | 'totalStaked' | 'analysisCount') => void;
}

export default function MarketFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange
}: MarketFiltersProps) {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'all':
        return '🌐';
      case 'crypto':
        return '₿';
      case 'macro':
        return '📈';
      case 'tech':
        return '💻';
      case 'sports':
        return '⚽';
      case 'politics':
        return '🏛️';
      default:
        return '❓';
    }
  };

  const getSortLabel = (sort: string) => {
    switch (sort) {
      case 'endDate':
        return 'Ending Soon';
      case 'totalStaked':
        return 'Highest Staked';
      case 'analysisCount':
        return 'Most Analyzed';
      default:
        return 'Sort By';
    }
  };

  return (
    <Card className="border border-border/50 bg-background/80 backdrop-blur-sm mb-8">
      <CardContent className="p-6">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                placeholder="Search markets by title or description..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-background/50 border-border/50"
              />
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className="md:hidden border-border/50"
          >
            Filters {isFiltersExpanded ? '▲' : '▼'}
          </Button>
        </div>

        {/* Filters */}
        <div className={`${isFiltersExpanded ? 'block' : 'hidden'} md:block`}>
          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'border-border/50 hover:bg-accent/10'
                  }`}
                  onClick={() => onCategoryChange(category)}
                >
                  <span className="mr-1">{getCategoryIcon(category)}</span>
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 sm:mb-0">Sort By</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['totalStaked', 'analysisCount', 'endDate'] as const).map((sort) => (
                <Button
                  key={sort}
                  variant={sortBy === sort ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSortChange(sort)}
                  className={`transition-all duration-200 hover:scale-105 ${
                    sortBy === sort
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'border-border/50 hover:bg-accent/10'
                  }`}
                >
                  {getSortLabel(sort)}
                  {sortBy === sort && (
                    <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {(selectedCategory !== 'All' || searchQuery) && (
            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedCategory !== 'All' && (
                  <Badge variant="secondary" className="bg-accent/10 text-accent">
                    {getCategoryIcon(selectedCategory)} {selectedCategory}
                    <button
                      onClick={() => onCategoryChange('All')}
                      className="ml-1 hover:text-foreground transition-colors"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="bg-accent/10 text-accent">
                    Search: &quot;{searchQuery}&quot;
                    <button
                      onClick={() => onSearchChange('')}
                      className="ml-1 hover:text-foreground transition-colors"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onCategoryChange('All');
                    onSearchChange('');
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
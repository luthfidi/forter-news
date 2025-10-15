'use client';

import { News } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface NewsCardProps {
  news: News;
}

// Simple date formatter
function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'ended';
  } else if (diffDays === 0) {
    return 'today';
  } else if (diffDays === 1) {
    return 'in 1 day';
  } else if (diffDays < 30) {
    return `in ${diffDays} days`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `in ${months} month${months > 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `in ${years} year${years > 1 ? 's' : ''}`;
  }
}

export default function NewsCard({ news }: NewsCardProps) {
  const timeRemaining = formatDistanceToNow(news.endDate);
  const isEndingSoon = new Date(news.endDate).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // 7 days

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'crypto':
        return 'from-orange-500 to-yellow-500';
      case 'macro':
        return 'from-blue-500 to-cyan-500';
      case 'tech':
        return 'from-purple-500 to-pink-500';
      case 'sports':
        return 'from-green-500 to-emerald-500';
      case 'politics':
        return 'from-red-500 to-rose-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
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

  return (
    <Link href={`/news/${news.id}`} className="block">
      <Card className="group border border-border/50 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:scale-[1.02] cursor-pointer h-full flex flex-col">
        <CardContent className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${getCategoryColor(news.category)} flex items-center justify-center shadow-md`}>
              <span className="text-white text-sm">{getCategoryIcon(news.category)}</span>
            </div>
            <Badge variant="secondary" className="bg-background/50">
              {news.category}
            </Badge>
          </div>
          <div className="flex gap-2">
            {news.status === 'resolved' && news.outcome && (
              <Badge className={`${
                news.outcome === 'YES'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}>
                {news.outcome === 'YES' ? '✅' : '❌'} {news.outcome}
              </Badge>
            )}
            {isEndingSoon && news.status === 'active' && (
              <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-500/20">
                Ending Soon
              </Badge>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
          {news.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {news.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 rounded-lg bg-background/50 border border-border/30">
            <div className="text-lg font-bold text-primary">
              {news.totalPools}
            </div>
            <div className="text-xs text-muted-foreground">Pools</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50 border border-border/30">
            <div className="text-lg font-bold text-accent">
              ${news.totalStaked.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Staked</div>
          </div>
        </div>

        {/* Resolution Criteria */}
        <div className="mb-4 p-3 rounded-lg bg-accent/5 border border-accent/10">
          <div className="text-xs font-medium text-accent mb-1">Resolution Criteria:</div>
          <div className="text-xs text-muted-foreground line-clamp-2">
            {news.resolutionCriteria}
          </div>
        </div>

        {/* Time remaining */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
            <span>{timeRemaining === 'ended' ? 'Ended' : `Ends ${timeRemaining}`}</span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            news.status === 'active'
              ? 'bg-green-500/10 text-green-600'
              : news.status === 'resolved'
              ? 'bg-blue-500/10 text-blue-600'
              : 'bg-gray-500/10 text-gray-600'
          }`}>
            {news.status.charAt(0).toUpperCase() + news.status.slice(1)}
          </div>
        </div>

        </CardContent>
      </Card>
    </Link>
  );
}

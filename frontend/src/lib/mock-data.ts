import { News, Pool, PoolStake } from '@/types';

// ============================================
// MOCK NEWS DATA
// ============================================

export const MOCK_NEWS: News[] = [
  {
    id: '1',
    title: 'ETH will reach $5000 before December 2024',
    description: 'Predicting Ethereum price movement considering ETF approval prospects, institutional adoption trends, and DeFi ecosystem growth. Key factors include spot ETF decisions, Layer 2 scaling improvements, and macroeconomic conditions.',
    category: 'Crypto',
    endDate: new Date('2024-12-31'),
    resolutionCriteria: 'ETH price >= $5000 on CoinGecko at Dec 31, 2024 23:59 UTC',
    creatorAddress: '0xabc...123',
    createdAt: new Date('2024-10-01'),
    status: 'active',
    totalPools: 3,
    totalStaked: 5200
  },
  {
    id: '2',
    title: 'BTC will hit $100,000 before March 2025',
    description: 'Bitcoin price prediction considering halving cycle effects, spot ETF inflows, institutional adoption, and macroeconomic factors including Fed policy and global liquidity conditions.',
    category: 'Crypto',
    endDate: new Date('2025-03-31'),
    resolutionCriteria: 'BTC price >= $100,000 on CoinGecko',
    creatorAddress: '0xdef...456',
    createdAt: new Date('2024-10-05'),
    status: 'active',
    totalPools: 5,
    totalStaked: 12500
  },
  {
    id: '3',
    title: 'Federal Reserve will cut interest rates in Q1 2025',
    description: 'Analyzing Federal Reserve monetary policy trajectory based on inflation data, employment figures, and economic growth indicators to predict rate cut timing.',
    category: 'Macro',
    endDate: new Date('2025-03-31'),
    resolutionCriteria: 'Fed Fund Rate reduced by at least 0.25% in Q1 2025',
    creatorAddress: '0x789...abc',
    createdAt: new Date('2024-10-08'),
    status: 'active',
    totalPools: 4,
    totalStaked: 8900
  },
  {
    id: '4',
    title: 'OpenAI will release GPT-5 before June 2025',
    description: 'Tracking OpenAI development timelines, computational requirements, and public statements to predict GPT-5 release timing. Considering training costs, regulatory approvals, and competitive landscape.',
    category: 'Tech',
    endDate: new Date('2025-06-01'),
    resolutionCriteria: 'Official GPT-5 model released and publicly accessible',
    creatorAddress: '0x321...def',
    createdAt: new Date('2024-10-10'),
    status: 'active',
    totalPools: 6,
    totalStaked: 15000
  },
  {
    id: '5',
    title: 'Ethereum ETF will reach $1B+ inflows within 3 months',
    description: 'Analyzing institutional investment patterns and ETF adoption rates for Ethereum-based financial products following spot ETF approvals.',
    category: 'Crypto',
    endDate: new Date('2025-01-15'),
    resolutionCriteria: 'Total net inflows to Ethereum spot ETFs >= $1 billion',
    creatorAddress: '0x654...987',
    createdAt: new Date('2024-10-12'),
    status: 'active',
    totalPools: 2,
    totalStaked: 4500
  },
  {
    id: '6',
    title: 'US unemployment rate will exceed 5% in 2025',
    description: 'Economic analysis of labor market trends, recession indicators, and employment data to predict unemployment trajectory in response to Fed policy and economic conditions.',
    category: 'Macro',
    endDate: new Date('2025-12-31'),
    resolutionCriteria: 'US unemployment rate >= 5.0% in any month of 2025',
    creatorAddress: '0x111...222',
    createdAt: new Date('2024-10-14'),
    status: 'active',
    totalPools: 3,
    totalStaked: 7200
  }
];

// ============================================
// MOCK POOLS DATA
// ============================================

export const MOCK_POOLS: Pool[] = [
  // Pools for NEWS 1: "ETH will reach $5000"
  {
    id: 'pool-1',
    newsId: '1',
    creatorAddress: '0x1234...5678',
    position: 'YES',
    reasoning: 'ETF approval will drive massive institutional inflows. Historical data shows that after Bitcoin ETF approval, price surged 40% within 3 months. Ethereum has stronger fundamentals with its DeFi ecosystem and staking yields. Technical analysis shows bull flag pattern with strong support at $3500.',
    evidence: [
      'https://example.com/etf-approval-data',
      'https://example.com/institutional-flows',
      'https://example.com/eth-technical-analysis'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    imageCaption: 'ETH Bull Flag Pattern with Strong Support',
    creatorStake: 100,
    agreeStakes: 900,
    disagreeStakes: 200,
    totalStaked: 1200,
    status: 'active',
    outcome: null,
    createdAt: new Date('2024-10-02'),
    farcasterCastHash: 'cast-eth-yes-1'
  },
  {
    id: 'pool-2',
    newsId: '1',
    creatorAddress: '0xabcd...efgh',
    position: 'NO',
    reasoning: 'Regulation remains very unclear in many jurisdictions. SEC is still aggressive towards crypto projects. Macro conditions with high interest rates reduce risk appetite. Historical resistance at $4800 is very strong with 3x rejections already. Market remains bearish with low volume.',
    evidence: [
      'https://example.com/regulatory-concerns',
      'https://example.com/macro-headwinds',
      'https://example.com/technical-resistance'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800',
    imageCaption: 'ETH Technical Resistance Levels',
    creatorStake: 50,
    agreeStakes: 500,
    disagreeStakes: 800,
    totalStaked: 1350,
    status: 'active',
    outcome: null,
    createdAt: new Date('2024-10-03')
  },
  {
    id: 'pool-3',
    newsId: '1',
    creatorAddress: '0x9999...1111',
    position: 'YES',
    reasoning: 'Layer 2 scaling solutions like Arbitrum and Optimism have significantly reduced gas fees. This is driving rapid DeFi adoption growth. Real World Assets (RWA) tokenization trend will drive institutional demand. Ethereum merge is proven and staking yields are attractive for institutions.',
    evidence: [
      'https://example.com/l2-adoption',
      'https://example.com/rwa-tokenization'
    ],
    creatorStake: 150,
    agreeStakes: 1200,
    disagreeStakes: 300,
    totalStaked: 1650,
    status: 'active',
    outcome: null,
    createdAt: new Date('2024-10-04')
  },

  // Pools for NEWS 2: "BTC will hit $100k"
  {
    id: 'pool-4',
    newsId: '2',
    creatorAddress: '0x2222...3333',
    position: 'YES',
    reasoning: 'Halving cycle historically bullish. Spot ETF inflows breaking records - already $50B+ in 6 months. MicroStrategy and institutional buyers continue to accumulate. Stock-to-flow model predicts $100k+ post-halving. On-chain metrics show strong accumulation by whales.',
    evidence: [
      'https://example.com/halving-cycle-data',
      'https://example.com/etf-inflows-record',
      'https://example.com/on-chain-accumulation'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800',
    imageCaption: 'BTC Halving Cycle Analysis',
    creatorStake: 200,
    agreeStakes: 2000,
    disagreeStakes: 500,
    totalStaked: 2700,
    status: 'active',
    outcome: null,
    createdAt: new Date('2024-10-06'),
    farcasterCastHash: 'cast-btc-yes-1'
  },
  {
    id: 'pool-5',
    newsId: '2',
    creatorAddress: '0x4444...5555',
    position: 'NO',
    reasoning: 'Macro environment still challenging. Fed has not pivoted yet, interest rates remain high. Global liquidity conditions are tight. China economic slowdown impacts risk assets. Historical post-halving rallies take 12-18 months, March 2025 is too early. Technical indicators show overbought on weekly timeframe.',
    evidence: [
      'https://example.com/fed-policy-outlook',
      'https://example.com/global-liquidity'
    ],
    creatorStake: 100,
    agreeStakes: 800,
    disagreeStakes: 1500,
    totalStaked: 2400,
    status: 'active',
    outcome: null,
    createdAt: new Date('2024-10-07')
  },

  // Pools for NEWS 3: "Fed rate cut Q1 2025"
  {
    id: 'pool-6',
    newsId: '3',
    creatorAddress: '0x6666...7777',
    position: 'YES',
    reasoning: 'Inflation data trending down towards 2% target. Employment data showing weakness - unemployment creeping up. Powell has signaled "higher for longer" is ending. Market pricing in 75% chance of Q1 cut. Historical precedent: Fed cuts when they see economic softening.',
    evidence: [
      'https://example.com/inflation-trends',
      'https://example.com/employment-weakness',
      'https://example.com/fed-signals'
    ],
    creatorStake: 75,
    agreeStakes: 600,
    disagreeStakes: 400,
    totalStaked: 1075,
    status: 'active',
    outcome: null,
    createdAt: new Date('2024-10-09')
  },
  {
    id: 'pool-7',
    newsId: '3',
    creatorAddress: '0x8888...9999',
    position: 'NO',
    reasoning: 'Core inflation remains sticky above 3%. Labor market remains resilient. Fed does not want to cut too early and risk inflation resurgence. Political pressure pre-election makes them cautious. CME Fed Watch still shows uncertainty. Q2 2025 more likely for first cut.',
    evidence: [
      'https://example.com/core-inflation-data',
      'https://example.com/labor-market-strength'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    imageCaption: 'Fed Rate Decision Analysis',
    creatorStake: 80,
    agreeStakes: 700,
    disagreeStakes: 600,
    totalStaked: 1380,
    status: 'active',
    outcome: null,
    createdAt: new Date('2024-10-10')
  },

  // Pools for NEWS 4: "GPT-5 before June 2025"
  {
    id: 'pool-8',
    newsId: '4',
    creatorAddress: '0xaaaa...bbbb',
    position: 'YES',
    reasoning: 'Sam Altman hints at "amazing models" coming soon. OpenAI just raised $6.6B for compute infrastructure. Competition from Google Gemini and Anthropic Claude pushing faster iteration. Training timeline suggests Q1-Q2 2025 window. Regulatory approvals mostly in place.',
    evidence: [
      'https://example.com/sam-altman-hints',
      'https://example.com/openai-funding',
      'https://example.com/training-timeline'
    ],
    creatorStake: 150,
    agreeStakes: 1800,
    disagreeStakes: 700,
    totalStaked: 2650,
    status: 'active',
    outcome: null,
    createdAt: new Date('2024-10-11'),
    farcasterCastHash: 'cast-gpt5-yes-1'
  },
  {
    id: 'pool-9',
    newsId: '4',
    creatorAddress: '0xcccc...dddd',
    position: 'NO',
    reasoning: 'Training GPT-5 requires massive compute - 12-18 months minimum. Safety testing and alignment work takes additional months. Regulatory scrutiny increasing globally. OpenAI historically delays releases - GPT-4 took longer than expected. June 2025 too aggressive, late 2025 more realistic.',
    evidence: [
      'https://example.com/training-requirements',
      'https://example.com/safety-protocols'
    ],
    creatorStake: 120,
    agreeStakes: 1000,
    disagreeStakes: 1500,
    totalStaked: 2620,
    status: 'active',
    outcome: null,
    createdAt: new Date('2024-10-12')
  }
];

// ============================================
// MOCK POOL STAKES DATA
// ============================================

export const MOCK_POOL_STAKES: PoolStake[] = [
  // Stakes on pool-1 (ETH YES)
  {
    id: 'stake-1',
    poolId: 'pool-1',
    userAddress: '0xuser1...111',
    position: 'agree',
    amount: 300,
    createdAt: new Date('2024-10-02')
  },
  {
    id: 'stake-2',
    poolId: 'pool-1',
    userAddress: '0xuser2...222',
    position: 'agree',
    amount: 200,
    createdAt: new Date('2024-10-03')
  },
  {
    id: 'stake-3',
    poolId: 'pool-1',
    userAddress: '0xuser3...333',
    position: 'disagree',
    amount: 100,
    createdAt: new Date('2024-10-03')
  },

  // Stakes on pool-4 (BTC YES)
  {
    id: 'stake-4',
    poolId: 'pool-4',
    userAddress: '0xuser4...444',
    position: 'agree',
    amount: 500,
    createdAt: new Date('2024-10-07')
  },
  {
    id: 'stake-5',
    poolId: 'pool-4',
    userAddress: '0xuser5...555',
    position: 'agree',
    amount: 400,
    createdAt: new Date('2024-10-08')
  },
  {
    id: 'stake-6',
    poolId: 'pool-4',
    userAddress: '0xuser6...666',
    position: 'disagree',
    amount: 250,
    createdAt: new Date('2024-10-09')
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getNewsByCategory(category: string): News[] {
  if (category === 'All') return MOCK_NEWS;
  return MOCK_NEWS.filter(news => news.category === category);
}

export function getNewsById(id: string): News | undefined {
  return MOCK_NEWS.find(news => news.id === id);
}

export function getPoolsByNewsId(newsId: string): Pool[] {
  return MOCK_POOLS.filter(pool => pool.newsId === newsId);
}

export function getPoolById(id: string): Pool | undefined {
  return MOCK_POOLS.find(pool => pool.id === id);
}

export function getPoolStakesByPoolId(poolId: string): PoolStake[] {
  return MOCK_POOL_STAKES.filter(stake => stake.poolId === poolId);
}

export function getNewsCategories(): string[] {
  return ['All', ...Array.from(new Set(MOCK_NEWS.map(news => news.category)))];
}

// Calculate pool stats
export function getPoolStats(pool: Pool) {
  const agreePercentage = pool.totalStaked > 0
    ? (pool.agreeStakes / pool.totalStaked) * 100
    : 0;
  const disagreePercentage = pool.totalStaked > 0
    ? (pool.disagreeStakes / pool.totalStaked) * 100
    : 0;

  return {
    agreePercentage,
    disagreePercentage,
    totalStakers: getPoolStakesByPoolId(pool.id).length,
    agreeStakers: getPoolStakesByPoolId(pool.id).filter(s => s.position === 'agree').length,
    disagreeStakers: getPoolStakesByPoolId(pool.id).filter(s => s.position === 'disagree').length
  };
}

// Calculate news stats
export function getNewsStats(newsId: string) {
  const pools = getPoolsByNewsId(newsId);
  const yesPools = pools.filter(p => p.position === 'YES').length;
  const noPools = pools.filter(p => p.position === 'NO').length;
  const totalStaked = pools.reduce((sum, p) => sum + p.totalStaked, 0);

  return {
    totalPools: pools.length,
    yesPools,
    noPools,
    totalStaked
  };
}

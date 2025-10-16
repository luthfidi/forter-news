import { News, Pool, PoolStake, ReputationData } from '@/types';

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
  },

  // ============================================
  // RESOLVED NEWS (for testing)
  // ============================================
  {
    id: '7',
    title: 'SOL will reach $200 before November 2024',
    description: 'Solana price prediction based on network activity, memecoin trends, and institutional interest. Considering FTX liquidation impacts and overall market sentiment.',
    category: 'Crypto',
    endDate: new Date('2024-11-01'),
    resolutionCriteria: 'SOL price >= $200 on CoinGecko',
    creatorAddress: '0xabc...123',
    createdAt: new Date('2024-09-15'),
    status: 'resolved',
    totalPools: 3,
    totalStaked: 4800,
    outcome: 'YES',
    resolvedAt: new Date('2024-11-01'),
    resolvedBy: '0x580B01f8CDf7606723c3BE0dD2AaD058F5aECa3d',
    resolutionSource: 'https://www.coingecko.com/en/coins/solana',
    resolutionNotes: 'SOL reached $205 on Nov 1, 2024'
  },
  {
    id: '8',
    title: 'Apple will launch AI assistant before October 2024',
    description: 'Tracking Apple\'s AI development and WWDC announcements to predict launch timing of comprehensive AI assistant features in iOS.',
    category: 'Tech',
    endDate: new Date('2024-10-31'),
    resolutionCriteria: 'Apple Intelligence features publicly available',
    creatorAddress: '0xdef...456',
    createdAt: new Date('2024-08-01'),
    status: 'resolved',
    totalPools: 2,
    totalStaked: 3200,
    outcome: 'NO',
    resolvedAt: new Date('2024-10-31'),
    resolvedBy: '0x580B01f8CDf7606723c3BE0dD2AaD058F5aECa3d',
    resolutionSource: 'https://www.apple.com/apple-intelligence/',
    resolutionNotes: 'Apple Intelligence delayed to iOS 18.1 in late October, not fully available before deadline'
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
  },

  // ============================================
  // RESOLVED POOLS (for News 7: SOL $200 - Outcome: YES)
  // ============================================
  {
    id: 'pool-10',
    newsId: '7',
    creatorAddress: '0x1234...5678',
    position: 'YES',
    reasoning: 'Solana ecosystem growth is explosive. Memecoin mania driving massive trading volume. Jito airdrop and Jupiter launch creating positive sentiment. Network uptime stable. Major DeFi protocols migrating to Solana.',
    evidence: [
      'https://example.com/solana-activity',
      'https://example.com/dex-volume'
    ],
    creatorStake: 150,
    agreeStakes: 1200,
    disagreeStakes: 400,
    totalStaked: 1750,
    status: 'resolved',
    outcome: 'creator_correct',
    createdAt: new Date('2024-09-16')
  },
  {
    id: 'pool-11',
    newsId: '7',
    creatorAddress: '0xabcd...efgh',
    position: 'NO',
    reasoning: 'FTX overhang still present. Technical resistance at $180. Memecoin hype unsustainable. Network still has occasional congestion issues.',
    evidence: [
      'https://example.com/ftx-liquidations'
    ],
    creatorStake: 100,
    agreeStakes: 800,
    disagreeStakes: 900,
    totalStaked: 1800,
    status: 'resolved',
    outcome: 'creator_wrong',
    createdAt: new Date('2024-09-17')
  },
  {
    id: 'pool-12',
    newsId: '7',
    creatorAddress: '0x9999...1111',
    position: 'YES',
    reasoning: 'On-chain metrics bullish. Whale accumulation visible. Technical breakout from $150 confirmed. Momentum strong with Jupiter airdrop catalyst.',
    evidence: [
      'https://example.com/sol-on-chain'
    ],
    creatorStake: 120,
    agreeStakes: 900,
    disagreeStakes: 230,
    totalStaked: 1250,
    status: 'resolved',
    outcome: 'creator_correct',
    createdAt: new Date('2024-09-18')
  },

  // ============================================
  // RESOLVED POOLS (for News 8: Apple AI - Outcome: NO)
  // ============================================
  {
    id: 'pool-13',
    newsId: '8',
    creatorAddress: '0x2222...3333',
    position: 'YES',
    reasoning: 'WWDC announcements promising. Beta features already available. Apple typically ships on time. Competitive pressure from Google and Microsoft.',
    evidence: [
      'https://example.com/apple-wwdc'
    ],
    creatorStake: 100,
    agreeStakes: 700,
    disagreeStakes: 900,
    totalStaked: 1700,
    status: 'resolved',
    outcome: 'creator_wrong',
    createdAt: new Date('2024-08-05')
  },
  {
    id: 'pool-14',
    newsId: '8',
    creatorAddress: '0x4444...5555',
    position: 'NO',
    reasoning: 'Apple historically conservative with AI rollout. Privacy concerns require extensive testing. Beta feedback showing delays. October too optimistic.',
    evidence: [
      'https://example.com/apple-delays'
    ],
    creatorStake: 80,
    agreeStakes: 600,
    disagreeStakes: 920,
    totalStaked: 1500,
    status: 'resolved',
    outcome: 'creator_correct',
    createdAt: new Date('2024-08-06')
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
  },

  // More stakes for resolved pools (News 7: SOL - Outcome YES)
  {
    id: 'stake-7',
    poolId: 'pool-10',
    userAddress: '0xuser1...111',
    position: 'agree',
    amount: 400,
    createdAt: new Date('2024-09-20')
  },
  {
    id: 'stake-8',
    poolId: 'pool-10',
    userAddress: '0xuser2...222',
    position: 'agree',
    amount: 300,
    createdAt: new Date('2024-09-21')
  },
  {
    id: 'stake-9',
    poolId: 'pool-11',
    userAddress: '0xuser3...333',
    position: 'disagree',
    amount: 350,
    createdAt: new Date('2024-09-22')
  },
  {
    id: 'stake-10',
    poolId: 'pool-11',
    userAddress: '0xuser4...444',
    position: 'disagree',
    amount: 250,
    createdAt: new Date('2024-09-23')
  },
  {
    id: 'stake-11',
    poolId: 'pool-12',
    userAddress: '0xuser1...111',
    position: 'agree',
    amount: 200,
    createdAt: new Date('2024-09-24')
  },

  // Stakes for resolved pools (News 8: Apple AI - Outcome NO)
  {
    id: 'stake-12',
    poolId: 'pool-13',
    userAddress: '0xuser2...222',
    position: 'disagree',
    amount: 300,
    createdAt: new Date('2024-08-10')
  },
  {
    id: 'stake-13',
    poolId: 'pool-14',
    userAddress: '0xuser3...333',
    position: 'agree',
    amount: 250,
    createdAt: new Date('2024-08-11')
  },
  {
    id: 'stake-14',
    poolId: 'pool-14',
    userAddress: '0xuser4...444',
    position: 'agree',
    amount: 150,
    createdAt: new Date('2024-08-12')
  },

  // More stakes on active pools for testing
  {
    id: 'stake-15',
    poolId: 'pool-2',
    userAddress: '0xuser1...111',
    position: 'agree',
    amount: 180,
    createdAt: new Date('2024-10-10')
  },
  {
    id: 'stake-16',
    poolId: 'pool-3',
    userAddress: '0xuser2...222',
    position: 'disagree',
    amount: 120,
    createdAt: new Date('2024-10-11')
  },
  {
    id: 'stake-17',
    poolId: 'pool-5',
    userAddress: '0xuser3...333',
    position: 'agree',
    amount: 280,
    createdAt: new Date('2024-10-12')
  },
  {
    id: 'stake-18',
    poolId: 'pool-6',
    userAddress: '0xuser4...444',
    position: 'agree',
    amount: 200,
    createdAt: new Date('2024-10-13')
  },

  // ============================================
  // STAKER-ONLY USER: 0xstaker...001 (Type B: No pools, only stakes)
  // ============================================
  {
    id: 'stake-19',
    poolId: 'pool-1',
    userAddress: '0xstaker...001',
    position: 'agree',
    amount: 250,
    createdAt: new Date('2024-10-02')
  },
  {
    id: 'stake-20',
    poolId: 'pool-4',
    userAddress: '0xstaker...001',
    position: 'agree',
    amount: 400,
    createdAt: new Date('2024-10-07')
  },
  {
    id: 'stake-21',
    poolId: 'pool-6',
    userAddress: '0xstaker...001',
    position: 'disagree',
    amount: 150,
    createdAt: new Date('2024-10-10')
  },
  {
    id: 'stake-22',
    poolId: 'pool-8',
    userAddress: '0xstaker...001',
    position: 'agree',
    amount: 300,
    createdAt: new Date('2024-10-12')
  },
  {
    id: 'stake-23',
    poolId: 'pool-10',
    userAddress: '0xstaker...001',
    position: 'agree',
    amount: 500,
    createdAt: new Date('2024-09-20')
  },
  {
    id: 'stake-24',
    poolId: 'pool-13',
    userAddress: '0xstaker...001',
    position: 'disagree',
    amount: 350,
    createdAt: new Date('2024-08-08')
  },

  // ============================================
  // ADMIN WALLET STAKES (showing admin also participates)
  // ============================================
  {
    id: 'stake-25',
    poolId: 'pool-1',
    userAddress: '0x580B01f8CDf7606723c3BE0dD2AaD058F5aECa3d',
    position: 'agree',
    amount: 150,
    createdAt: new Date('2024-10-03')
  },
  {
    id: 'stake-26',
    poolId: 'pool-4',
    userAddress: '0x580B01f8CDf7606723c3BE0dD2AaD058F5aECa3d',
    position: 'disagree',
    amount: 200,
    createdAt: new Date('2024-10-08')
  },
  {
    id: 'stake-27',
    poolId: 'pool-10',
    userAddress: '0x580B01f8CDf7606723c3BE0dD2AaD058F5aECa3d',
    position: 'agree',
    amount: 300,
    createdAt: new Date('2024-09-21')
  },

  // ============================================
  // MORE STAKER-ONLY USER: 0xstaker...002
  // ============================================
  {
    id: 'stake-28',
    poolId: 'pool-2',
    userAddress: '0xstaker...002',
    position: 'disagree',
    amount: 200,
    createdAt: new Date('2024-10-04')
  },
  {
    id: 'stake-29',
    poolId: 'pool-5',
    userAddress: '0xstaker...002',
    position: 'agree',
    amount: 180,
    createdAt: new Date('2024-10-08')
  },
  {
    id: 'stake-30',
    poolId: 'pool-7',
    userAddress: '0xstaker...002',
    position: 'disagree',
    amount: 120,
    createdAt: new Date('2024-10-11')
  },
  {
    id: 'stake-31',
    poolId: 'pool-14',
    userAddress: '0xstaker...002',
    position: 'agree',
    amount: 220,
    createdAt: new Date('2024-08-09')
  }
];

// ============================================
// MOCK REPUTATION DATA (calculated from pool creation only)
// ============================================

export const MOCK_REPUTATION: Record<string, ReputationData> = {
  '0x1234...5678': {
    address: '0x1234...5678',
    accuracy: 87,
    totalPools: 3,
    correctPools: 2,         // pool-1 (active), pool-10 (correct)
    wrongPools: 0,
    activePools: 1,
    tier: 'Master',
    nftTokenId: 1,
    categoryStats: {
      'Crypto': { total: 3, correct: 2, accuracy: 66.67 }
    },
    currentStreak: 1,
    bestStreak: 2,
    specialty: 'Crypto',
    memberSince: new Date('2024-09-15')
  },
  '0xabcd...efgh': {
    address: '0xabcd...efgh',
    accuracy: 50,
    totalPools: 2,
    correctPools: 0,
    wrongPools: 1,           // pool-11 (wrong)
    activePools: 1,          // pool-2 (active)
    tier: 'Analyst',
    nftTokenId: 2,
    categoryStats: {
      'Crypto': { total: 2, correct: 0, accuracy: 0 }
    },
    currentStreak: 0,
    bestStreak: 0,
    specialty: 'Crypto',
    memberSince: new Date('2024-09-17')
  },
  '0x9999...1111': {
    address: '0x9999...1111',
    accuracy: 100,
    totalPools: 2,
    correctPools: 1,         // pool-12 (correct)
    wrongPools: 0,
    activePools: 1,          // pool-3 (active)
    tier: 'Legend',
    nftTokenId: 3,
    categoryStats: {
      'Crypto': { total: 2, correct: 1, accuracy: 50 }
    },
    currentStreak: 1,
    bestStreak: 1,
    specialty: 'Crypto',
    memberSince: new Date('2024-09-18')
  },
  '0x2222...3333': {
    address: '0x2222...3333',
    accuracy: 50,
    totalPools: 2,
    correctPools: 0,
    wrongPools: 1,           // pool-13 (wrong)
    activePools: 1,          // pool-4 (active)
    tier: 'Analyst',
    nftTokenId: 4,
    categoryStats: {
      'Crypto': { total: 1, correct: 0, accuracy: 0 },
      'Tech': { total: 1, correct: 0, accuracy: 0 }
    },
    currentStreak: 0,
    bestStreak: 0,
    specialty: 'Crypto',
    memberSince: new Date('2024-08-05')
  },
  '0x4444...5555': {
    address: '0x4444...5555',
    accuracy: 100,
    totalPools: 2,
    correctPools: 1,         // pool-14 (correct)
    wrongPools: 0,
    activePools: 1,          // pool-5 (active)
    tier: 'Legend',
    nftTokenId: 5,
    categoryStats: {
      'Crypto': { total: 1, correct: 0, accuracy: 0 },
      'Tech': { total: 1, correct: 1, accuracy: 100 }
    },
    currentStreak: 1,
    bestStreak: 1,
    specialty: 'Tech',
    memberSince: new Date('2024-08-06')
  },
  '0x6666...7777': {
    address: '0x6666...7777',
    accuracy: 0,
    totalPools: 1,
    correctPools: 0,
    wrongPools: 0,
    activePools: 1,          // pool-6 (active)
    tier: 'Novice',
    nftTokenId: 6,
    categoryStats: {
      'Macro': { total: 1, correct: 0, accuracy: 0 }
    },
    currentStreak: 0,
    bestStreak: 0,
    specialty: 'Macro',
    memberSince: new Date('2024-10-09')
  },
  '0x8888...9999': {
    address: '0x8888...9999',
    accuracy: 0,
    totalPools: 1,
    correctPools: 0,
    wrongPools: 0,
    activePools: 1,          // pool-7 (active)
    tier: 'Novice',
    nftTokenId: 7,
    categoryStats: {
      'Macro': { total: 1, correct: 0, accuracy: 0 }
    },
    currentStreak: 0,
    bestStreak: 0,
    specialty: 'Macro',
    memberSince: new Date('2024-10-10')
  },
  '0xaaaa...bbbb': {
    address: '0xaaaa...bbbb',
    accuracy: 0,
    totalPools: 1,
    correctPools: 0,
    wrongPools: 0,
    activePools: 1,          // pool-8 (active)
    tier: 'Novice',
    nftTokenId: 8,
    categoryStats: {
      'Tech': { total: 1, correct: 0, accuracy: 0 }
    },
    currentStreak: 0,
    bestStreak: 0,
    specialty: 'Tech',
    memberSince: new Date('2024-10-11')
  },
  '0xcccc...dddd': {
    address: '0xcccc...dddd',
    accuracy: 0,
    totalPools: 1,
    correctPools: 0,
    wrongPools: 0,
    activePools: 1,          // pool-9 (active)
    tier: 'Novice',
    nftTokenId: 9,
    categoryStats: {
      'Tech': { total: 1, correct: 0, accuracy: 0 }
    },
    currentStreak: 0,
    bestStreak: 0,
    specialty: 'Tech',
    memberSince: new Date('2024-10-12')
  },
  // ADMIN WALLET (has resolved pools, builds reputation)
  '0x580B01f8CDf7606723c3BE0dD2AaD058F5aECa3d': {
    address: '0x580B01f8CDf7606723c3BE0dD2AaD058F5aECa3d',
    accuracy: 75,
    totalPools: 4,
    correctPools: 3,
    wrongPools: 1,
    activePools: 0,
    tier: 'Expert',
    nftTokenId: 10,
    categoryStats: {
      'Crypto': { total: 2, correct: 2, accuracy: 100 },
      'Macro': { total: 2, correct: 1, accuracy: 50 }
    },
    currentStreak: 2,
    bestStreak: 3,
    specialty: 'Crypto, Macro',
    memberSince: new Date('2024-08-01')
  }
};

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

// Get reputation data for an address
export function getReputationData(address: string): ReputationData | undefined {
  return MOCK_REPUTATION[address];
}

// Get pools created by address
export function getPoolsByCreator(address: string): Pool[] {
  return MOCK_POOLS.filter(pool => pool.creatorAddress === address);
}

// Get stakes made by address
export function getStakesByUser(address: string): PoolStake[] {
  return MOCK_POOL_STAKES.filter(stake => stake.userAddress === address);
}

// Get tier icon
export function getTierIcon(tier: string): string {
  switch (tier) {
    case 'Novice': return '🥉';
    case 'Analyst': return '🥈';
    case 'Expert': return '🥇';
    case 'Master': return '💎';
    case 'Legend': return '👑';
    default: return '❓';
  }
}

// Calculate tier based on accuracy
export function calculateTier(accuracy: number): 'Novice' | 'Analyst' | 'Expert' | 'Master' | 'Legend' {
  if (accuracy >= 95) return 'Legend';
  if (accuracy >= 85) return 'Master';
  if (accuracy >= 70) return 'Expert';
  if (accuracy >= 50) return 'Analyst';
  return 'Novice';
}

// Get all analysts (users who have created pools)
export function getAllAnalysts(): ReputationData[] {
  return Object.values(MOCK_REPUTATION);
}

// Get analysts by tier
export function getAnalystsByTier(tier?: string): ReputationData[] {
  const analysts = getAllAnalysts();
  if (!tier || tier === 'All') return analysts;
  return analysts.filter(a => a.tier === tier);
}

// Get analysts by category
export function getAnalystsByCategory(category?: string): ReputationData[] {
  const analysts = getAllAnalysts();
  if (!category || category === 'All') return analysts;
  return analysts.filter(a => a.specialty.includes(category));
}

// Sort analysts
export function sortAnalysts(
  analysts: ReputationData[],
  sortBy: 'accuracy' | 'totalPools' | 'recent' = 'accuracy'
): ReputationData[] {
  const sorted = [...analysts];

  if (sortBy === 'accuracy') {
    // Sort by tier first, then accuracy within tier
    const tierOrder = { 'Legend': 5, 'Master': 4, 'Expert': 3, 'Analyst': 2, 'Novice': 1 };
    sorted.sort((a, b) => {
      const tierDiff = tierOrder[b.tier] - tierOrder[a.tier];
      if (tierDiff !== 0) return tierDiff;
      return b.accuracy - a.accuracy;
    });
  } else if (sortBy === 'totalPools') {
    sorted.sort((a, b) => b.totalPools - a.totalPools);
  } else if (sortBy === 'recent') {
    sorted.sort((a, b) => b.memberSince.getTime() - a.memberSince.getTime());
  }

  return sorted;
}

// Get user profile stats (including stakes even if no pools)
export interface UserProfileStats {
  address: string;
  reputation?: ReputationData;
  totalPools: number;
  totalStakes: number;
  totalNews: number;
  stakesWon?: number;
  stakesLost?: number;
  stakesActive?: number;
}

export function getUserProfileStats(address: string): UserProfileStats {
  const reputation = getReputationData(address);
  const pools = getPoolsByCreator(address);
  const stakes = getStakesByUser(address);
  const newsCreated = MOCK_NEWS.filter(n => n.creatorAddress === address);

  // Calculate stakes win/loss (based on resolved pools)
  let stakesWon = 0;
  let stakesLost = 0;
  let stakesActive = 0;

  stakes.forEach(stake => {
    const pool = getPoolById(stake.poolId);
    if (!pool) return;

    if (pool.status === 'resolved' && pool.outcome) {
      const userWon =
        (stake.position === 'agree' && pool.outcome === 'creator_correct') ||
        (stake.position === 'disagree' && pool.outcome === 'creator_wrong');

      if (userWon) stakesWon++;
      else stakesLost++;
    } else {
      stakesActive++;
    }
  });

  return {
    address,
    reputation,
    totalPools: pools.length,
    totalStakes: stakes.length,
    totalNews: newsCreated.length,
    stakesWon,
    stakesLost,
    stakesActive
  };
}

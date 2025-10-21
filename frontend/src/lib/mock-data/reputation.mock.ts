import { ReputationData } from '@/types';

/**
 * MOCK REPUTATION DATA - UPDATED FOR POINT-BASED SYSTEM
 *
 * This file contains mock data for user reputation with NEW point-based calculation:
 * Points = Σ (±100 per pool) × Stake Multiplier
 * Stake Multipliers: 1.0x (<$100), 1.5x ($100-$499), 2.0x ($500-$999), 2.5x ($1K-$4.9K), 3.0x ($5K+)
 *
 * Contract Integration Point:
 * - On-chain: Reputation NFT contract tracks stats with stake weight automatically
 * - Tier calculation: Novice (0-199), Analyst (200-499), Expert (500-999), Master (1000-4999), Legend (5000+)
 * - Map contract struct to ReputationData interface (see types/index.ts)
 */

export const MOCK_REPUTATION: Record<string, ReputationData> = {
  '0x1234...5678': {
    address: '0x1234...5678',
    accuracy: 87,
    totalPools: 12,
    correctPools: 10,        // High accuracy with good volume
    wrongPools: 2,
    activePools: 2,
    reputationPoints: 1250,  // 10 correct × 2.0x avg + 2 wrong × -1.5x = 1250 points
    tier: 'Master',           // 1000+ points, 10+ pools = Master
    nftTokenId: 1,
    categoryStats: {
      'Crypto': { total: 8, correct: 7, accuracy: 87.5 },
      'Tech': { total: 4, correct: 3, accuracy: 75 }
    },
    currentStreak: 3,
    bestStreak: 5,
    specialty: 'Crypto',
    memberSince: new Date('2024-09-15')
  },
  '0xabcd...efgh': {
    address: '0xabcd...efgh',
    accuracy: 50,
    totalPools: 4,
    correctPools: 2,
    wrongPools: 2,
    activePools: 1,
    reputationPoints: 350,   // 2 correct × 1.5x + 2 wrong × -1.0x = 300 - 50 = 250, bonus volume = 350
    tier: 'Analyst',          // 200-499 points = Analyst
    nftTokenId: 2,
    categoryStats: {
      'Crypto': { total: 4, correct: 2, accuracy: 50 }
    },
    currentStreak: 1,
    bestStreak: 2,
    specialty: 'Crypto',
    memberSince: new Date('2024-09-17')
  },
  '0x9999...1111': {
    address: '0x9999...1111',
    accuracy: 94,
    totalPools: 28,
    correctPools: 26,        // Very experienced with high volume
    wrongPools: 2,
    activePools: 1,
    reputationPoints: 6200,  // 26 correct × 2.5x avg + 2 wrong × -2.0x = 6500 - 300 = 6200
    tier: 'Legend',           // 5000+ points, 20+ pools = Legend
    nftTokenId: 3,
    categoryStats: {
      'Crypto': { total: 20, correct: 19, accuracy: 95 },
      'Tech': { total: 8, correct: 7, accuracy: 87.5 }
    },
    currentStreak: 8,
    bestStreak: 12,
    specialty: 'Crypto, Tech',
    memberSince: new Date('2024-06-01')
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
    memberSince: new Date('2024-08-05'),
    reputationPoints: -100  // 1 wrong prediction × 1.0x multiplier = -100 points
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
    memberSince: new Date('2024-08-06'),
    reputationPoints: 100   // 1 correct prediction × 1.0x multiplier = 100 points
  },
  '0x6666...7777': {
    address: '0x6666...7777',
    accuracy: 0,
    totalPools: 1,
    correctPools: 0,
    wrongPools: 0,
    activePools: 1,          // pool-6 (active)
    reputationPoints: 0,     // No resolved pools yet
    tier: 'Novice',           // 0-199 points = Novice
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
    memberSince: new Date('2024-10-10'),
    reputationPoints: 0     // No resolved pools yet
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
    memberSince: new Date('2024-10-11'),
    reputationPoints: 0     // No resolved pools yet
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
    memberSince: new Date('2024-10-12'),
    reputationPoints: 0     // No resolved pools yet
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
    memberSince: new Date('2024-08-01'),
    reputationPoints: 200  // (3 correct × 100) - (1 wrong × 100) = 200 points
  },
  // ADMIN WALLET - Tachul (Co-founder, DeFi specialist)
  '0xa930FDA4B716341c8b5D1b83B67BfC2adFbd1fEd': {
    address: '0xa930FDA4B716341c8b5D1b83B67BfC2adFbd1fEd',
    accuracy: 82,
    totalPools: 5,
    correctPools: 4,
    wrongPools: 1,
    activePools: 0,
    tier: 'Expert',
    nftTokenId: 11,
    categoryStats: {
      'DeFi': { total: 3, correct: 3, accuracy: 100 },
      'Crypto': { total: 2, correct: 1, accuracy: 50 }
    },
    currentStreak: 3,
    bestStreak: 3,
    specialty: 'DeFi, Crypto',
    memberSince: new Date('2024-07-15'),
    reputationPoints: 300  // (4 correct × 100) - (1 wrong × 100) = 300 points
  },
  // ADMIN WALLET - Zidan (Tech analyst, AI/ML focus)
  '0xeF4DB09D536439831FEcaA33fE4250168976535E': {
    address: '0xeF4DB09D536439831FEcaA33fE4250168976535E',
    accuracy: 88,
    totalPools: 16,
    correctPools: 14,
    wrongPools: 2,
    activePools: 0,
    reputationPoints: 2400,  // 14 correct × 2.0x + 2 wrong × -1.5x = 2800 - 45 = 2755, rounded to 2400
    tier: 'Master',            // 1000+ points, 10+ pools = Master
    nftTokenId: 12,
    categoryStats: {
      'Tech': { total: 12, correct: 11, accuracy: 91.7 },
      'Crypto': { total: 4, correct: 3, accuracy: 75 }
    },
    currentStreak: 7,
    bestStreak: 10,
    specialty: 'Tech, Crypto',
    memberSince: new Date('2024-07-01')
  }
};

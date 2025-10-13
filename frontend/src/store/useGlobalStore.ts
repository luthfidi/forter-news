import { create } from 'zustand';
import { Market, Analysis, News, Pool, PoolStake, User } from '@/types';

interface GlobalState {
  // ============================================
  // MODEL B: News + Pool State (NEW)
  // ============================================

  // News state
  newsList: News[];
  setNewsList: (news: News[]) => void;

  // Current news (when viewing detail)
  currentNews: News | null;
  setCurrentNews: (news: News | null) => void;

  // Pools state
  pools: Pool[];
  setPools: (pools: Pool[]) => void;

  // Current pool (when viewing detail)
  currentPool: Pool | null;
  setCurrentPool: (pool: Pool | null) => void;

  // Pool stakes
  poolStakes: PoolStake[];
  setPoolStakes: (stakes: PoolStake[]) => void;

  // ============================================
  // MODEL A: Legacy State (for backward compat)
  // ============================================

  // Markets state (Legacy)
  markets: Market[];
  setMarkets: (markets: Market[]) => void;

  // Current market (Legacy)
  currentMarket: Market | null;
  setCurrentMarket: (market: Market | null) => void;

  // Analyses for current market (Legacy)
  analyses: Analysis[];
  setAnalyses: (analyses: Analysis[]) => void;

  // ============================================
  // SHARED STATE
  // ============================================

  // User state
  user: User | null;
  setUser: (user: User | null) => void;

  // Loading states
  loading: {
    news: boolean;
    pools: boolean;
    stakes: boolean;
    // Legacy
    markets: boolean;
    analyses: boolean;
    staking: boolean;
  };
  setLoading: (key: keyof GlobalState['loading'], value: boolean) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  // ============================================
  // Initial State - MODEL B
  // ============================================
  newsList: [],
  currentNews: null,
  pools: [],
  currentPool: null,
  poolStakes: [],

  // ============================================
  // Initial State - MODEL A (Legacy)
  // ============================================
  markets: [],
  currentMarket: null,
  analyses: [],

  // ============================================
  // Initial State - SHARED
  // ============================================
  user: null,
  loading: {
    news: false,
    pools: false,
    stakes: false,
    markets: false,
    analyses: false,
    staking: false,
  },

  // ============================================
  // Actions - MODEL B
  // ============================================
  setNewsList: (newsList) => set({ newsList }),
  setCurrentNews: (currentNews) => set({ currentNews }),
  setPools: (pools) => set({ pools }),
  setCurrentPool: (currentPool) => set({ currentPool }),
  setPoolStakes: (poolStakes) => set({ poolStakes }),

  // ============================================
  // Actions - MODEL A (Legacy)
  // ============================================
  setMarkets: (markets) => set({ markets }),
  setCurrentMarket: (currentMarket) => set({ currentMarket }),
  setAnalyses: (analyses) => set({ analyses }),

  // ============================================
  // Actions - SHARED
  // ============================================
  setUser: (user) => set({ user }),
  setLoading: (key, value) =>
    set((state) => ({
      loading: { ...state.loading, [key]: value }
    })),
}));
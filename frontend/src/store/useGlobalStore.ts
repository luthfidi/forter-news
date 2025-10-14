import { create } from 'zustand';
import { News, Pool, PoolStake, User } from '@/types';

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
  // Legacy markets removed - using News/Pool only
  // ============================================

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
  };
  setLoading: (key: keyof GlobalState['loading'], value: boolean) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  // ============================================
  // Initial State
  // ============================================
  newsList: [],
  currentNews: null,
  pools: [],
  currentPool: null,
  poolStakes: [],
  user: null,
  loading: {
    news: false,
    pools: false,
    stakes: false,
  },

  // ============================================
  // Actions
  // ============================================
  setNewsList: (newsList) => set({ newsList }),
  setCurrentNews: (currentNews) => set({ currentNews }),
  setPools: (pools) => set({ pools }),
  setCurrentPool: (currentPool) => set({ currentPool }),
  setPoolStakes: (poolStakes) => set({ poolStakes }),
  setUser: (user) => set({ user }),
  setLoading: (key, value) =>
    set((state) => ({
      loading: { ...state.loading, [key]: value }
    })),
}));
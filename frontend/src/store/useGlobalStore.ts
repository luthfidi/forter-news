import { create } from 'zustand';
import { Market, Analysis, User } from '@/types';

interface GlobalState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Markets state
  markets: Market[];
  setMarkets: (markets: Market[]) => void;
  
  // Current market
  currentMarket: Market | null;
  setCurrentMarket: (market: Market | null) => void;
  
  // Analyses for current market
  analyses: Analysis[];
  setAnalyses: (analyses: Analysis[]) => void;
  
  // Loading states
  loading: {
    markets: boolean;
    analyses: boolean;
    staking: boolean;
  };
  setLoading: (key: keyof GlobalState['loading'], value: boolean) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  // Initial state
  user: null,
  markets: [],
  currentMarket: null,
  analyses: [],
  loading: {
    markets: false,
    analyses: false,
    staking: false,
  },
  
  // Actions
  setUser: (user) => set({ user }),
  setMarkets: (markets) => set({ markets }),
  setCurrentMarket: (currentMarket) => set({ currentMarket }),
  setAnalyses: (analyses) => set({ analyses }),
  setLoading: (key, value) => 
    set((state) => ({
      loading: { ...state.loading, [key]: value }
    })),
}));
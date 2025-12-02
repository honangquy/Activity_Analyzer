import { create } from 'zustand';
import { AnalysisResult } from '@/types';

interface AppState {
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  activeTab: 'dashboard' | 'activities' | 'search' | 'export';
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveTab: (tab: 'dashboard' | 'activities' | 'search' | 'export') => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  analysisResult: null,
  isLoading: false,
  error: null,
  activeTab: 'dashboard',
  setAnalysisResult: (result) => set({ analysisResult: result, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  reset: () => set({ analysisResult: null, isLoading: false, error: null, activeTab: 'dashboard' }),
}));

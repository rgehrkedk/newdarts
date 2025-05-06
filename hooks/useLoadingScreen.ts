import { create } from 'zustand';

type LoadingState = {
  isLoading: boolean;
  message: string;
  showLoadingScreen: (message?: string) => void;
  hideLoadingScreen: () => void;
};

// Create store with persist middleware to ensure loading state is maintained
export const useLoadingScreen = create<LoadingState>((set) => ({
  isLoading: true, // Start with true to show loading screen on app launch
  message: 'Loading game...',
  showLoadingScreen: (message = 'Loading game...') => set({ isLoading: true, message }),
  hideLoadingScreen: () => set({ isLoading: false }),
}));
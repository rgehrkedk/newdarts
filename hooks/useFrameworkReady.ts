import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useLoadingScreen } from './useLoadingScreen';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  const { hideLoadingScreen } = useLoadingScreen();
  
  useEffect(() => {
    // Handle framework ready event
    const frameworkReadyHandler = () => {
      // Wait a bit to show the loading animation on faster devices
      setTimeout(() => {
        // The hideLoadingScreen will be called by the LoadingScreen component
        // after its animation completes
      }, Platform.OS === 'web' ? 500 : 2000);
    };
    
    // Call framework ready
    window.frameworkReady?.();
    
    // Setup frameworkReady handler for future calls
    if (window.frameworkReady === undefined) {
      window.frameworkReady = frameworkReadyHandler;
    } else {
      const originalReady = window.frameworkReady;
      window.frameworkReady = () => {
        originalReady();
        frameworkReadyHandler();
      };
    }
    
    // Call the handler immediately to start the process
    frameworkReadyHandler();
  }, []);
}

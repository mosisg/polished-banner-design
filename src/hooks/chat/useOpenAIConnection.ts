
import { useState, useCallback } from 'react';

interface OpenAIConnectionState {
  isConnectedToOpenAI: boolean;
  hasOpenAIFailed: boolean;
  retryCount: number;
  setIsConnectedToOpenAI: (isConnected: boolean) => void;
  setHasOpenAIFailed: (hasFailed: boolean) => void;
  incrementRetryCount: () => void;
  resetRetryCount: () => void;
}

/**
 * Hook to manage the connection state to OpenAI
 * Optimized with memoized state updaters to prevent unnecessary re-renders
 * 
 * @returns OpenAIConnectionState - State and methods to manage OpenAI connection
 */
export const useOpenAIConnection = (): OpenAIConnectionState => {
  const [isConnectedToOpenAI, setIsConnectedToOpenAIState] = useState<boolean>(true);
  const [hasOpenAIFailed, setHasOpenAIFailedState] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  /**
   * Set connection state with memoized callback
   */
  const setIsConnectedToOpenAI = useCallback((isConnected: boolean) => {
    setIsConnectedToOpenAIState(isConnected);
  }, []);

  /**
   * Set failure state with memoized callback
   */
  const setHasOpenAIFailed = useCallback((hasFailed: boolean) => {
    setHasOpenAIFailedState(hasFailed);
  }, []);

  /**
   * Increment retry count with memoized callback
   */
  const incrementRetryCount = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);
  
  /**
   * Reset retry count with memoized callback
   */
  const resetRetryCount = useCallback(() => {
    setRetryCount(0);
  }, []);

  return {
    isConnectedToOpenAI,
    hasOpenAIFailed,
    retryCount,
    setIsConnectedToOpenAI,
    setHasOpenAIFailed,
    incrementRetryCount,
    resetRetryCount
  };
};

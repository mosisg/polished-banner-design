
import { useState } from 'react';

interface OpenAIConnectionState {
  isConnectedToOpenAI: boolean;
  hasOpenAIFailed: boolean;
  retryCount: number;
  setIsConnectedToOpenAI: (isConnected: boolean) => void;
  setHasOpenAIFailed: (hasFailed: boolean) => void;
  incrementRetryCount: () => void;
}

/**
 * Hook to manage the connection state to OpenAI
 * 
 * @returns OpenAIConnectionState - State and methods to manage OpenAI connection
 */
export const useOpenAIConnection = (): OpenAIConnectionState => {
  const [isConnectedToOpenAI, setIsConnectedToOpenAI] = useState<boolean>(true);
  const [hasOpenAIFailed, setHasOpenAIFailed] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  /**
   * Increments the retry count when attempting to reconnect to OpenAI
   */
  const incrementRetryCount = () => {
    setRetryCount(prev => prev + 1);
  };

  return {
    isConnectedToOpenAI,
    hasOpenAIFailed,
    retryCount,
    setIsConnectedToOpenAI,
    setHasOpenAIFailed,
    incrementRetryCount
  };
};

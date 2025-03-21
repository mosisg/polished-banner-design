
import { useState } from 'react';

interface OpenAIConnectionState {
  isConnectedToOpenAI: boolean;
  hasOpenAIFailed: boolean;
  retryCount: number;
  setIsConnectedToOpenAI: (isConnected: boolean) => void;
  setHasOpenAIFailed: (hasFailed: boolean) => void;
  incrementRetryCount: () => void;
}

export const useOpenAIConnection = (): OpenAIConnectionState => {
  const [isConnectedToOpenAI, setIsConnectedToOpenAI] = useState<boolean>(true);
  const [hasOpenAIFailed, setHasOpenAIFailed] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

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

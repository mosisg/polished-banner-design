
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getOpenAIResponse } from '@/services/support/openAiService';
import { useSupportChatContext } from '@/contexts/SupportChatContext';

export const useOpenAIConnection = () => {
  const { state, dispatch } = useSupportChatContext();
  const { toast } = useToast();
  const { sessionId, hasOpenAIFailed, retryCount, isConnectedToOpenAI } = state;

  // Test OpenAI connectivity on start
  useEffect(() => {
    if (!sessionId) return;
    
    const testOpenAIConnection = async () => {
      try {
        // Just create a simple ping message that won't be displayed
        const testResponse = await getOpenAIResponse("ping", [], sessionId, false);
        dispatch({ type: 'SET_OPENAI_CONNECTED', payload: true });
        dispatch({ type: 'SET_OPENAI_FAILED', payload: false });
      } catch (err) {
        console.error("Failed to connect to OpenAI:", err);
        dispatch({ type: 'SET_OPENAI_CONNECTED', payload: false });
        dispatch({ type: 'SET_OPENAI_FAILED', payload: true });
      }
    };
    
    testOpenAIConnection();
  }, [sessionId, dispatch]);

  // Periodically retry OpenAI connection if it fails
  useEffect(() => {
    // Only retry if we've previously had a failure
    if (hasOpenAIFailed && retryCount < 3) {
      const retryTimeout = setTimeout(async () => {
        try {
          const testResponse = await getOpenAIResponse("ping", [], sessionId, false);
          console.log("Successfully reconnected to OpenAI");
          dispatch({ type: 'SET_OPENAI_CONNECTED', payload: true });
          dispatch({ type: 'SET_OPENAI_FAILED', payload: false });
          
          toast({
            title: "Connexion rétablie",
            description: "La connexion au service intelligent a été rétablie.",
            variant: "default"
          });
        } catch (err) {
          console.error("Failed to reconnect to OpenAI:", err);
          dispatch({ type: 'INCREMENT_RETRY_COUNT' });
        }
      }, 30000); // Try every 30 seconds
      
      return () => clearTimeout(retryTimeout);
    }
  }, [hasOpenAIFailed, retryCount, sessionId, toast, dispatch]);

  return { 
    isConnectedToOpenAI, 
    hasOpenAIFailed, 
    retryCount,
    setIsConnectedToOpenAI: (connected: boolean) => 
      dispatch({ type: 'SET_OPENAI_CONNECTED', payload: connected }),
    setHasOpenAIFailed: (failed: boolean) => 
      dispatch({ type: 'SET_OPENAI_FAILED', payload: failed }),
    incrementRetryCount: () => 
      dispatch({ type: 'INCREMENT_RETRY_COUNT' })
  };
};

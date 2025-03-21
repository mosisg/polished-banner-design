
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getOpenAIResponse } from '@/services/support/openAiService';

export const useOpenAIConnection = (sessionId: string) => {
  const [hasOpenAIFailed, setHasOpenAIFailed] = useState(false);
  const [isConnectedToOpenAI, setIsConnectedToOpenAI] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  // Test OpenAI connectivity on start
  useEffect(() => {
    if (!sessionId) return;
    
    const testOpenAIConnection = async () => {
      try {
        // Just create a simple ping message that won't be displayed
        const testResponse = await getOpenAIResponse("ping", [], sessionId, false);
        setIsConnectedToOpenAI(true);
        setHasOpenAIFailed(false);
      } catch (err) {
        console.error("Failed to connect to OpenAI:", err);
        setIsConnectedToOpenAI(false);
        setHasOpenAIFailed(true);
      }
    };
    
    testOpenAIConnection();
  }, [sessionId]);

  // Add this new effect to periodically retry OpenAI connection if it fails
  useEffect(() => {
    // Only retry if we've previously had a failure
    if (hasOpenAIFailed && retryCount < 3) {
      const retryTimeout = setTimeout(async () => {
        try {
          const testResponse = await getOpenAIResponse("ping", [], sessionId, false);
          console.log("Successfully reconnected to OpenAI");
          setIsConnectedToOpenAI(true);
          setHasOpenAIFailed(false);
          
          toast({
            title: "Connexion rétablie",
            description: "La connexion au service intelligent a été rétablie.",
            variant: "default"
          });
        } catch (err) {
          console.error("Failed to reconnect to OpenAI:", err);
          setRetryCount(prev => prev + 1);
        }
      }, 30000); // Try every 30 seconds
      
      return () => clearTimeout(retryTimeout);
    }
  }, [hasOpenAIFailed, retryCount, sessionId, toast]);

  return { 
    isConnectedToOpenAI, 
    hasOpenAIFailed, 
    retryCount,
    setIsConnectedToOpenAI, 
    setHasOpenAIFailed,
    incrementRetryCount: () => setRetryCount(prev => prev + 1) 
  };
};

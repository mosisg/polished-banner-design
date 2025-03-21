
import { useState, useEffect } from 'react';
import { createChatSession } from '@/services/support/sessionService';
import { v4 as uuidv4 } from 'uuid';

export const useChatSession = () => {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    const initSession = async () => {
      try {
        const newSessionId = await createChatSession();
        setSessionId(newSessionId);
      } catch (err) {
        console.error("Failed to initialize session:", err);
        // Generate a local ID for fallback
        setSessionId(uuidv4());
      }
    };
    
    initSession();
  }, []);

  return { sessionId };
};

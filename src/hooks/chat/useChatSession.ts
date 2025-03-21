
import { useEffect } from 'react';
import { createChatSession } from '@/services/support/sessionService';
import { v4 as uuidv4 } from 'uuid';
import { useSupportChatContext } from '@/contexts/SupportChatContext';

export const useChatSession = () => {
  const { state, dispatch } = useSupportChatContext();

  useEffect(() => {
    const initSession = async () => {
      try {
        const newSessionId = await createChatSession();
        dispatch({ type: 'SET_SESSION_ID', payload: newSessionId });
      } catch (err) {
        console.error("Failed to initialize session:", err);
        // Generate a local ID for fallback
        dispatch({ type: 'SET_SESSION_ID', payload: uuidv4() });
      }
    };
    
    initSession();
  }, [dispatch]);

  return { sessionId: state.sessionId };
};

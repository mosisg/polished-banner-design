
/**
 * Session Service
 * Manages the support chat sessions and messages
 */
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a new support session
 */
export async function createChatSession(): Promise<string> {
  const newSessionId = uuidv4();
  
  try {
    const { error } = await supabase
      .from('support_sessions')
      .insert([
        { id: newSessionId, status: 'active' }
      ]);
    
    if (error) {
      console.error('Error creating chat session:', error);
      // If RLS error occurs, still return the ID for client-side usage
      // This allows the chat to function even without saving to database
    }
  } catch (err) {
    console.error('Failed to create session:', err);
  }
  
  return newSessionId;
}

/**
 * Saves a chat message to the database
 */
export async function saveChatMessage(
  sessionId: string,
  message: string,
  isBot: boolean
): Promise<void> {
  if (!sessionId) return;
  
  try {
    const { error } = await supabase
      .from('support_messages')
      .insert([
        { 
          session_id: sessionId,
          is_bot: isBot,
          message: message
        }
      ]);
    
    if (error) {
      console.error('Error saving chat message:', error);
      // Continue execution even if saving fails
    }
  } catch (err) {
    console.error('Failed to save message:', err);
  }
}

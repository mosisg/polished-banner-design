
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
  
  // Return the ID even if there was an error to allow local-only sessions
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
  
  // Generate a local ID for the message
  const messageId = uuidv4();
  
  try {
    const { error } = await supabase
      .from('support_messages')
      .insert([
        { 
          id: messageId,
          session_id: sessionId,
          is_bot: isBot,
          message: message
        }
      ]);
    
    if (error) {
      console.error('Error saving chat message:', error);
      // Continue execution even if saving fails
      
      // If we're getting RLS errors, we could implement a local storage fallback here
      if (error.code === '42501') { // RLS policy violation
        saveMessageToLocalStorage(sessionId, messageId, message, isBot);
      }
    }
  } catch (err) {
    console.error('Failed to save message:', err);
    // Fallback to local storage
    saveMessageToLocalStorage(sessionId, messageId, message, isBot);
  }
}

/**
 * Fallback function to save messages to local storage when database access fails
 */
function saveMessageToLocalStorage(
  sessionId: string,
  messageId: string,
  message: string,
  isBot: boolean
): void {
  try {
    // Get existing messages from local storage
    const existingMessagesStr = localStorage.getItem('support_messages') || '[]';
    const existingMessages = JSON.parse(existingMessagesStr);
    
    // Add the new message
    existingMessages.push({
      id: messageId,
      session_id: sessionId,
      is_bot: isBot,
      message: message,
      created_at: new Date().toISOString()
    });
    
    // Save back to local storage
    localStorage.setItem('support_messages', JSON.stringify(existingMessages));
  } catch (err) {
    console.error('Failed to save message to local storage:', err);
  }
}

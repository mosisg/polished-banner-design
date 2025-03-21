
/**
 * OpenAI Service
 * Handles interactions with the OpenAI API for support chat
 */
import { getChatCompletion, getAssistantSystemMessage } from '@/services/openai/client';
import { getSmartResponse } from './smartResponseService';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  usedContext?: boolean;
}

/**
 * Gets a response from OpenAI based on user message and chat history
 */
export async function getOpenAIResponse(
  userMessage: string,
  chatHistory: ChatMessage[],
  sessionId: string,
  useRAG: boolean
): Promise<{text: string, usedContext: boolean}> {
  try {
    const systemMessage = getAssistantSystemMessage();
    
    const formattedHistory = chatHistory.slice(1).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    } as const));
    
    const aiMessages = [
      systemMessage,
      ...formattedHistory,
      { role: 'user', content: userMessage } as const
    ];
    
    const response = await getChatCompletion(aiMessages, { 
      sessionId, 
      model: 'gpt-4-turbo',
      temperature: 0.7,
      query: userMessage,
      useRag: useRAG
    });
    
    return {
      text: response.message.content,
      usedContext: response.used_context || false
    };
  } catch (error) {
    console.error('Error getting OpenAI response:', error);
    
    return {
      text: getSmartResponse(userMessage),
      usedContext: false
    };
  }
}

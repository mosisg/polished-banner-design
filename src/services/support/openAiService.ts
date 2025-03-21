
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
  documentReferences?: DocumentReference[];
}

export interface DocumentReference {
  id: string;
  title: string;
  excerpt: string;
}

/**
 * Gets a response from OpenAI based on user message and chat history
 */
export async function getOpenAIResponse(
  userMessage: string,
  chatHistory: ChatMessage[],
  sessionId: string,
  useRAG: boolean
): Promise<{text: string, usedContext: boolean, documentReferences?: DocumentReference[]}> {
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
    
    // Create document references array if context is returned from the Edge Function
    let documentReferences: DocumentReference[] = [];
    
    // Check if the response has context information
    if (response.used_context && response.context_count && response.context_count > 0) {
      // Since context_documents is not available in the response type,
      // we'll handle the case where documents are available but not properly typed
      const contextDocuments = (response as any).context_documents;
      
      if (contextDocuments && Array.isArray(contextDocuments)) {
        documentReferences = contextDocuments.map(doc => ({
          id: doc.id,
          title: doc.metadata?.title || 'Document sans titre',
          excerpt: doc.content.substring(0, 150) + '...'
        }));
      }
    }
    
    return {
      text: response.message.content,
      usedContext: response.used_context || false,
      documentReferences: documentReferences.length > 0 ? documentReferences : undefined
    };
  } catch (error) {
    console.error('Error getting OpenAI response:', error);
    
    return {
      text: getSmartResponse(userMessage),
      usedContext: false
    };
  }
}

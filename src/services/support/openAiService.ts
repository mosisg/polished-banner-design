
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
    
    // Limit context window to avoid token limits
    // Take first message (usually system intro) and last 8 messages for context
    const relevantHistory = chatHistory.length <= 9 
      ? chatHistory 
      : [chatHistory[0], ...chatHistory.slice(-8)];
    
    const formattedHistory = relevantHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    } as const));
    
    // Add conversation history fingerprint to avoid repetition
    const historyFingerprint = chatHistory
      .slice(-3)
      .map(msg => `${msg.sender}:${msg.text.substring(0, 50)}`)
      .join('|');
    
    const aiMessages = [
      systemMessage,
      ...formattedHistory,
      { role: 'user', content: userMessage } as const
    ];
    
    console.log(`Sending message to OpenAI with ${aiMessages.length} messages in context`);
    console.log(`Using RAG: ${useRAG}`);
    
    const response = await getChatCompletion(aiMessages, { 
      sessionId, 
      model: 'gpt-4-turbo',
      temperature: 0.7,
      maxTokens: 1500,
      query: userMessage,
      useRag: useRAG,
      historyFingerprint // Pass fingerprint to avoid repetition
    });
    
    // Create document references array if context is returned
    let documentReferences: DocumentReference[] = [];
    
    // Check if the response has context information
    if (response.used_context && response.context_count && response.context_count > 0) {
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
    
    // Create a conversation context string for fallback
    const conversationContext = chatHistory
      .slice(-5) // Only use last 5 messages for fallback context
      .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');
    
    return {
      text: getSmartResponse(userMessage, conversationContext),
      usedContext: false
    };
  }
}


import { OpenAI } from 'https://esm.sh/openai@4.20.1'
import { ChatCompletionRequest, Document } from '../types/index.ts'

// Get OpenAI chat completion
export async function getChatCompletion(
  openai: OpenAI, 
  enhancedMessages: any[], 
  model: string,
  temperature: number,
  max_tokens: number
) {
  return await openai.chat.completions.create({
    model,
    messages: enhancedMessages,
    temperature,
    max_tokens,
  });
}

// Enhance messages with context documents and anti-repetition instruction
export function enhanceMessages(
  messages: any[],
  contextDocuments: Document[],
  useRAG: boolean,
  historyFingerprint?: string
): any[] {
  let enhancedMessages = [...messages];
  
  // Only add context if RAG is enabled and we have documents
  if (useRAG && contextDocuments.length > 0) {
    const contextText = contextDocuments
      .map(doc => `Document: ${doc.metadata.title || 'Untitled'}\n${doc.content}`)
      .join('\n\n');
    
    // Add context as a system message right after the existing system message
    const systemMessageIndex = enhancedMessages.findIndex(msg => msg.role === 'system');
    
    if (systemMessageIndex >= 0) {
      // Insert after the existing system message
      enhancedMessages.splice(systemMessageIndex + 1, 0, {
        role: 'system',
        content: `Voici des informations pertinentes tirées de notre base de connaissances qui pourront t'aider à répondre à la question de l'utilisateur:\n\n${contextText}`,
      });
    } else {
      // No system message found, add context as first system message
      enhancedMessages.unshift({
        role: 'system',
        content: `Voici des informations pertinentes tirées de notre base de connaissances qui pourront t'aider à répondre à la question de l'utilisateur:\n\n${contextText}`,
      });
    }
  }
  
  // If we have a history fingerprint, add an instruction to avoid repetition
  if (historyFingerprint) {
    enhancedMessages.push({
      role: 'system',
      content: 'IMPORTANT: Veille à formuler ta réponse de manière unique et différente des réponses précédentes. Évite les répétitions même si le contenu est similaire.'
    });
  }
  
  return enhancedMessages;
}

// Log completion to Supabase
export async function logCompletion(
  supabase: any,
  session_id: string | undefined,
  messages: any[],
  completion: string,
  model: string,
  tokens: number,
  contextDocuments: Document[]
) {
  if (!session_id) return;
  
  try {
    await supabase.from('ai_completions').insert({
      session_id,
      prompt: JSON.stringify(messages),
      completion,
      model,
      tokens,
      context_docs: contextDocuments.length > 0 ? JSON.stringify(contextDocuments.map(d => d.id)) : null,
    });
  } catch (logError) {
    // Continue even if logging fails
    console.error('Error logging completion:', logError);
  }
}

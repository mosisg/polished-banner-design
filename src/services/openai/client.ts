
/**
 * OpenAI Service Client
 * Handles communication with OpenAI via Supabase Edge Functions
 */
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatCompletionRequest {
  messages: ChatMessage[];
  model: string;
  temperature?: number;
  max_tokens?: number;
  session_id?: string;
  query?: string; // For RAG search
  use_rag?: boolean; // Whether to use RAG
  history_fingerprint?: string; // To avoid repetitions
}

interface ChatCompletionResponse {
  id: string;
  message: {
    role: 'assistant';
    content: string;
  };
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  used_context?: boolean;
  context_count?: number;
}

/**
 * Sends a chat completion request to OpenAI via Supabase Edge Function
 */
export async function getChatCompletion(
  messages: ChatMessage[],
  options: {
    sessionId?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    query?: string; // The query for RAG lookup
    useRag?: boolean; // Whether to use RAG
    historyFingerprint?: string; // To avoid repetition
  } = {}
): Promise<ChatCompletionResponse> {
  const {
    sessionId,
    model = 'gpt-4-turbo',
    temperature = 0.7,
    maxTokens = 1200,
    query,
    useRag = false,
    historyFingerprint,
  } = options;

  try {
    console.log(`Sending request to OpenAI with model: ${model}`);
    
    const payload: ChatCompletionRequest = {
      messages,
      model,
      temperature,
      max_tokens: maxTokens,
      session_id: sessionId,
      query: query || messages[messages.length - 1]?.content, // Use the last user message as query if not provided
      use_rag: useRag,
      history_fingerprint: historyFingerprint,
    };

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: payload,
    });

    if (error) {
      console.error('Error calling OpenAI via Supabase:', error);
      throw new Error(error.message || 'Failed to get AI response');
    }

    return data as ChatCompletionResponse;
  } catch (err) {
    console.error('Error in getChatCompletion:', err);
    throw err;
  }
}

/**
 * Generates a system message for the ComparePrix assistant
 */
export function getAssistantSystemMessage(): ChatMessage {
  return {
    role: 'system',
    content: `Tu es un assistant virtuel pour ComparePrix, un site de comparaison de forfaits mobiles, box internet et smartphones en France.
    
Informations importantes:
- Les principaux opérateurs sont Orange, SFR, Bouygues, Free et leurs marques secondaires (Sosh, RED, B&You)
- Les prix des forfaits mobiles varient généralement entre 5€ et 30€ par mois
- Les box internet fibre coûtent généralement entre 20€ et 50€ par mois
- Les smartphones comparés incluent les gammes iPhone, Samsung Galaxy, Xiaomi, et autres marques populaires
    
Ta mission est d'aider les utilisateurs à:
- Trouver le forfait mobile ou la box internet qui correspond à leurs besoins
- Comparer les offres des différents opérateurs
- Répondre aux questions sur les technologies (5G, fibre, etc.)
- Guider vers les comparateurs du site
    
Ton style de communication:
- Sois concis mais informatif
- Utilise un ton professionnel mais convivial
- Propose des suggestions précises basées sur les besoins exprimés
- Réponds en français
- IMPORTANT: Évite de répéter les mêmes informations ou phrases que tu as déjà utilisées
    
Rappelle-toi que tu ne peux pas effectuer d'actions comme souscrire à un forfait. Tu dois rediriger vers le comparateur approprié du site.`
  };
}


// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.26.0'
import { corsHeaders } from '../_shared/cors.ts'
import { OpenAI } from 'https://esm.sh/openai@4.20.1'

const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

interface ChatCompletionRequest {
  messages: {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }[];
  model: string;
  temperature?: number;
  max_tokens?: number;
  session_id?: string;
  query?: string; // For RAG search
  use_rag?: boolean; // Whether to use RAG
  history_fingerprint?: string; // To avoid repetitions
  health_check?: boolean; // For system status check
}

interface Document {
  id: string;
  content: string;
  metadata: Record<string, any>;
}

// Function to find relevant documents based on query
async function findRelevantDocuments(
  supabase: any,
  query: string,
  limit = 5
): Promise<Document[]> {
  try {
    // Check if OpenAI is available
    if (!openaiApiKey) {
      console.error('OpenAI API key not configured, skipping document lookup')
      return []
    }
    
    const openai = new OpenAI({
      apiKey: openaiApiKey
    })
    
    // Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    })
    
    const embedding = embeddingResponse.data[0].embedding
    
    // Query documents based on vector similarity
    const { data: documents, error } = await supabase.rpc(
      'match_documents',
      {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: limit
      }
    )
    
    if (error) {
      console.error('Error finding relevant documents:', error)
      return []
    }
    
    console.log(`Found ${documents?.length || 0} relevant documents`)
    return documents || []
  } catch (error) {
    console.error('Error in findRelevantDocuments:', error)
    return []
  }
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get request payload
    const payload: ChatCompletionRequest = await req.json()
    
    // Create Supabase client
    const authHeader = req.headers.get('Authorization')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: authHeader || `Bearer ${supabaseKey}`,
        },
      },
    })
    
    // Handle health check request
    if (payload.health_check) {
      return new Response(
        JSON.stringify({
          status: 'ok',
          openai_key_configured: !!openaiApiKey
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }
    
    // Check if OpenAI API key is configured
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured',
          openai_key_configured: false 
        }),
        { 
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }
    
    const openai = new OpenAI({
      apiKey: openaiApiKey
    })
    
    // Destructure payload
    const { 
      messages, 
      model, 
      temperature = 0.7, 
      max_tokens = 1200, 
      session_id, 
      query, 
      use_rag = false,
      history_fingerprint
    } = payload

    // Enhanced context from vector database if RAG is enabled
    let enhancedMessages = [...messages]
    let contextDocuments: Document[] = []
    
    // Only perform RAG if explicitly enabled
    if (use_rag && query) {
      contextDocuments = await findRelevantDocuments(supabase, query)
      
      if (contextDocuments.length > 0) {
        // Format context documents as system message
        const contextText = contextDocuments
          .map(doc => `Document: ${doc.metadata.title || 'Untitled'}\n${doc.content}`)
          .join('\n\n')
        
        // Add context as a system message right after the existing system message
        const systemMessageIndex = enhancedMessages.findIndex(msg => msg.role === 'system')
        
        if (systemMessageIndex >= 0) {
          // Insert after the existing system message
          enhancedMessages.splice(systemMessageIndex + 1, 0, {
            role: 'system',
            content: `Voici des informations pertinentes tirées de notre base de connaissances qui pourront t'aider à répondre à la question de l'utilisateur:\n\n${contextText}`,
          })
        } else {
          // No system message found, add context as first system message
          enhancedMessages.unshift({
            role: 'system',
            content: `Voici des informations pertinentes tirées de notre base de connaissances qui pourront t'aider à répondre à la question de l'utilisateur:\n\n${contextText}`,
          })
        }
      }
    }
    
    // If we have a history fingerprint, add an instruction to avoid repetition
    if (history_fingerprint) {
      // Add a note to avoid repetition based on recent history
      enhancedMessages.push({
        role: 'system',
        content: 'IMPORTANT: Veille à formuler ta réponse de manière unique et différente des réponses précédentes. Évite les répétitions même si le contenu est similaire.'
      })
    }

    // Get OpenAI response
    const response = await openai.chat.completions.create({
      model,
      messages: enhancedMessages,
      temperature,
      max_tokens,
    })

    const assistantMessage = response.choices[0].message

    // Log completion to Supabase
    if (session_id) {
      try {
        await supabase.from('ai_completions').insert({
          session_id,
          prompt: JSON.stringify(messages),
          completion: assistantMessage.content,
          model,
          tokens: response.usage?.total_tokens || 0,
          context_docs: contextDocuments.length > 0 ? JSON.stringify(contextDocuments.map(d => d.id)) : null,
        })
      } catch (logError) {
        // Continue even if logging fails
        console.error('Error logging completion:', logError)
      }
    }

    // Return the response
    return new Response(
      JSON.stringify({
        id: response.id,
        message: assistantMessage,
        usage: response.usage,
        used_context: contextDocuments.length > 0,
        context_count: contextDocuments.length,
        context_documents: contextDocuments.length > 0 ? contextDocuments : undefined,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        openai_key_configured: !!openaiApiKey
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})


// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.26.0'
import { OpenAI } from 'https://esm.sh/openai@4.20.1'
import { handleCors, corsHeaders } from './utils/cors.ts'
import { findRelevantDocuments } from './services/documentService.ts'
import { 
  getChatCompletion, 
  enhanceMessages, 
  logCompletion 
} from './services/completionService.ts'
import { 
  createSuccessResponse, 
  createErrorResponse, 
  createHealthCheckResponse 
} from './services/responseService.ts'
import { ChatCompletionRequest } from './types/index.ts'

Deno.serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Get request payload
    const payload: ChatCompletionRequest = await req.json();
    
    // Create Supabase client
    const authHeader = req.headers.get('Authorization');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: authHeader || `Bearer ${supabaseKey}`,
        },
      },
    });
    
    // Check OpenAI API key configuration
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    // Handle health check request
    if (payload.health_check) {
      return createHealthCheckResponse(!!openaiApiKey);
    }
    
    // Check if OpenAI API key is configured
    if (!openaiApiKey) {
      return createErrorResponse(
        new Error('OpenAI API key not configured'),
        false
      );
    }
    
    const openai = new OpenAI({
      apiKey: openaiApiKey
    });
    
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
    } = payload;

    // Get relevant documents if RAG is enabled
    let contextDocuments = [];
    if (use_rag && query) {
      contextDocuments = await findRelevantDocuments(supabase, query);
    }
    
    // Enhance messages with context documents and anti-repetition instruction
    const enhancedMessages = enhanceMessages(messages, contextDocuments, use_rag, history_fingerprint);

    // Get OpenAI response
    const response = await getChatCompletion(
      openai,
      enhancedMessages,
      model,
      temperature,
      max_tokens
    );

    const assistantMessage = response.choices[0].message;

    // Log completion to Supabase
    await logCompletion(
      supabase,
      session_id,
      messages,
      assistantMessage.content,
      model,
      response.usage?.total_tokens || 0,
      contextDocuments
    );

    // Return the response
    return createSuccessResponse(
      response.id,
      assistantMessage,
      response.usage,
      contextDocuments
    );
  } catch (error) {
    console.error('Error:', error);
    return createErrorResponse(
      error,
      !!Deno.env.get('OPENAI_API_KEY')
    );
  }
});

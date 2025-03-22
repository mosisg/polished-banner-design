
import { corsHeaders } from '../utils/cors.ts';
import { Document } from '../types/index.ts';

// Create a success response
export function createSuccessResponse(
  id: string, 
  assistantMessage: any, 
  usage: any,
  contextDocuments: Document[]
) {
  return new Response(
    JSON.stringify({
      id,
      message: assistantMessage,
      usage,
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
  );
}

// Create an error response
export function createErrorResponse(
  error: Error,
  openaiKeyConfigured: boolean,
  status = 500
) {
  return new Response(
    JSON.stringify({ 
      error: error.message,
      openai_key_configured: openaiKeyConfigured
    }),
    { 
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  );
}

// Create a health check response
export function createHealthCheckResponse(openaiKeyConfigured: boolean) {
  return new Response(
    JSON.stringify({
      status: 'ok',
      openai_key_configured: openaiKeyConfigured
    }),
    {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  );
}

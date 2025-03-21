
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.26.0'
import { corsHeaders } from '../_shared/cors.ts'
import { OpenAI } from 'https://esm.sh/openai@4.20.1'

const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
if (!openaiApiKey) throw new Error('Missing OpenAI API key')

const openai = new OpenAI({
  apiKey: openaiApiKey
})

interface IngestRequest {
  documents: {
    content: string;
    metadata: {
      title?: string;
      source?: string;
      category?: string;
      [key: string]: any;
    };
  }[];
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get request payload
    const { documents }: IngestRequest = await req.json()
    
    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No documents provided for ingestion' }),
        { 
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }
    
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
    
    // Process documents in batches (max 5 at a time to avoid timeouts)
    const batchSize = 5
    const results = []
    
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize)
      const batchResults = await Promise.all(
        batch.map(async (document) => {
          try {
            // Generate embedding for the document content
            const embeddingResponse = await openai.embeddings.create({
              model: 'text-embedding-3-small',
              input: document.content,
            })
            
            const embedding = embeddingResponse.data[0].embedding
            
            // Insert document with embedding into Supabase
            const { data, error } = await supabase
              .from('documents')
              .insert({
                content: document.content,
                metadata: document.metadata,
                embedding
              })
              .select('id')
              .single()
            
            if (error) throw error
            
            return { 
              success: true, 
              id: data.id,
              metadata: document.metadata
            }
          } catch (error) {
            console.error('Error processing document:', error)
            return { 
              success: false, 
              error: error.message,
              metadata: document.metadata
            }
          }
        })
      )
      
      results.push(...batchResults)
    }
    
    // Return the results
    return new Response(
      JSON.stringify({
        success: true,
        inserted: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
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
      JSON.stringify({ error: error.message }),
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

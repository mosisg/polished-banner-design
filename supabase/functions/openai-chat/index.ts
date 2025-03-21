
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

interface ChatCompletionRequest {
  messages: {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }[];
  model: string;
  temperature?: number;
  max_tokens?: number;
  session_id?: string;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get request payload
    const payload: ChatCompletionRequest = await req.json()
    
    // Create Supabase client for logging (optional)
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
    
    // Get OpenAI response
    const { messages, model, temperature = 0.7, max_tokens = 1200, session_id } = payload

    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens,
    })

    const assistantMessage = response.choices[0].message

    // Log completion to Supabase (optional)
    if (session_id) {
      try {
        await supabase.from('ai_completions').insert({
          session_id,
          prompt: JSON.stringify(messages),
          completion: assistantMessage.content,
          model,
          tokens: response.usage?.total_tokens || 0,
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

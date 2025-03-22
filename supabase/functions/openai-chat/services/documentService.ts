
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.26.0'
import { OpenAI } from 'https://esm.sh/openai@4.20.1'
import { Document } from '../types/index.ts'

// Function to find relevant documents based on query
export async function findRelevantDocuments(
  supabase: any,
  query: string,
  limit = 5
): Promise<Document[]> {
  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
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

// Format context documents as system message
export function formatDocumentsAsContext(documents: Document[]): string {
  if (documents.length === 0) return '';
  
  return documents
    .map(doc => `Document: ${doc.metadata.title || 'Untitled'}\n${doc.content}`)
    .join('\n\n');
}

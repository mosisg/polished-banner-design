
/**
 * Document Service
 * Handles document ingestion and retrieval for RAG
 */
import { supabase } from '@/integrations/supabase/client';

interface DocumentMetadata {
  title?: string;
  source?: string;
  category?: string;
  [key: string]: any;
}

interface Document {
  content: string;
  metadata: DocumentMetadata;
}

export interface DocumentItem {
  id: string;
  content: string;
  metadata: DocumentMetadata;
  created_at: string;
}

interface IngestResponse {
  success: boolean;
  inserted: number;
  failed: number;
  results: Array<{
    success: boolean;
    id?: string;
    error?: string;
    metadata: DocumentMetadata;
  }>;
}

/**
 * Ingests documents into the vector database
 */
export async function ingestDocuments(
  documents: Document[]
): Promise<IngestResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('ingest-document', {
      body: { documents },
    });

    if (error) {
      console.error('Error ingesting documents:', error);
      throw new Error(error.message || 'Failed to ingest documents');
    }

    return data as IngestResponse;
  } catch (err) {
    console.error('Error in ingestDocuments:', err);
    throw err;
  }
}

/**
 * Fetches all documents from the database
 */
export async function getDocuments(): Promise<DocumentItem[]> {
  try {
    // Use 'any' assertion to bypass TypeScript error until types are properly generated
    const { data, error } = await (supabase
      .from('documents') as any)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getDocuments:', err);
    throw err;
  }
}

/**
 * Deletes a document from the database
 */
export async function deleteDocument(id: string) {
  try {
    // Use 'any' assertion to bypass TypeScript error until types are properly generated
    const { error } = await (supabase
      .from('documents') as any)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error('Error in deleteDocument:', err);
    throw err;
  }
}

/**
 * Helper function to split a long text into smaller chunks
 * for more effective embedding and retrieval
 */
export function splitTextIntoChunks(
  text: string,
  maxChunkLength = 1500,
  overlap = 200
): string[] {
  if (text.length <= maxChunkLength) {
    return [text];
  }

  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    // Calculate end index
    let endIndex = startIndex + maxChunkLength;
    
    // If we're not at the end of the text, try to find a natural break point
    if (endIndex < text.length) {
      // Look for paragraph, sentence, or space to break at
      const paragraphBreak = text.lastIndexOf('\n\n', endIndex);
      const sentenceBreak = text.lastIndexOf('. ', endIndex);
      const spaceBreak = text.lastIndexOf(' ', endIndex);
      
      // Use the nearest break point that is at least halfway through the chunk
      const minBreakPoint = startIndex + (maxChunkLength / 2);
      if (paragraphBreak > minBreakPoint) {
        endIndex = paragraphBreak + 2; // Include the paragraph break
      } else if (sentenceBreak > minBreakPoint) {
        endIndex = sentenceBreak + 2; // Include the period and space
      } else if (spaceBreak > minBreakPoint) {
        endIndex = spaceBreak + 1; // Include the space
      }
    }

    // Add this chunk to our list
    chunks.push(text.slice(startIndex, endIndex));
    
    // Move start index, accounting for overlap
    startIndex = Math.max(startIndex, endIndex - overlap);
    
    // If we're very close to the end, just include the rest
    if (text.length - startIndex < maxChunkLength / 2) {
      if (startIndex < text.length) {
        chunks.push(text.slice(startIndex));
      }
      break;
    }
  }

  return chunks;
}

/**
 * Prepares a document for ingestion, including splitting it into appropriate chunks
 */
export function prepareDocumentForIngestion(
  content: string,
  metadata: DocumentMetadata
): Document[] {
  const chunks = splitTextIntoChunks(content);
  
  return chunks.map((chunk, index) => ({
    content: chunk,
    metadata: {
      ...metadata,
      chunk_index: index,
      chunk_count: chunks.length
    }
  }));
}

import { supabase } from '@/integrations/supabase/client';

export interface SystemStatus {
  tableExists: boolean;
  functionExists: boolean;
  edgeFunctionsReady: boolean;
  apiKeyConfigured: boolean;
}

export type SystemReadiness = 'ready' | 'partial' | 'not-ready';

export const getSystemReadiness = (status: SystemStatus): SystemReadiness => {
  const { tableExists, functionExists, edgeFunctionsReady, apiKeyConfigured } = status;
  
  if (tableExists && functionExists && edgeFunctionsReady && apiKeyConfigured) {
    return 'ready';
  } else if (tableExists && functionExists) {
    return 'partial';
  } else {
    return 'not-ready';
  }
};

export const checkSystemStatus = async (abortSignal?: AbortSignal): Promise<SystemStatus> => {
  // Initialize status object with default values
  const status: SystemStatus = {
    tableExists: false,
    functionExists: false,
    edgeFunctionsReady: false,
    apiKeyConfigured: false
  };
  
  try {
    // Check if the operation was aborted before starting
    if (abortSignal?.aborted) {
      console.log("Operation aborted before starting");
      return status;
    }
    
    // Verify session is valid before proceeding
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.log("Session invalid or expired:", sessionError);
      return status; // Return early with default status
    }
    
    // Check if documents table exists
    try {
      const { error: tableError } = await supabase
        .from('documents')
        .select('id')
        .limit(1);
      
      if (abortSignal?.aborted) {
        console.log("Table check aborted");
        return status;
      }
      
      status.tableExists = !tableError;
    } catch (err) {
      console.log("Table check error:", err);
      // Keep status.tableExists as false
    }
    
    // Check if search function exists by trying to call it with safe parameters
    try {
      if (abortSignal?.aborted) {
        console.log("Function check aborted before starting");
        return status;
      }
      
      // Create a zero-filled array of length 1536 for the embedding vector
      const zeroEmbedding = JSON.stringify(Array(1536).fill(0));
      
      const { error: functionError } = await supabase.rpc(
        'match_documents',
        { 
          query_embedding: zeroEmbedding,
          match_threshold: 0.0,
          match_count: 1
        }
      );
      
      // Check if the operation was aborted after the call
      if (abortSignal?.aborted) {
        console.log("Function check aborted after call");
        return status;
      }
      
      status.functionExists = !functionError;
    } catch (err) {
      console.log("Function check error:", err);
      // Keep status.functionExists as false
    }
    
    // Check if Edge Functions are deployed
    try {
      if (abortSignal?.aborted) {
        console.log("Edge function check aborted before starting");
        return status;
      }
      
      // Call the edge function with health check parameter
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: { health_check: true }
      });
      
      if (abortSignal?.aborted) {
        console.log("Edge function check aborted after call");
        return status;
      }
      
      if (error) {
        console.log("Edge function error:", error);
        // Keep status values as false
      } else if (data) {
        status.edgeFunctionsReady = data.status === 'ok';
        status.apiKeyConfigured = data.openai_key_configured === true;
      }
    } catch (err) {
      console.log("Edge function invocation error:", err);
      // Keep edgeFunctionsReady and apiKeyConfigured as false
    }
    
  } catch (error) {
    console.error("General error checking system status:", error);
    // Return default status in case of general error
  }
  
  return status;
};

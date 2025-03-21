
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
      console.log("Checking if documents table exists");
      const { data, error: tableError } = await supabase
        .from('documents')
        .select('id')
        .limit(1);
      
      if (abortSignal?.aborted) {
        console.log("Table check aborted");
        return status;
      }
      
      // If we get here without error or with empty data, the table exists
      status.tableExists = !tableError;
      console.log("Documents table check result:", { exists: status.tableExists, error: tableError });
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
      
      // To ensure we're not causing errors with malformed embeddings, 
      // we'll do a simplified check first to see if the function exists
      console.log("Checking if match_documents function exists");
      
      // Modified approach to check function existence
      const { data: functionData, error: functionError } = await supabase
        .rpc('match_documents', { 
          query_embedding: Array(1536).fill(0), 
          match_threshold: 0.0, 
          match_count: 1 
        });
        
      if (abortSignal?.aborted) {
        console.log("Function check aborted after call");
        return status;
      }
      
      // We consider the function exists if there's no error about it not existing
      // This is because the function might return other errors (like wrong param types)
      status.functionExists = !functionError || 
        (functionError && !functionError.message.includes("does not exist") && 
                         !functionError.message.includes("function not found"));
                         
      console.log("Function check result:", { 
        exists: status.functionExists, 
        error: functionError ? functionError.message : null 
      });
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
      
      console.log("Checking if Edge Functions are deployed");
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
        // Consider functions ready even if we get specific errors
        // This is because the function might exist but have issues with the health check
        status.edgeFunctionsReady = !error.message.includes("Function not found");
      } else {
        status.edgeFunctionsReady = true;
        // If we get data back, check if the API key is configured
        if (data) {
          status.apiKeyConfigured = data.openai_key_configured === true;
        }
      }
      
      console.log("Edge function check result:", { 
        ready: status.edgeFunctionsReady, 
        apiKeyConfigured: status.apiKeyConfigured 
      });
    } catch (err) {
      console.log("Edge function invocation error:", err);
      // Keep edgeFunctionsReady and apiKeyConfigured as false
    }
    
  } catch (error) {
    console.error("General error checking system status:", error);
    // Return default status in case of general error
  }
  
  console.log("Final system status:", status);
  return status;
};

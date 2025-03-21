
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
  // Verify session is valid before proceeding
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !sessionData.session) {
    throw new Error("Session invalide ou expirée. Veuillez vous reconnecter.");
  }
  
  // Initialize status object
  const status: SystemStatus = {
    tableExists: false,
    functionExists: false,
    edgeFunctionsReady: false,
    apiKeyConfigured: false
  };
  
  // Check if documents table exists
  try {
    const { data: tableData, error: tableError } = await supabase
      .from('documents')
      .select('id')
      .limit(1);
    
    status.tableExists = !tableError;
  } catch (err) {
    console.log("Table check error:", err);
    status.tableExists = false;
  }
  
  // Check if search function exists by trying to call it with safe parameters
  try {
    const { data: functionData, error: functionError } = await supabase.rpc(
      'match_documents',
      { 
        query_embedding: Array(1536).fill(0),
        match_threshold: 0.0,
        match_count: 1
      }
    );
    
    status.functionExists = !functionError;
  } catch (err) {
    console.log("Function check error:", err);
    status.functionExists = false;
  }
  
  // Check if Edge Functions are deployed
  try {
    // Create an object that wraps the options and abortSignal
    const invokeOptions = { body: { health_check: true } };
    
    // If abortSignal exists, create a fetch controller to handle it
    let controller: AbortController | undefined;
    if (abortSignal) {
      controller = new AbortController();
      // Forward the abort signal
      abortSignal.addEventListener('abort', () => {
        controller?.abort();
      });
    }
    
    const response = await supabase.functions.invoke(
      'openai-chat',
      invokeOptions,
      // Use the controller's signal if available
      controller ? { fetcher: fetch, abortController: controller } : undefined
    );
    
    if (response.error) {
      console.log("Edge function error:", response.error);
      status.edgeFunctionsReady = false;
      status.apiKeyConfigured = false;
    } else {
      const healthCheck = response.data;
      status.edgeFunctionsReady = healthCheck?.status === 'ok';
      status.apiKeyConfigured = healthCheck?.openai_key_configured === true;
    }
  } catch (err) {
    console.log("Edge function invocation error:", err);
    status.edgeFunctionsReady = false;
    status.apiKeyConfigured = false;
  }
  
  return status;
};

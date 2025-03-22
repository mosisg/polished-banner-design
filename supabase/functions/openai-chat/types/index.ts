
export interface ChatCompletionRequest {
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

export interface Document {
  id: string;
  content: string;
  metadata: Record<string, any>;
}

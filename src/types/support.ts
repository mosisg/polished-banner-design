
/**
 * Support Chat Types
 */

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  usedContext?: boolean;
}

export interface SupportChatState {
  messages: ChatMessage[];
  inputText: string;
  setInputText: (text: string) => void;
  sendMessage: () => void;
  isTyping: boolean;
  messageEndRef: React.RefObject<HTMLDivElement>;
  useRAG: boolean;
  toggleRAG: () => void;
}


/**
 * Support Chat Types
 */

export interface DocumentReference {
  id: string;
  title: string;
  excerpt: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  usedContext?: boolean;
  documentReferences?: DocumentReference[];
}

export type MessageStatus = 'none' | 'sent' | 'delivered' | 'read';

export interface SupportChatState {
  messages: ChatMessage[];
  inputText: string;
  setInputText: (text: string) => void;
  sendMessage: () => void;
  isTyping: boolean;
  messageEndRef: React.RefObject<HTMLDivElement>;
  useRAG: boolean;
  toggleRAG: () => void;
  lastMessageStatus: MessageStatus;
}

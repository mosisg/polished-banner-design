
import React, { createContext, useContext, useReducer, ReactNode, useRef } from 'react';
import { ChatMessage, MessageStatus, DocumentReference } from '@/types/support';
import { throttle } from '@/utils/performance';

// Define the chat state interface
interface ChatState {
  messages: ChatMessage[];
  inputText: string;
  sessionId: string;
  isTyping: boolean;
  hasOpenAIFailed: boolean;
  useRAG: boolean;
  lastMessageStatus: MessageStatus;
  isConnectedToOpenAI: boolean;
  retryCount: number;
}

// Define action types
type ChatAction =
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'ADD_USER_MESSAGE'; payload: ChatMessage }
  | { type: 'ADD_BOT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_INPUT_TEXT'; payload: string }
  | { type: 'SET_SESSION_ID'; payload: string }
  | { type: 'SET_IS_TYPING'; payload: boolean }
  | { type: 'SET_OPENAI_FAILED'; payload: boolean }
  | { type: 'TOGGLE_RAG' }
  | { type: 'SET_MESSAGE_STATUS'; payload: MessageStatus }
  | { type: 'SET_OPENAI_CONNECTED'; payload: boolean }
  | { type: 'INCREMENT_RETRY_COUNT' };

// Initial state
const initialState: ChatState = {
  messages: [
    {
      id: '1',
      text: 'Bonjour ! Je suis votre assistant virtuel ComparePrix. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ],
  inputText: '',
  sessionId: '',
  isTyping: false,
  hasOpenAIFailed: false,
  useRAG: true,
  lastMessageStatus: 'none',
  isConnectedToOpenAI: true,
  retryCount: 0
};

// Create reducer
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_USER_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload], lastMessageStatus: 'sent' };
    case 'ADD_BOT_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_INPUT_TEXT':
      return { ...state, inputText: action.payload };
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload };
    case 'SET_IS_TYPING':
      return { ...state, isTyping: action.payload };
    case 'SET_OPENAI_FAILED':
      return { ...state, hasOpenAIFailed: action.payload };
    case 'TOGGLE_RAG':
      return { ...state, useRAG: !state.useRAG };
    case 'SET_MESSAGE_STATUS':
      return { ...state, lastMessageStatus: action.payload };
    case 'SET_OPENAI_CONNECTED':
      return { ...state, isConnectedToOpenAI: action.payload };
    case 'INCREMENT_RETRY_COUNT':
      return { ...state, retryCount: state.retryCount + 1 };
    default:
      return state;
  }
}

// Create context with additional refs and functions
interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  messageEndRef: React.RefObject<HTMLDivElement>;
  previousMessagesRef: React.RefObject<ChatMessage[]>;
  conversationContextRef: React.RefObject<string[]>;
  updateBotTyping: (isTyping: boolean) => void;
  addUserMessage: (text: string, sessionId: string) => ChatMessage;
  addBotMessage: (text: string, sessionId: string, usedContext?: boolean, documentReferences?: DocumentReference[]) => ChatMessage;
}

const SupportChatContext = createContext<ChatContextType | undefined>(undefined);

// Create provider
export const SupportChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const previousMessagesRef = useRef<ChatMessage[]>([]);
  const conversationContextRef = useRef<string[]>([]);

  // Create a throttled version of the typing indicator update
  const updateBotTyping = throttle((isTyping: boolean) => {
    dispatch({ type: 'SET_IS_TYPING', payload: isTyping });
  }, 500);

  // Add a user message to the conversation
  const addUserMessage = (text: string, sessionId: string): ChatMessage => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    
    dispatch({ type: 'ADD_USER_MESSAGE', payload: userMessage });
    
    // Update previous messages reference
    const newMessages = [...state.messages, userMessage];
    previousMessagesRef.current = newMessages;
    
    // Scroll to bottom
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Store this message for context
    conversationContextRef.current.push(`User: ${text}`);
    
    // Set message status to delivered after a delay
    setTimeout(() => {
      dispatch({ type: 'SET_MESSAGE_STATUS', payload: 'delivered' });
    }, 500);
    
    return userMessage;
  };

  // Add a bot message to the conversation
  const addBotMessage = (text: string, sessionId: string, usedContext?: boolean, documentReferences?: DocumentReference[]): ChatMessage => {
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: text,
      sender: 'bot',
      timestamp: new Date(),
      usedContext,
      documentReferences
    };
    
    dispatch({ type: 'ADD_BOT_MESSAGE', payload: botMessage });
    
    // Update previous messages reference
    const newMessages = [...state.messages, botMessage];
    previousMessagesRef.current = newMessages;
    
    // Scroll to bottom
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Store the AI response for context
    conversationContextRef.current.push(`Assistant: ${text}`);
    
    return botMessage;
  };

  return (
    <SupportChatContext.Provider value={{ 
      state, 
      dispatch, 
      messageEndRef, 
      previousMessagesRef, 
      conversationContextRef,
      updateBotTyping,
      addUserMessage,
      addBotMessage
    }}>
      {children}
    </SupportChatContext.Provider>
  );
};

// Create hook to use the context
export const useSupportChatContext = () => {
  const context = useContext(SupportChatContext);
  if (context === undefined) {
    throw new Error('useSupportChatContext must be used within a SupportChatProvider');
  }
  return context;
};


import { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { throttle } from '@/utils/performance';
import { ChatMessage, MessageStatus } from '@/types/support';
import { saveChatMessage } from '@/services/support/sessionService';

export const useMessageHandling = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis votre assistant virtuel ComparePrix. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastMessageStatus, setLastMessageStatus] = useState<MessageStatus>('none');
  const previousMessagesRef = useRef<ChatMessage[]>([]);
  const conversationContextRef = useRef<string[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Create a throttled version of the typing indicator update
  const updateBotTyping = throttle((isTyping: boolean) => {
    setIsTyping(isTyping);
  }, 500);

  // Update previous messages reference and scroll to bottom when messages change
  const updatePreviousMessagesAndScroll = (newMessages: ChatMessage[]) => {
    previousMessagesRef.current = newMessages;
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Add a user message to the conversation
  const addUserMessage = (text: string, sessionId: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    updatePreviousMessagesAndScroll(newMessages);
    setLastMessageStatus('sent');
    
    // Store this message for context
    conversationContextRef.current.push(`User: ${text}`);
    
    // Try to save the message and handle potential errors silently
    saveChatMessage(sessionId, text, false).catch(console.error);

    setTimeout(() => {
      setLastMessageStatus('delivered');
    }, 500);
    
    return userMessage;
  };

  // Add a bot message to the conversation
  const addBotMessage = (text: string, sessionId: string, usedContext?: boolean, documentReferences?: any[]) => {
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: text,
      sender: 'bot',
      timestamp: new Date(),
      usedContext,
      documentReferences
    };
    
    const newMessages = [...messages, botMessage];
    setMessages(newMessages);
    updatePreviousMessagesAndScroll(newMessages);
    
    // Store the AI response for context
    conversationContextRef.current.push(`Assistant: ${text}`);
    
    // Save the bot message
    saveChatMessage(sessionId, text, true).catch(console.error);
    
    return botMessage;
  };

  return {
    messages,
    inputText,
    setInputText,
    isTyping,
    lastMessageStatus,
    messageEndRef,
    previousMessagesRef,
    conversationContextRef,
    updateBotTyping,
    addUserMessage,
    addBotMessage,
    setIsTyping,
    setLastMessageStatus
  };
};

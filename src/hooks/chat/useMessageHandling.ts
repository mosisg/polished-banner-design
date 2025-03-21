
import { saveChatMessage } from '@/services/support/sessionService';
import { useSupportChatContext } from '@/contexts/SupportChatContext';

export const useMessageHandling = () => {
  const { 
    state, 
    dispatch, 
    messageEndRef, 
    previousMessagesRef,
    conversationContextRef,
    updateBotTyping,
    addUserMessage: contextAddUserMessage,
    addBotMessage: contextAddBotMessage
  } = useSupportChatContext();
  
  const { messages, inputText, isTyping, lastMessageStatus } = state;

  // Add a user message with side effects (saving to service)
  const addUserMessage = (text: string, sessionId: string) => {
    const message = contextAddUserMessage(text, sessionId);
    
    // Try to save the message and handle potential errors silently
    saveChatMessage(sessionId, text, false).catch(console.error);
    
    return message;
  };

  // Add a bot message with side effects (saving to service)
  const addBotMessage = (text: string, sessionId: string, usedContext?: boolean, documentReferences?: any[]) => {
    const message = contextAddBotMessage(text, sessionId, usedContext, documentReferences);
    
    // Save the bot message
    saveChatMessage(sessionId, text, true).catch(console.error);
    
    return message;
  };

  return {
    messages,
    inputText,
    setInputText: (text: string) => dispatch({ type: 'SET_INPUT_TEXT', payload: text }),
    isTyping,
    lastMessageStatus,
    messageEndRef,
    previousMessagesRef,
    conversationContextRef,
    updateBotTyping,
    addUserMessage,
    addBotMessage,
    setIsTyping: (typing: boolean) => dispatch({ type: 'SET_IS_TYPING', payload: typing }),
    setLastMessageStatus: (status: 'none' | 'sent' | 'delivered' | 'read') => 
      dispatch({ type: 'SET_MESSAGE_STATUS', payload: status })
  };
};

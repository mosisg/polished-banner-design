
import { saveChatMessage } from '@/services/support/sessionService';
import { useSupportChatContext } from '@/contexts/SupportChatContext';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  // Add a user message with side effects (saving to service)
  const addUserMessage = (text: string, sessionId: string) => {
    const message = contextAddUserMessage(text, sessionId);
    
    // Try to save the message and handle potential errors
    saveChatMessage(sessionId, text, false)
      .catch(error => {
        console.error('Failed to save user message:', error);
        toast({
          title: "Erreur de sauvegarde",
          description: "Votre message n'a pas pu être sauvegardé, mais la conversation continue.",
          variant: "destructive"
        });
      });
    
    return message;
  };

  // Add a bot message with side effects (saving to service)
  const addBotMessage = (text: string, sessionId: string, usedContext?: boolean, documentReferences?: any[]) => {
    // Deduplicate consecutive identical bot messages
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'bot' && lastMessage.text === text) {
        console.log('Prevented duplicate bot message');
        return lastMessage; // Return existing message instead of creating a duplicate
      }
    }
    
    const message = contextAddBotMessage(text, sessionId, usedContext, documentReferences);
    
    // Save the bot message
    saveChatMessage(sessionId, text, true)
      .catch(error => {
        console.error('Failed to save bot message:', error);
      });
    
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

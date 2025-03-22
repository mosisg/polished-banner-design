
import { useToast } from '@/hooks/use-toast';
import { SupportChatState } from '@/types/support';
import { getOpenAIResponse } from '@/services/support/openAiService';
import { getSmartResponse } from '@/services/support/smartResponseService';
import { useChatSession } from './chat/useChatSession';
import { useOpenAIConnection } from './chat/useOpenAIConnection';
import { useMessageHandling } from './chat/useMessageHandling';
import { useRAGToggle } from './chat/useRAGToggle';
import { useSupportChatContext } from '@/contexts/SupportChatContext';

export type { ChatMessage } from '@/types/support';

// Proper implementation of the hook that uses the context
export const useSupportChat = (): SupportChatState => {
  const { state, conversationContextRef } = useSupportChatContext();
  const { sessionId } = useChatSession();
  const { 
    isConnectedToOpenAI, 
    hasOpenAIFailed, 
    setIsConnectedToOpenAI, 
    setHasOpenAIFailed,
    incrementRetryCount,
    resetRetryCount
  } = useOpenAIConnection();
  const { 
    messages, 
    inputText, 
    setInputText, 
    isTyping, 
    lastMessageStatus, 
    messageEndRef,
    previousMessagesRef,
    updateBotTyping,
    addUserMessage,
    addBotMessage,
    setIsTyping
  } = useMessageHandling();
  const { useRAG, toggleRAG } = useRAGToggle();
  const { toast } = useToast();

  const sendMessage = async () => {
    const trimmedInput = inputText.trim();
    if (!trimmedInput) return;
    
    // Add user message to the conversation
    addUserMessage(trimmedInput, sessionId);
    setInputText('');
    
    // Indicate bot is typing
    setIsTyping(true);
    
    try {
      // Reset failed state if this is a retry after multiple failures
      if (hasOpenAIFailed && isConnectedToOpenAI) {
        setHasOpenAIFailed(false);
      }
      
      const { text: aiResponse, usedContext, documentReferences } = 
        await getOpenAIResponse(trimmedInput, previousMessagesRef.current, sessionId, useRAG);
      
      // Update UI states
      updateBotTyping(false);
      setIsConnectedToOpenAI(true);
      setHasOpenAIFailed(false);
      resetRetryCount();
      
      // Add bot message to the conversation
      addBotMessage(aiResponse, sessionId, usedContext, documentReferences);
      
      // Show toast for context usage if relevant
      if (usedContext) {
        toast({
          title: "Contextualisation activée",
          description: documentReferences ? 
            `${documentReferences.length} document(s) utilisé(s) pour enrichir la réponse` : 
            "La réponse a été enrichie avec des informations spécifiques",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("OpenAI response error:", error);
      updateBotTyping(false);
      setIsConnectedToOpenAI(false);
      setHasOpenAIFailed(true);
      
      // Generate a contextual fallback response based on conversation history
      const conversationContext = conversationContextRef.current.join("\n");
      const fallbackPrompt = `${conversationContext}\nUser: ${trimmedInput}`;
      
      // Get a smart response that tries to maintain context
      const fallbackResponse = getSmartResponse(trimmedInput, fallbackPrompt);
      
      // Add bot message with fallback response
      addBotMessage(fallbackResponse, sessionId);
      
      // Only show the toast if this is the first failure
      if (!hasOpenAIFailed) {
        toast({
          title: "Problème de connexion",
          description: "Impossible de se connecter au service intelligent. Un mode limité est utilisé.",
          variant: "destructive"
        });
      }
      
      // Increment retry count
      incrementRetryCount();
    }
  };

  return {
    messages,
    inputText,
    setInputText,
    sendMessage,
    isTyping,
    messageEndRef,
    useRAG,
    toggleRAG,
    lastMessageStatus,
    isConnectedToOpenAI
  };
};

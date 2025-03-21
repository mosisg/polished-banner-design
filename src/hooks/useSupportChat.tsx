
import { useToast } from '@/hooks/use-toast';
import { SupportChatState } from '@/types/support';
import { getOpenAIResponse } from '@/services/support/openAiService';
import { getSmartResponse } from '@/services/support/smartResponseService';
import { useChatSession } from './chat/useChatSession';
import { useOpenAIConnection } from './chat/useOpenAIConnection';
import { useMessageHandling } from './chat/useMessageHandling';
import { useRAGToggle } from './chat/useRAGToggle';
import { SupportChatProvider, useSupportChatContext } from '@/contexts/SupportChatContext';

export type { ChatMessage } from '@/types/support';

// Inner hook that uses the context
const useSupportChatInner = (): SupportChatState => {
  const { state, conversationContextRef } = useSupportChatContext();
  const { sessionId } = useChatSession();
  const { 
    isConnectedToOpenAI, 
    hasOpenAIFailed, 
    setIsConnectedToOpenAI, 
    setHasOpenAIFailed,
    incrementRetryCount 
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
    if (!inputText.trim()) return;
    
    // Add user message to the conversation
    addUserMessage(inputText, sessionId);
    setInputText('');
    
    setIsTyping(true);
    
    try {
      if (hasOpenAIFailed) {
        throw new Error("Using fallback due to previous OpenAI failure");
      }
      
      const { text: aiResponse, usedContext, documentReferences } = 
        await getOpenAIResponse(inputText, previousMessagesRef.current, sessionId, useRAG);
      
      updateBotTyping(false);
      setIsConnectedToOpenAI(true);
      setHasOpenAIFailed(false);
      
      // Add bot message to the conversation
      addBotMessage(aiResponse, sessionId, usedContext, documentReferences);
      
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
      const fallbackPrompt = `${conversationContext}\nUser: ${inputText}\nAssistant:`;
      
      // Get a smart response that tries to maintain context
      const fallbackResponse = getSmartResponse(inputText, fallbackPrompt);
      
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

// Wrapper hook that provides the context
export const useSupportChat = (): SupportChatState => {
  return (
    <SupportChatProvider>
      <SupportChatConsumer />
    </SupportChatProvider>
  );
};

// Consumer component to use the context
const SupportChatConsumer = () => {
  const chatState = useSupportChatInner();
  return chatState;
};

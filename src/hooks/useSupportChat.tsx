
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { throttle } from '@/utils/performance';
import { ChatMessage, SupportChatState, MessageStatus } from '@/types/support';
import { createChatSession, saveChatMessage } from '@/services/support/sessionService';
import { getOpenAIResponse } from '@/services/support/openAiService';
import { getSmartResponse } from '@/services/support/smartResponseService';

export type { ChatMessage } from '@/types/support';

export const useSupportChat = (): SupportChatState => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis votre assistant virtuel ComparePrix. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasOpenAIFailed, setHasOpenAIFailed] = useState(false);
  const [useRAG, setUseRAG] = useState(true);
  const [lastMessageStatus, setLastMessageStatus] = useState<MessageStatus>('none');
  const [isConnectedToOpenAI, setIsConnectedToOpenAI] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const previousMessagesRef = useRef<ChatMessage[]>([]);
  const conversationContextRef = useRef<string[]>([]);

  useEffect(() => {
    const initSession = async () => {
      try {
        const newSessionId = await createChatSession();
        setSessionId(newSessionId);
      } catch (err) {
        console.error("Failed to initialize session:", err);
        // Generate a local ID for fallback
        setSessionId(uuidv4());
      }
    };
    
    initSession();
    
    // Test OpenAI connectivity on start
    const testOpenAIConnection = async () => {
      try {
        // Just create a simple ping message that won't be displayed
        const testResponse = await getOpenAIResponse("ping", [], sessionId, false);
        setIsConnectedToOpenAI(true);
        setHasOpenAIFailed(false);
      } catch (err) {
        console.error("Failed to connect to OpenAI:", err);
        setIsConnectedToOpenAI(false);
        setHasOpenAIFailed(true);
      }
    };
    
    testOpenAIConnection();
  }, []);

  const updateBotTyping = throttle((isTyping: boolean) => {
    setIsTyping(isTyping);
  }, 500);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    previousMessagesRef.current = messages;
  }, [messages]);
  
  // Add this new effect to periodically retry OpenAI connection if it fails
  useEffect(() => {
    // Only retry if we've previously had a failure
    if (hasOpenAIFailed && retryCount < 3) {
      const retryTimeout = setTimeout(async () => {
        try {
          const testResponse = await getOpenAIResponse("ping", [], sessionId, false);
          console.log("Successfully reconnected to OpenAI");
          setIsConnectedToOpenAI(true);
          setHasOpenAIFailed(false);
          
          toast({
            title: "Connexion rétablie",
            description: "La connexion au service intelligent a été rétablie.",
            variant: "default"
          });
        } catch (err) {
          console.error("Failed to reconnect to OpenAI:", err);
          setRetryCount(prev => prev + 1);
        }
      }, 30000); // Try every 30 seconds
      
      return () => clearTimeout(retryTimeout);
    }
  }, [hasOpenAIFailed, retryCount, sessionId, toast]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLastMessageStatus('sent');
    
    // Store this message for context
    conversationContextRef.current.push(`User: ${inputText}`);
    
    // Try to save the message and handle potential errors silently
    saveChatMessage(sessionId, inputText, false).catch(console.error);

    setTimeout(() => {
      setLastMessageStatus('delivered');
    }, 500);
    
    setIsTyping(true);
    
    try {
      if (hasOpenAIFailed) {
        throw new Error("Using fallback due to previous OpenAI failure");
      }
      
      const { text: aiResponse, usedContext, documentReferences } = 
        await getOpenAIResponse(userMessage.text, previousMessagesRef.current, sessionId, useRAG);
      
      updateBotTyping(false);
      setIsConnectedToOpenAI(true);
      setHasOpenAIFailed(false);
      
      // Store the AI response for context
      conversationContextRef.current.push(`Assistant: ${aiResponse}`);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date(),
        usedContext,
        documentReferences
      };
      
      setMessages(prev => [...prev, botMessage]);
      saveChatMessage(sessionId, aiResponse, true).catch(console.error);
      
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
      const fallbackPrompt = `${conversationContext}\nUser: ${userMessage.text}\nAssistant:`;
      
      // Get a smart response that tries to maintain context
      const fallbackResponse = getSmartResponse(userMessage.text, fallbackPrompt);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      saveChatMessage(sessionId, fallbackResponse, true).catch(console.error);
      
      // Store the fallback response for context
      conversationContextRef.current.push(`Assistant: ${fallbackResponse}`);
      
      // Only show the toast if this is the first failure
      if (retryCount === 0) {
        toast({
          title: "Problème de connexion",
          description: "Impossible de se connecter au service intelligent. Un mode limité est utilisé.",
          variant: "destructive"
        });
      }
      
      // Increment retry count
      setRetryCount(prev => prev + 1);
    }
  };

  const toggleRAG = () => {
    setUseRAG(prev => !prev);
    toast({
      title: useRAG ? "Mode base de connaissances désactivé" : "Mode base de connaissances activé",
      description: useRAG ? "Les réponses ne seront plus enrichies par votre base de connaissances." : "Les réponses seront enrichies par votre base de connaissances.",
      variant: "default"
    });
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

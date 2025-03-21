
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
  const { toast } = useToast();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const previousMessagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    const initSession = async () => {
      const newSessionId = await createChatSession();
      setSessionId(newSessionId);
    };
    
    initSession();
  }, []);

  const updateBotTyping = throttle((isTyping: boolean) => {
    setIsTyping(isTyping);
  }, 500);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    previousMessagesRef.current = messages;
  }, [messages]);

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
    
    // Try to save the message and handle potential errors silently
    saveChatMessage(sessionId, inputText, false).catch(console.error);

    setTimeout(() => {
      setLastMessageStatus('delivered');
    }, 500);
    
    setIsTyping(true);
    
    try {
      const { text: aiResponse, usedContext, documentReferences } = hasOpenAIFailed 
        ? { text: getSmartResponse(userMessage.text), usedContext: false }
        : await getOpenAIResponse(userMessage.text, previousMessagesRef.current, sessionId, useRAG);
      
      updateBotTyping(false);
      
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
      updateBotTyping(false);
      
      const fallbackResponse = getSmartResponse(userMessage.text);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      saveChatMessage(sessionId, fallbackResponse, true).catch(console.error);
      
      toast({
        title: "Problème de connexion",
        description: "Impossible de se connecter au service intelligent. Un mode limité est utilisé.",
        variant: "destructive"
      });
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
    lastMessageStatus
  };
};

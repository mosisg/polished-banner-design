
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { getChatCompletion, getAssistantSystemMessage } from '@/services/openai/client';
import { throttle } from '@/utils/performance';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const useSupportChat = () => {
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
  const { toast } = useToast();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const previousMessagesRef = useRef<ChatMessage[]>([]);

  // Initialize session
  useEffect(() => {
    const createSession = async () => {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      
      try {
        // Create a new session in Supabase
        const { error } = await supabase
          .from('support_sessions')
          .insert([
            { id: newSessionId, status: 'active' }
          ]);
        
        if (error) {
          console.error('Error creating chat session:', error);
          // Continue without showing error toast - chat will work in local mode
        }
      } catch (err) {
        console.error('Failed to create session:', err);
        // Continue without error notification
      }
    };
    
    createSession();
  }, []);

  // Save message to Supabase
  const saveMessage = async (message: string, isBot: boolean) => {
    if (!sessionId) return;
    
    try {
      const { error } = await supabase
        .from('support_messages')
        .insert([
          { 
            session_id: sessionId,
            is_bot: isBot,
            message: message
          }
        ]);
      
      if (error) {
        console.error('Error saving chat message:', error);
        // Continue without showing error
      }
    } catch (err) {
      console.error('Failed to save message:', err);
      // Continue without error notification
    }
  };

  // Throttled function to avoid too many state updates
  const updateBotTyping = throttle((isTyping: boolean) => {
    setIsTyping(isTyping);
  }, 500);

  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    previousMessagesRef.current = messages;
  }, [messages]);

  // Enhanced AI assistant
  const getSmartResponse = (userMessage: string): string => {
    // Convert user message to lowercase for easier matching
    const message = userMessage.toLowerCase();
    
    // Mobile plan categories
    if (message.includes('forfait') || message.includes('mobile') || message.includes('téléphone')) {
      if (message.includes('pas cher') || message.includes('économique') || message.includes('moins cher')) {
        return "Pour les forfaits économiques, je vous recommande de consulter les offres de Free ou RED by SFR qui proposent souvent des forfaits à moins de 10€/mois. Vous pouvez comparer toutes les offres sur notre page de comparaison de forfaits.";
      }
      if (message.includes('data') || message.includes('internet') || message.includes('go') || message.includes('giga')) {
        return "Pour les forfaits avec beaucoup de data, les offres de Free (150Go) et SFR (100Go et plus) sont généralement intéressantes. Consultez notre comparateur pour voir les meilleures offres du moment en fonction de vos besoins en data.";
      }
      if (message.includes('étranger') || message.includes('europe') || message.includes('international') || message.includes('voyage')) {
        return "Pour une utilisation à l'étranger, les forfaits de Orange, SFR et Bouygues incluent généralement l'Europe. Free propose de la data utilisable dans plus de 100 destinations avec son forfait à 19,99€. Je vous conseille de consulter notre comparateur de forfaits pour plus de détails.";
      }
      return "Nous proposons un comparateur complet de forfaits mobiles. Vous pouvez filtrer selon vos besoins (data, prix, opérateur) sur notre page dédiée. Souhaitez-vous des conseils sur un type de forfait particulier?";
    }
    
    // Internet box categories
    if (message.includes('box') || message.includes('internet') || message.includes('fibre') || message.includes('adsl')) {
      if (message.includes('fibre')) {
        return "Pour la fibre optique, les offres sont généralement entre 30€ et 50€ par mois. Free propose sa Freebox à partir de 29,99€/mois, Orange a sa Livebox Fibre à partir de 39,99€/mois. Pour trouver l'offre idéale, utilisez notre comparateur de box internet qui vous permet de filtrer selon vos critères.";
      }
      if (message.includes('tv') || message.includes('télé') || message.includes('television')) {
        return "Pour les box avec de bonnes options TV, je recommande les offres de SFR et Orange qui proposent de nombreuses chaînes et des décodeurs 4K. Les offres Freebox incluent également des services de streaming. Consultez notre comparateur pour voir les détails des bouquets TV inclus dans chaque offre.";
      }
      if (message.includes('sans engagement') || message.includes('engagement')) {
        return "Pour les box sans engagement, regardez du côté de Free et de RED by SFR qui proposent des offres sans condition de durée. Notre comparateur vous permet de filtrer les offres sans engagement.";
      }
      return "Notre site vous permet de comparer toutes les box internet des principaux fournisseurs. Vous pouvez filtrer par type de connexion (ADSL/Fibre), débit, prix et options TV. Avez-vous des préférences particulières pour votre box internet?";
    }
    
    // Smartphone questions
    if (message.includes('smartphone') || message.includes('iphone') || message.includes('samsung') || message.includes('xiaomi') || message.includes('android')) {
      return "Nous proposons un comparateur de smartphones qui vous permet de trouver le téléphone idéal selon votre budget et vos besoins. Vous pouvez comparer les caractéristiques techniques et les meilleurs prix du marché. Souhaitez-vous des conseils pour un modèle particulier?";
    }
    
    // Website information
    if (message.includes('comment') && message.includes('fonctionne')) {
      return "Notre site ComparePrix vous permet de comparer les offres de forfaits mobiles, box internet et smartphones. Nous récupérons les informations directement auprès des opérateurs pour vous fournir des comparaisons à jour. Vous pouvez filtrer les offres selon vos critères et être redirigé vers le site de l'opérateur pour souscrire.";
    }
    
    // Comparison method questions
    if (message.includes('comparer') || message.includes('comparaison')) {
      return "Notre site vous permet de comparer facilement les offres en utilisant des filtres personnalisés. Vous pouvez ajuster les critères comme le prix, la quantité de data, les options, etc. Les résultats sont mis à jour quotidiennement pour vous garantir les informations les plus récentes. Vous pouvez accéder à nos comparateurs depuis le menu principal.";
    }
    
    // Default response
    return "Je peux vous aider à trouver les meilleures offres de forfaits mobiles, box internet ou smartphones. N'hésitez pas à me poser des questions précises sur vos besoins, ou à utiliser directement nos comparateurs accessibles depuis la page d'accueil. Puis-je vous aider sur un sujet particulier?";
  };

  // Get OpenAI response
  const getOpenAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Prepare conversation history for OpenAI
      const systemMessage = getAssistantSystemMessage();
      
      // Convert previous messages to OpenAI format (exclude the first welcome message)
      const chatHistory = previousMessagesRef.current.slice(1).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      } as const));
      
      // Add current user message
      const aiMessages = [
        systemMessage,
        ...chatHistory,
        { role: 'user', content: userMessage } as const
      ];
      
      // Get response from OpenAI
      const response = await getChatCompletion(aiMessages, { 
        sessionId, 
        model: 'gpt-4-turbo',
        temperature: 0.7
      });
      
      return response.message.content;
    } catch (error) {
      console.error('Error getting OpenAI response:', error);
      setHasOpenAIFailed(true);
      
      // Fallback to rule-based responses
      return getSmartResponse(userMessage);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    saveMessage(inputText, false).catch(console.error);
    setInputText('');
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Get response from OpenAI or fallback
      const aiResponse = hasOpenAIFailed 
        ? getSmartResponse(userMessage.text)
        : await getOpenAIResponse(userMessage.text);
      
      // Hide typing indicator
      updateBotTyping(false);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      saveMessage(aiResponse, true).catch(console.error);
    } catch (error) {
      // In case of error, use fallback and show toast
      updateBotTyping(false);
      
      const fallbackResponse = getSmartResponse(userMessage.text);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      saveMessage(fallbackResponse, true).catch(console.error);
      
      toast({
        title: "Problème de connexion",
        description: "Impossible de se connecter au service intelligent. Un mode limité est utilisé.",
        variant: "destructive"
      });
    }
  };
  
  return {
    messages,
    inputText,
    setInputText,
    sendMessage,
    isTyping,
    messageEndRef
  };
};


import React, { useState } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface CustomerSupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const CustomerSupportChat: React.FC<CustomerSupportChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  
  // Demo responses for the chatbot
  const botResponses = [
    "Je suis là pour vous aider à trouver le forfait mobile idéal pour vos besoins.",
    "Vous pouvez comparer les offres de différents opérateurs sur notre site.",
    "Nous proposons également des comparatifs de box internet et de téléphones mobiles.",
    "Avez-vous des critères spécifiques pour votre forfait mobile (data, budget, engagement) ?",
    "N'hésitez pas à utiliser notre outil de comparaison pour trouver les meilleures offres.",
    "Je vous recommande de consulter notre section blog pour des conseils sur le choix de votre forfait."
  ];
  
  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md p-0 flex flex-col h-full">
        <SheetHeader className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span>Assistance ComparePrix</span>
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[80%] rounded-lg p-3 
                    ${message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted/50 border border-border'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.sender === 'bot' ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span className="text-xs font-medium">
                      {message.sender === 'user' ? 'Vous' : 'Assistant'}
                    </span>
                  </div>
                  <p>{message.text}</p>
                  <div className="text-right">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <Separator />
        
        <SheetFooter className="p-4 mt-0">
          <div className="flex w-full gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez votre message..."
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            />
            <Button onClick={sendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CustomerSupportChat;

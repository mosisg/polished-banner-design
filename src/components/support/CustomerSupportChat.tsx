
import React, { useEffect } from 'react';
import { X, Send, Bot, User, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { useSupportChat } from '@/hooks/useSupportChat';
import { cn } from '@/lib/utils';

interface CustomerSupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomerSupportChat: React.FC<CustomerSupportChatProps> = ({ isOpen, onClose }) => {
  const { messages, inputText, setInputText, sendMessage, isTyping, messageEndRef } = useSupportChat();
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Autofocus le champ de texte quand le chat s'ouvre
  useEffect(() => {
    if (isOpen) {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        setTimeout(() => {
          textarea.focus();
        }, 100);
      }
    }
  }, [isOpen]);
  
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
                  className={cn(
                    "max-w-[85%] rounded-lg p-3 shadow-sm", 
                    message.sender === 'user' 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-muted/50 border border-border rounded-tl-none"
                  )}
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
                    {message.sender === 'bot' && (
                      <div className="ml-auto flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-primary">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-destructive">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="whitespace-pre-line text-sm">{message.text}</p>
                  <div className="text-right">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-lg p-3 bg-muted/50 border border-border rounded-tl-none">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span className="text-xs font-medium">Assistant</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">En train d'écrire...</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Element for auto scroll */}
            <div ref={messageEndRef} />
          </div>
        </ScrollArea>
        
        <Separator />
        
        <SheetFooter className="p-4 mt-0">
          <div className="flex w-full gap-2">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez votre message..."
              className="flex-1 min-h-[80px] max-h-[120px] resize-none"
              rows={2}
            />
            <Button 
              onClick={sendMessage} 
              size="icon" 
              className="self-end h-10 w-10"
              disabled={!inputText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="w-full text-xs text-muted-foreground mt-2">
            Appuyez sur <kbd className="px-1 bg-muted rounded">Entrée</kbd> pour envoyer, <kbd className="px-1 bg-muted rounded">Maj+Entrée</kbd> pour une nouvelle ligne
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CustomerSupportChat;

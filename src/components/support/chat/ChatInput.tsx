
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  sendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  setInputText,
  sendMessage,
  handleKeyDown
}) => {
  return (
    <>
      <Separator className="dark:bg-slate-700" />
      <div className="bg-background dark:bg-slate-900 p-3">
        <div className="flex w-full gap-2">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écrivez votre message..."
            className="flex-1 min-h-[50px] max-h-[80px] resize-none focus-visible:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 shadow-sm"
            rows={2}
          />
          <Button 
            onClick={sendMessage} 
            size="icon" 
            className="self-end h-9 w-9 rounded-full bg-primary hover:bg-primary/90"
            disabled={!inputText.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="w-full text-xs text-muted-foreground mt-1">
          Appuyez sur <kbd className="px-1 bg-muted dark:bg-slate-800 rounded">Entrée</kbd> pour envoyer
        </div>
      </div>
    </>
  );
};

export default ChatInput;

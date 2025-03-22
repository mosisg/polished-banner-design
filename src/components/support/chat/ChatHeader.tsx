import React from 'react';
import { Bot, Database, WifiOff, X } from 'lucide-react';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface ChatHeaderProps {
  useRAG: boolean;
  toggleRAG: () => void;
  isConnectedToOpenAI: boolean;
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  useRAG,
  toggleRAG,
  isConnectedToOpenAI,
  onClose
}) => {
  return (
    <SheetHeader className="px-4 py-2 border-b dark:border-slate-700 bg-primary/5 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <SheetTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span>Prixo</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={useRAG ? "default" : "outline"} 
                  size="icon" 
                  className="h-6 w-6 rounded-full ml-2" 
                  onClick={toggleRAG}
                >
                  <Database className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{useRAG ? "Désactiver" : "Activer"} la base de connaissances</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {!isConnectedToOpenAI && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="destructive" className="ml-1 py-0 h-5 px-1 border-red-500">
                    <WifiOff className="h-3 w-3 mr-1" />
                    IA Hors ligne
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Le service d'IA est actuellement indisponible. Réponses basiques seulement.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </SheetTitle>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </SheetHeader>
  );
};

export default ChatHeader;

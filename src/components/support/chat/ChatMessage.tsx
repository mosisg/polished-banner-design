
import React from 'react';
import { Bot, User, Database, FileText, ThumbsUp as ThumbUpIcon, ThumbsDown as ThumbDownIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DocumentReference } from '@/types/support';
import { cn } from '@/lib/utils';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Check, CheckCheck } from 'lucide-react';
import { MessageStatus } from '@/types/support';

interface ChatMessageProps {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  usedContext?: boolean;
  documentReferences?: DocumentReference[];
  status?: MessageStatus;
  isLastMessage?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  id,
  text,
  sender,
  timestamp,
  usedContext,
  documentReferences,
  status,
  isLastMessage
}) => {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={cn(
          "max-w-[85%] rounded-lg p-2 shadow-sm", 
          sender === 'user' 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted/70 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-tl-none"
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          {sender === 'bot' ? (
            <Bot className="h-4 w-4 text-primary" />
          ) : (
            <User className="h-4 w-4" />
          )}
          <span className="text-xs font-medium">
            {sender === 'user' ? 'Vous' : 'Assistant'}
          </span>
          {sender === 'bot' && usedContext && (
            <Badge variant="outline" className="ml-1 py-0 h-5 text-[10px] px-1 border-primary/30 text-primary">
              <Database className="h-2.5 w-2.5 mr-1" />
              Contextualisé
            </Badge>
          )}
          {sender === 'bot' && (
            <div className="ml-auto flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-5 w-5 hover:text-primary dark:hover:text-primary rounded-full">
                <ThumbUpIcon className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-5 w-5 hover:text-destructive dark:hover:text-destructive rounded-full">
                <ThumbDownIcon className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        <p className="whitespace-pre-line text-sm">{text}</p>
        
        {/* Document References Section */}
        {sender === 'bot' && documentReferences && documentReferences.length > 0 && (
          <Collapsible className="mt-2 pt-2 border-t border-border/30">
            <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <FileText className="h-3 w-3" />
              <span>{documentReferences.length} source{documentReferences.length > 1 ? 's' : ''} consultée{documentReferences.length > 1 ? 's' : ''}</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 space-y-2">
                {documentReferences.map((doc, idx) => (
                  <div key={doc.id} className="bg-background/50 dark:bg-slate-900/50 p-2 rounded border border-border/30 text-xs">
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-muted-foreground mt-1">{doc.excerpt}</p>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
        
        <div className="flex justify-end items-center gap-1 mt-1">
          <span className="text-xs opacity-70">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {sender === 'user' && isLastMessage && (
            status === 'sent' ? (
              <Check className="h-3 w-3 text-primary" />
            ) : status === 'delivered' ? (
              <CheckCheck className="h-3 w-3 text-primary" />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

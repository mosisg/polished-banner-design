
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage as ChatMessageType } from '@/types/support';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { MessageStatus } from '@/types/support';

interface MessageListProps {
  messages: ChatMessageType[];
  isTyping: boolean;
  messageEndRef: React.RefObject<HTMLDivElement>;
  lastMessageStatus: MessageStatus;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  messageEndRef,
  lastMessageStatus
}) => {
  return (
    <ScrollArea className="flex-1 px-4 py-3 bg-background dark:bg-slate-900">
      <div className="space-y-3 pb-2">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            id={message.id}
            text={message.text}
            sender={message.sender}
            timestamp={message.timestamp}
            usedContext={message.usedContext}
            documentReferences={message.documentReferences}
            isLastMessage={index === messages.length - 1 && message.sender === 'user'}
            status={message.sender === 'user' && index === messages.length - 1 ? lastMessageStatus : undefined}
          />
        ))}
        
        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}
        
        {/* Element for auto scroll */}
        <div ref={messageEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;

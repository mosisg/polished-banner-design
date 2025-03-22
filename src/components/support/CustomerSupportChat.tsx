
import React, { useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useSupportChat } from '@/hooks/useSupportChat';
import { SupportChatProvider } from '@/contexts/SupportChatContext';
import ChatHeader from './chat/ChatHeader';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';

interface CustomerSupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomerSupportChat: React.FC<CustomerSupportChatProps> = ({ isOpen, onClose }) => {
  return (
    <SupportChatProvider>
      <CustomerSupportChatInner isOpen={isOpen} onClose={onClose} />
    </SupportChatProvider>
  );
};

const CustomerSupportChatInner: React.FC<CustomerSupportChatProps> = ({ isOpen, onClose }) => {
  const { 
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
  } = useSupportChat();
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-focus the textarea when chat opens - with delay to ensure animation completes
  useEffect(() => {
    if (isOpen) {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        const timer = setTimeout(() => {
          textarea.focus();
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen]);
  
  // Ensure messages are scrolled to bottom when chat opens
  useEffect(() => {
    if (isOpen && messageEndRef.current) {
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 100);
    }
  }, [isOpen, messageEndRef]);
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md p-0 flex flex-col h-[70vh] sm:h-[65vh] border-l dark:border-slate-800 right-0 fixed bottom-0 !rounded-t-xl !rounded-b-none !mt-auto !top-auto">
        <ChatHeader 
          useRAG={useRAG}
          toggleRAG={toggleRAG}
          isConnectedToOpenAI={isConnectedToOpenAI}
          onClose={onClose}
        />
        
        <MessageList 
          messages={messages}
          isTyping={isTyping}
          messageEndRef={messageEndRef}
          lastMessageStatus={lastMessageStatus}
        />
        
        <ChatInput 
          inputText={inputText}
          setInputText={setInputText}
          sendMessage={sendMessage}
          handleKeyDown={handleKeyDown}
        />
      </SheetContent>
    </Sheet>
  );
};

export default CustomerSupportChat;

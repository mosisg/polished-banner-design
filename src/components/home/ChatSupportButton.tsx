
import React from 'react';
import { MessageCircle } from 'lucide-react';

interface ChatSupportButtonProps {
  onClick: () => void;
}

const ChatSupportButton = ({ onClick }: ChatSupportButtonProps) => {
  return (
    <div className="fixed bottom-5 right-5 z-40">
      <button 
        onClick={onClick}
        className="bg-primary text-white shadow-lg rounded-full p-3 flex items-center gap-2 text-sm font-medium transition-all hover:bg-primary/90"
        aria-label="Ouvrir le chat d'assistance"
      >
        <MessageCircle className="h-5 w-5" />
        <span>Assistance client</span>
      </button>
    </div>
  );
};

export default ChatSupportButton;

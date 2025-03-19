
import React, { useState } from 'react';
import { MessageCircle, Star } from 'lucide-react';
import MarketingPopup from '@/components/marketing/MarketingPopup';
import CustomerSupportChat from './CustomerSupportChat';

const SupportButtons = () => {
  const [chatOpen, setChatOpen] = useState(false);
  
  return (
    <>
      <div className="fixed bottom-4 z-40 w-full px-4 flex justify-between pointer-events-none">
        {/* Avis clients - left side */}
        <div className="pointer-events-auto">
          <MarketingPopup
            type="social-proof"
            trigger={
              <button className="bg-white dark:bg-slate-800 shadow-lg rounded-full p-3 flex items-center gap-2 text-sm font-medium border border-border hover:border-primary/40 transition-all">
                <span className="bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center">
                  <Star className="h-3 w-3 text-primary" />
                </span>
                <span>Avis clients</span>
              </button>
            }
          />
        </div>
        
        {/* Chat support - right side */}
        <div className="pointer-events-auto">
          <button 
            onClick={() => setChatOpen(prev => !prev)}
            className="bg-white dark:bg-slate-800 shadow-lg rounded-full p-3 flex items-center gap-2 text-sm font-medium border border-border hover:border-primary/40 transition-all"
          >
            <span className="bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center">
              <MessageCircle className="h-3 w-3 text-primary" />
            </span>
            <span>Assistance client</span>
          </button>
        </div>
      </div>
      
      {/* Chat component */}
      <CustomerSupportChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};

export default SupportButtons;

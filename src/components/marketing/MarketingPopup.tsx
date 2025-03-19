
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { PopupType } from './PopupTypes';

// Import popup content components
import WelcomePopup from './popups/WelcomePopup';
import ExitIntentPopup from './popups/ExitIntentPopup';
import FeedbackPopup from './popups/FeedbackPopup';
import SocialProofPopup from './popups/SocialProofPopup';
import OfferPopup from './popups/OfferPopup';

interface MarketingPopupProps {
  type: PopupType;
  trigger?: React.ReactNode;
  autoShow?: boolean;
  delay?: number;
  onAction?: () => void;
}

const MarketingPopup = ({ 
  type, 
  trigger, 
  autoShow = false, 
  delay = 3000,
  onAction
}: MarketingPopupProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if this popup has been shown before
    const popupShown = localStorage.getItem(`popup-${type}`);
    
    if (autoShow && !popupShown) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [autoShow, delay, type]);

  const handleClose = () => {
    setOpen(false);
    // Mark this popup as shown
    localStorage.setItem(`popup-${type}`, 'true');
  };

  const handleAction = () => {
    if (onAction) onAction();
    handleClose();
    
    // Show confirmation toast
    toast({
      title: "Merci !",
      description: type === 'feedback' 
        ? "Nous apprécions votre retour." 
        : "Votre action a été enregistrée.",
      duration: 3000,
    });
  };

  const renderContent = () => {
    switch (type) {
      case 'welcome':
        return <WelcomePopup onAction={handleAction} />;
        
      case 'exit':
        return <ExitIntentPopup onAction={handleAction} onClose={handleClose} />;
        
      case 'feedback':
        return <FeedbackPopup onAction={handleAction} />;
        
      case 'social-proof':
        return <SocialProofPopup onAction={handleAction} />;
        
      case 'offer':
        return <OfferPopup onAction={handleAction} />;
        
      default:
        return null;
    }
  };

  // If we have a trigger, use a Popover component instead of Dialog
  if (trigger) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {trigger}
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <div className="p-4">
            {renderContent()}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default MarketingPopup;

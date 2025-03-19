
import React, { useState, useEffect } from 'react';
import { X, ThumbsUp, Send } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';

type PopupType = 'welcome' | 'exit' | 'feedback' | 'social-proof' | 'offer';

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
  const [feedbackGiven, setFeedbackGiven] = useState(false);
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
        return (
          <>
            <DialogHeader>
              <DialogTitle>Bienvenue sur ComparePrix !</DialogTitle>
              <DialogDescription>
                Découvrez les meilleures offres de forfaits mobiles et box internet, adaptées à vos besoins.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-primary/10 p-4 rounded-lg mb-4">
                <p className="text-sm font-medium">🎁 Offre de bienvenue</p>
                <p className="text-sm text-muted-foreground">
                  Utilisez notre comparateur aujourd'hui et obtenez des remises exclusives chez nos partenaires !
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAction}>Découvrir les offres</Button>
            </DialogFooter>
          </>
        );
        
      case 'exit':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Avant de partir...</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir quitter sans avoir trouvé votre forfait idéal ?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <ThumbsUp className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium">Plus de 15 000 utilisateurs ont trouvé leur forfait parfait ce mois-ci</p>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleClose}>Je pars quand même</Button>
              <Button onClick={handleAction}>Continuer ma recherche</Button>
            </DialogFooter>
          </>
        );
        
      case 'feedback':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Votre avis nous intéresse</DialogTitle>
              <DialogDescription>
                Comment évalueriez-vous votre expérience avec notre comparateur ?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {!feedbackGiven ? (
                <div className="flex justify-center space-x-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className="flex flex-col items-center"
                      onClick={() => setFeedbackGiven(true)}
                    >
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center 
                        ${rating <= 3 ? 'hover:bg-amber-100' : 'hover:bg-green-100'} 
                        transition-colors border-2 border-transparent hover:border-primary`}
                      >
                        <span className="text-2xl">{
                          rating === 1 ? '😞' : 
                          rating === 2 ? '🙁' : 
                          rating === 3 ? '😐' : 
                          rating === 4 ? '🙂' : '😀'
                        }</span>
                      </div>
                      <span className="text-xs mt-1">{rating}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Merci ! Un commentaire à ajouter ?</p>
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="Votre commentaire (optionnel)" 
                      className="flex-1 rounded-l-md border border-input px-3 py-2 text-sm"
                    />
                    <Button 
                      variant="default" 
                      className="rounded-l-none" 
                      onClick={handleAction}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              {feedbackGiven && (
                <Button variant="outline" onClick={handleAction}>Envoyer sans commentaire</Button>
              )}
            </DialogFooter>
          </>
        );
        
      case 'social-proof':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Ce que nos utilisateurs disent</DialogTitle>
              <DialogDescription>
                Rejoignez des milliers d'utilisateurs satisfaits
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary/20 w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="font-medium">ML</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Marie L.</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-400 text-xs">★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm">
                  "J'ai économisé plus de 15€ par mois sur mon forfait mobile grâce à ComparePrix. Merci !"
                </p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary/20 w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="font-medium">TD</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Thomas D.</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-400 text-xs">★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm">
                  "Interface claire et simple d'utilisation. J'ai trouvé ma box fibre en quelques minutes !"
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAction}>Trouver mon offre</Button>
            </DialogFooter>
          </>
        );
        
      case 'offer':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Offre exclusive !</DialogTitle>
              <DialogDescription>
                Disponible uniquement aujourd'hui
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-4 rounded-lg border border-primary/20">
                <p className="text-center font-bold text-xl mb-2">-50% sur les frais d'activation</p>
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Chez nos partenaires Orange, SFR et Bouygues Telecom
                </p>
                <div className="flex justify-center gap-4">
                  <img src="/logo-orange.svg" alt="Orange" className="h-6" />
                  <img src="/logo-sfr.svg" alt="SFR" className="h-6" />
                  <img src="/logo-bouygues.svg" alt="Bouygues" className="h-6" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAction}>En profiter maintenant</Button>
            </DialogFooter>
          </>
        );
        
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

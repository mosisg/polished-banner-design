
import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SocialProofPopupProps {
  onAction: () => void;
}

const SocialProofPopup = ({ onAction }: SocialProofPopupProps) => {
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
        <Button onClick={onAction}>Trouver mon offre</Button>
      </DialogFooter>
    </>
  );
};

export default SocialProofPopup;

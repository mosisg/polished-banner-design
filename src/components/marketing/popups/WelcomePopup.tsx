
import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WelcomePopupProps {
  onAction: () => void;
}

const WelcomePopup = ({ onAction }: WelcomePopupProps) => {
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
        <Button onClick={onAction}>Découvrir les offres</Button>
      </DialogFooter>
    </>
  );
};

export default WelcomePopup;

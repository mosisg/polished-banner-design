
import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface OfferPopupProps {
  onAction: () => void;
}

const OfferPopup = ({ onAction }: OfferPopupProps) => {
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
        <Button onClick={onAction}>En profiter maintenant</Button>
      </DialogFooter>
    </>
  );
};

export default OfferPopup;

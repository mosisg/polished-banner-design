
import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';

interface ExitIntentPopupProps {
  onAction: () => void;
  onClose: () => void;
}

const ExitIntentPopup = ({ onAction, onClose }: ExitIntentPopupProps) => {
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
        <Button variant="outline" onClick={onClose}>Je pars quand même</Button>
        <Button onClick={onAction}>Continuer ma recherche</Button>
      </DialogFooter>
    </>
  );
};

export default ExitIntentPopup;

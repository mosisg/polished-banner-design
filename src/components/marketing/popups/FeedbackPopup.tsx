
import React, { useState } from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface FeedbackPopupProps {
  onAction: () => void;
}

const FeedbackPopup = ({ onAction }: FeedbackPopupProps) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

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
                onClick={onAction}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <DialogFooter>
        {feedbackGiven && (
          <Button variant="outline" onClick={onAction}>Envoyer sans commentaire</Button>
        )}
      </DialogFooter>
    </>
  );
};

export default FeedbackPopup;

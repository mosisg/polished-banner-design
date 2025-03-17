
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ArticleErrorStateProps {
  onRetry?: () => void;
}

const ArticleErrorState = ({ onRetry }: ArticleErrorStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold mb-4">Article non trouvé</h1>
      <p className="text-muted-foreground mb-6">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
      <div className="flex gap-4 justify-center">
        {onRetry && (
          <Button onClick={onRetry} variant="outline">Réessayer</Button>
        )}
        <Button onClick={() => navigate('/blog')}>Retour au blog</Button>
      </div>
    </div>
  );
};

export default ArticleErrorState;

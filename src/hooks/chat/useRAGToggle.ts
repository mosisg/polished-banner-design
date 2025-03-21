
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useRAGToggle = () => {
  const [useRAG, setUseRAG] = useState(true);
  const { toast } = useToast();

  const toggleRAG = () => {
    setUseRAG(prev => !prev);
    toast({
      title: useRAG ? "Mode base de connaissances désactivé" : "Mode base de connaissances activé",
      description: useRAG ? "Les réponses ne seront plus enrichies par votre base de connaissances." : "Les réponses seront enrichies par votre base de connaissances.",
      variant: "default"
    });
  };

  return { useRAG, toggleRAG };
};

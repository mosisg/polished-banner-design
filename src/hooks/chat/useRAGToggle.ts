
import { useToast } from '@/hooks/use-toast';
import { useSupportChatContext } from '@/contexts/SupportChatContext';

export const useRAGToggle = () => {
  const { state, dispatch } = useSupportChatContext();
  const { useRAG } = state;
  const { toast } = useToast();

  const toggleRAG = () => {
    dispatch({ type: 'TOGGLE_RAG' });
    toast({
      title: useRAG ? "Mode base de connaissances désactivé" : "Mode base de connaissances activé",
      description: useRAG ? "Les réponses ne seront plus enrichies par votre base de connaissances." : "Les réponses seront enrichies par votre base de connaissances.",
      variant: "default"
    });
  };

  return { useRAG, toggleRAG };
};

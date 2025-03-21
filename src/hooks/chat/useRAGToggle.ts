
import { useState } from 'react';

interface RAGToggleState {
  useRAG: boolean;
  toggleRAG: () => void;
}

export const useRAGToggle = (): RAGToggleState => {
  const [useRAG, setUseRAG] = useState<boolean>(true);

  const toggleRAG = () => {
    setUseRAG(prev => !prev);
  };

  return {
    useRAG,
    toggleRAG
  };
};

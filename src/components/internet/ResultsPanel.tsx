
import React from 'react';
import ResultsHeader from './ResultsHeader';
import ResultsList from './ResultsList';
import ViewerCounter from '../common/ViewerCounter';
import ExpertInsight from '../common/ExpertInsight';
import { InternetBox, SortOption } from '@/types/internet';

interface ResultsPanelProps {
  filteredBoxes: InternetBox[];
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
}

const ResultsPanel = ({ filteredBoxes, sortOption, setSortOption }: ResultsPanelProps) => {
  // Get the first box for the viewer counter and expert insight
  const featuredBox = filteredBoxes.length > 0 ? filteredBoxes[0] : null;
  
  // Expert insights for different operators
  const getExpertInsight = (operator: string) => {
    const insights: Record<string, string> = {
      'Orange': "Cette box offre la meilleure stabilité de connexion, idéale pour le télétravail et les familles nombreuses avec beaucoup d'appareils connectés simultanément.",
      'SFR': "Le rapport qualité-prix est excellent ici, avec une excellente couverture dans les zones urbaines et des services TV très complets.",
      'Free': "L'offre la plus transparente et sans engagement, parfaite pour les étudiants ou ceux qui ont besoin de flexibilité.",
      'Bouygues Telecom': "Cette box propose le meilleur compromis entre performance et prix, avec un service client réactif et de qualité.",
      'Red by SFR': "Parfait pour ceux qui recherchent l'essentiel sans superflu, avec un prix très compétitif et une connexion fiable."
    };
    
    return insights[operator] || 
      "Cette offre présente un excellent rapport qualité-prix dans sa catégorie et inclut des services qui correspondent aux besoins de la majorité des utilisateurs.";
  };
  
  return (
    <div className="lg:col-span-3 space-y-6">
      <ResultsHeader 
        filteredBoxesCount={filteredBoxes.length} 
        sortOption={sortOption} 
        setSortOption={setSortOption} 
      />
      
      {featuredBox && (
        <div className="space-y-4">
          <ViewerCounter 
            operatorName={featuredBox.operator} 
            productType="box" 
            className="border border-muted bg-card"
          />
          
          <ExpertInsight 
            operatorName={featuredBox.operator}
            productType="box"
            insight={getExpertInsight(featuredBox.operator)}
          />
        </div>
      )}
      
      <ResultsList filteredBoxes={filteredBoxes} />
    </div>
  );
};

export default ResultsPanel;

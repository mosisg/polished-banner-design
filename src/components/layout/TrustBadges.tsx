
import React from 'react';
import { Shield, Award, CheckCircle } from 'lucide-react';

const TrustBadges: React.FC = () => {
  return (
    <div className="py-8 border-t border-muted">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium">Partenaire ARCEP</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium">Recommandé par UFC-Que Choisir</span>
          </div>
          
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium">Site 100% indépendant</span>
          </div>
          
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="ComparePrix" className="h-6 w-6" />
            <span className="text-sm font-medium">Mise à jour quotidienne</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;

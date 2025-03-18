
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Smartphone, Wifi, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ComparisonSection = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="h-7 w-7 text-primary" />
            <h2 className="text-3xl font-bold">Comparatif des Offres Telecom</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Utilisez nos outils de comparaison pour identifier rapidement les offres les plus avantageuses selon vos besoins spécifiques et votre budget.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Forfaits Mobiles</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Comparez les forfaits selon la data, le prix, la couverture réseau et les options internationales.
            </p>
            <Button asChild variant="outline" className="w-full group">
              <Link to="/mobile" className="inline-flex items-center justify-center">
                Comparer les forfaits
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Wifi className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Box Internet</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Trouvez votre box idéale en comparant les débits, les services inclus et les coûts mensuels.
            </p>
            <Button asChild variant="outline" className="w-full group">
              <Link to="/internet" className="inline-flex items-center justify-center">
                Comparer les box
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;

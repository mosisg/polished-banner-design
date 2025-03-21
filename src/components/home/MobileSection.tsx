
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Signal, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mobilePlans } from '@/data/mobilePlans';
import OptimizedImage from '@/components/ui/OptimizedImage';

const MobileSection = () => {
  // Sélection de quelques forfaits pour l'aperçu
  const featuredPlans = mobilePlans.slice(0, 3);

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="mb-8 md:mb-0 md:w-1/2 max-w-lg">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 mb-6">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Forfaits Mobiles</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">Trouvez le <span className="text-primary">forfait idéal</span> pour rester connecté</h2>
            <p className="text-muted-foreground mb-8 text-base leading-relaxed">
              Comparez les meilleurs forfaits mobiles et trouvez l'offre parfaite avec le bon équilibre entre data, appels et prix. Économisez jusqu'à 40% sur votre forfait mensuel.
            </p>
            
            <div className="flex flex-wrap gap-5 mb-8 items-center">
              <OptimizedImage src="/logo-bouygues.svg" alt="Bouygues Telecom" width={80} height={32} className="h-8 opacity-80 hover:opacity-100 transition-opacity" />
              <OptimizedImage src="/logo-coriolis.svg" alt="Coriolis" width={80} height={32} className="h-8 opacity-80 hover:opacity-100 transition-opacity" />
              <OptimizedImage src="/logo-orange.svg" alt="Orange" width={80} height={32} className="h-8 opacity-80 hover:opacity-100 transition-opacity" />
              <OptimizedImage src="/logo-auchan-telecom.svg" alt="Auchan Telecom" width={80} height={32} className="h-8 opacity-80 hover:opacity-100 transition-opacity" />
            </div>
            
            <Button asChild size="lg" className="group shadow-lg hover:shadow-xl transition-all">
              <Link to="/mobile" className="inline-flex items-center">
                Découvrir les offres
                <Signal className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {featuredPlans.map((plan) => (
              <Card key={plan.id} className="rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/20 transform hover:-translate-y-1">
                <div className="h-2 bg-primary"></div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <Signal className="h-4 w-4 text-primary" />
                    </div>
                    <div className="font-semibold text-sm">{plan.operator}</div>
                  </div>
                  <div className="text-xl font-bold mb-2">{plan.name}</div>
                  <div className="text-2xl font-bold text-primary mb-3">{plan.price}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>{plan.data}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>{plan.coverage}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileSection;

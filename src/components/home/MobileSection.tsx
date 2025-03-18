
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Signal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mobilePlans } from '@/data/mobilePlans';

const MobileSection = () => {
  // Sélection de quelques forfaits pour l'aperçu
  const featuredPlans = mobilePlans.slice(0, 3);

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-8">
          <div className="mb-6 md:mb-0 md:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="h-7 w-7 text-primary" />
              <h2 className="text-3xl font-bold">Forfaits Mobiles</h2>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Comparez les meilleurs forfaits mobiles et trouvez l'offre parfaite avec le bon équilibre entre data, appels et prix. Économisez jusqu'à 40% sur votre forfait mensuel.
            </p>
            <Button asChild size="lg" className="group">
              <Link to="/mobile" className="inline-flex items-center">
                Découvrir les offres
                <Signal className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featuredPlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-md transition-shadow border border-border">
                <CardContent className="p-4">
                  <div className="font-semibold text-sm mb-1">{plan.operator}</div>
                  <div className="text-lg font-bold mb-2">{plan.name}</div>
                  <div className="text-primary font-semibold">{plan.price}</div>
                  <div className="text-sm text-muted-foreground">{plan.data}</div>
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

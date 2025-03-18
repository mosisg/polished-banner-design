
import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { internetBoxes } from '@/data/internetBoxes';

const InternetSection = () => {
  // Sélection de quelques box internet pour l'aperçu
  const featuredBoxes = internetBoxes.slice(0, 3);
  
  return (
    <section className="py-20 bg-white dark:bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12">
          <div className="mb-8 md:mb-0 md:w-1/2 max-w-lg">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 mb-6">
              <Wifi className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Box Internet & Fibre</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">La <span className="text-primary">connexion ultra-rapide</span> pour toute la maison</h2>
            <p className="text-muted-foreground mb-8 text-base leading-relaxed">
              Trouvez la box internet la plus rapide pour votre logement. Comparez les offres fibre, ADSL et 5G fixe des principaux fournisseurs avec les meilleurs tarifs négociés.
            </p>
            <Button asChild size="lg" className="group shadow-lg hover:shadow-xl transition-all">
              <Link to="/internet" className="inline-flex items-center">
                Explorer les offres
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {featuredBoxes.map((box) => (
              <Card key={box.id} className="rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/20 transform hover:-translate-y-1">
                <div className="h-2 bg-primary"></div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div className="font-semibold text-sm">{box.operator}</div>
                  </div>
                  <div className="text-xl font-bold mb-2">{box.name}</div>
                  <div className="text-2xl font-bold text-primary mb-3">{box.price}€/mois</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>↓{box.downloadSpeed}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>↑{box.uploadSpeed}</span>
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

export default InternetSection;

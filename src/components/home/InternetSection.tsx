
import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { internetBoxes } from '@/data/internetBoxes';

const InternetSection = () => {
  // Sélection de quelques box internet pour l'aperçu
  const featuredBoxes = internetBoxes.slice(0, 3);
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row-reverse items-center justify-between mb-10 gap-8">
          <div className="mb-6 md:mb-0 md:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              <Wifi className="h-7 w-7 text-primary" />
              <h2 className="text-3xl font-bold">Box Internet & Fibre</h2>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Trouvez la box internet la plus rapide pour votre logement. Comparez les offres fibre, ADSL et 5G fixe des principaux fournisseurs avec les meilleurs tarifs négociés.
            </p>
            <Button asChild size="lg" className="group">
              <Link to="/internet" className="inline-flex items-center">
                Explorer les offres
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featuredBoxes.map((box) => (
              <Card key={box.id} className="hover:shadow-md transition-shadow border border-border">
                <CardContent className="p-4">
                  <div className="font-semibold text-sm mb-1">{box.operator}</div>
                  <div className="text-lg font-bold mb-2">{box.name}</div>
                  <div className="text-primary font-semibold">{box.price}€/mois</div>
                  <div className="text-sm text-muted-foreground">
                    <span className="block">↓{box.downloadSpeed}</span>
                    <span className="block">↑{box.uploadSpeed}</span>
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

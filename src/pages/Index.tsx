
import React from 'react';
import Header from '@/components/layout/Header';
import Banner from '@/components/layout/Banner';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/50">
          {/* Background Elements */}
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-accent/10 rounded-full filter blur-3xl opacity-70 animate-pulse-subtle"></div>
          <div className="absolute top-40 -left-20 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
          
          <Banner />
        </section>
        
        <Separator />
        
        {/* Content Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pourquoi nous choisir ?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez pourquoi des milliers d'utilisateurs nous font confiance pour trouver le forfait mobile idéal.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                {
                  title: "Comparaison impartiale",
                  description: "Nous analysons les offres de tous les opérateurs sans favoriser qui que ce soit."
                },
                {
                  title: "Mise à jour quotidienne",
                  description: "Nos équipes mettent à jour les offres chaque jour pour vous garantir les informations les plus récentes."
                },
                {
                  title: "Économisez du temps",
                  description: "Trouvez rapidement le forfait qui correspond à vos besoins sans passer des heures à comparer."
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-primary font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-muted py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-blue-purple flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <div className="font-bold text-xl">
                  <span className="text-gradient-blue-purple">Bon</span>
                  <span className="text-gradient-purple-pink">Forfait</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} BonForfait. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

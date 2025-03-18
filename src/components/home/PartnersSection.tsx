
import React from 'react';
import { Handshake } from 'lucide-react';
import { motion } from 'framer-motion';

const partners = [
  { name: 'Orange', logo: '/logo-orange.svg', color: 'from-orange-500/20 to-orange-600/10' },
  { name: 'SFR', logo: '/logo-sfr.svg', color: 'from-red-500/20 to-red-600/10' },
  { name: 'Bouygues Telecom', logo: '/logo-bouygues.svg', color: 'from-blue-500/20 to-blue-600/10' },
  { name: 'Free', logo: '/logo-free.svg', color: 'from-red-600/20 to-red-700/10' },
  { name: 'Sosh', logo: '/logo-sosh.svg', color: 'from-teal-500/20 to-teal-600/10' },
  { name: 'RED by SFR', logo: '/logo-red.svg', color: 'from-green-500/20 to-green-600/10' },
  { name: 'Prixtel', logo: '/logo-prixtel.svg', color: 'from-slate-500/20 to-slate-600/10' },
  { name: 'Coriolis', logo: '/logo-coriolis.svg', color: 'from-cyan-500/20 to-cyan-600/10' },
  { name: 'YouPrice', logo: '/logo-youprice.svg', color: 'from-emerald-500/20 to-emerald-600/10' },
  { name: 'Auchan Télécom', logo: '/logo-auchan-telecom.svg', color: 'from-red-500/20 to-red-600/10' },
];

const PartnersSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Handshake className="h-7 w-7 text-primary" />
            <h2 className="text-3xl font-bold">Nos Partenaires Télécom</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nous collaborons avec les meilleurs opérateurs télécoms pour vous offrir les comparaisons les plus précises et des offres exclusives.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {partners.map((partner, index) => (
            <motion.div 
              key={index}
              className={`bg-gradient-to-br ${partner.color} p-6 rounded-xl border border-border flex items-center justify-center h-32 shadow-sm hover:shadow-md transition-shadow`}
              variants={itemVariants}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-full h-16 flex items-center justify-center">
                  <img 
                    src={partner.logo} 
                    alt={`Logo ${partner.name}`}
                    className="max-h-12 max-w-full object-contain"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">L'Excellence dans la Transparence des Offres</h3>
            <p className="text-muted-foreground mb-6">
              Grâce à nos partenariats avec les principaux acteurs des télécommunications en France, 
              nous vous garantissons un accès aux informations les plus à jour et des comparaisons impartiales 
              pour vous aider à faire le meilleur choix selon vos besoins.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-border">
                <h4 className="font-semibold mb-2">Données Fiables</h4>
                <p className="text-sm text-muted-foreground">
                  Informations vérifiées directement auprès des opérateurs pour une comparaison objective.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-border">
                <h4 className="font-semibold mb-2">Offres Exclusives</h4>
                <p className="text-sm text-muted-foreground">
                  Accédez à des promotions négociées spécialement pour nos utilisateurs.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-border">
                <h4 className="font-semibold mb-2">Analyse Impartiale</h4>
                <p className="text-sm text-muted-foreground">
                  Nous mettons en lumière les vrais avantages de chaque offre sans favoritisme.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;

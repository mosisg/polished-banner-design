
import React from 'react';
import { motion } from 'framer-motion';

const MobileHero = () => {
  return (
    <section className="w-full pt-20 pb-12 md:py-32 lg:py-40 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
              Trouvez le Meilleur Forfait Mobile
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-300 text-sm md:text-xl">
              Comparez les offres des principaux opérateurs et trouvez le forfait adapté à vos besoins.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MobileHero;

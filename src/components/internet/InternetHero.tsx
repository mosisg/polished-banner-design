
import React from 'react';
import { motion } from 'framer-motion';

const InternetHero = () => {
  return (
    <section className="w-full py-24 md:py-32 lg:py-40 bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
              Trouvez la Meilleure Box Internet
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
              Comparez les offres Fibre, ADSL et 4G/5G des principaux opérateurs et économisez sur votre abonnement.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InternetHero;

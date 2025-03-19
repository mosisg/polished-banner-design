
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, Smartphone } from 'lucide-react';

const PhoneHero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-medium">
              Meilleurs prix garantis
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Trouvez le smartphone <span className="text-yellow-300">parfait</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-md">
              Comparez plus de 500 téléphones des plus grandes marques et économisez jusqu'à 40%
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-yellow-300 hover:text-blue-700">
                <Search className="mr-2 h-5 w-5" />
                Comparer maintenant
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Meilleures offres
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <span className="bg-white/20 p-1 rounded-full mr-1">✓</span>
                Livraison rapide
              </div>
              <div className="flex items-center">
                <span className="bg-white/20 p-1 rounded-full mr-1">✓</span>
                Garantie 2 ans
              </div>
              <div className="flex items-center">
                <span className="bg-white/20 p-1 rounded-full mr-1">✓</span>
                Retours gratuits
              </div>
            </div>
          </div>
          <div className="flex justify-center md:justify-end relative">
            <div className="relative w-64 h-64 md:w-72 md:h-72 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center p-4">
              <Smartphone className="w-40 h-40 text-white" />
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-blue-800 font-bold rounded-full w-16 h-16 flex items-center justify-center text-xl">
                -40%
              </div>
            </div>
            <div className="absolute top-1/4 -left-4 bg-white shadow-lg rounded-lg p-3 animate-bounce">
              <span className="text-blue-600 font-bold">iPhone 14</span>
              <div className="text-sm">699€ <span className="line-through text-gray-500">999€</span></div>
            </div>
            <div className="absolute bottom-1/4 -right-4 bg-white shadow-lg rounded-lg p-3 animate-bounce delay-500">
              <span className="text-purple-600 font-bold">Galaxy S23</span>
              <div className="text-sm">649€ <span className="line-through text-gray-500">899€</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneHero;

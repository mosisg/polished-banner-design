
import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface City {
  name: string;
  offer: string;
  price: string;
  operator: string;
  type: 'mobile' | 'internet';
  link: string;
}

const cities: City[] = [
  { name: 'Paris', offer: 'Fibre Free', price: '19.99€', operator: 'Free', type: 'internet', link: '/internet' },
  { name: 'Lyon', offer: 'Fibre Sosh', price: '19.99€', operator: 'Sosh', type: 'internet', link: '/internet' },
  { name: 'Marseille', offer: '5G RED', price: '9.99€', operator: 'RED by SFR', type: 'mobile', link: '/mobile' },
  { name: 'Toulouse', offer: 'Bbox Fibre', price: '22.99€', operator: 'Bouygues', type: 'internet', link: '/internet' },
  { name: 'Bordeaux', offer: 'Fibre Orange', price: '24.99€', operator: 'Orange', type: 'internet', link: '/internet' },
  { name: 'Lille', offer: 'Forfait B&You', price: '7.99€', operator: 'Bouygues', type: 'mobile', link: '/mobile' },
];

const GeolocatedOffer: React.FC = () => {
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulation d'une géolocalisation
    // Dans une application réelle, vous utiliseriez l'API de géolocalisation du navigateur
    // ou un service comme ipinfo.io pour déterminer la localisation de l'utilisateur
    const fetchLocation = async () => {
      setLoading(true);
      try {
        // Simulation: choisir une ville au hasard
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        
        // Dans une implémentation réelle:
        // const response = await fetch('https://ipinfo.io/json?token=YOUR_TOKEN');
        // const data = await response.json();
        // const userCity = data.city;
        // const matchedCity = cities.find(c => c.name === userCity) || cities[0];
        
        setTimeout(() => {
          setCity(randomCity);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erreur de géolocalisation:', error);
        setCity(cities[0]);
        setLoading(false);
      }
    };
    
    fetchLocation();
  }, []);
  
  if (loading) {
    return (
      <div className="w-full max-w-md p-4 bg-background/50 backdrop-blur-sm border border-primary/20 rounded-lg animate-pulse">
        <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
    );
  }
  
  if (!city) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-4 bg-background/50 backdrop-blur-sm border border-primary/20 rounded-lg shadow-sm"
    >
      <div className="flex items-center mb-2">
        <MapPin className="h-5 w-5 text-primary mr-2" />
        <span className="text-sm font-medium">À {city.name} ?</span>
        <Badge variant="outline" className="ml-auto">
          Offre locale
        </Badge>
      </div>
      
      <p className="text-lg font-bold mb-3">
        {city.offer} à <span className="text-primary">{city.price}/mois</span> ce mois-ci !
      </p>
      
      <Button asChild size="sm" className="w-full group">
        <Link to={city.link} className="flex items-center justify-center">
          Voir l'offre {city.operator}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </motion.div>
  );
};

export default GeolocatedOffer;

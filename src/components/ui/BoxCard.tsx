
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Wifi, Download, Upload, Router, Monitor, Phone, Check, Info, ExternalLink } from 'lucide-react';
import { InternetBox } from '@/types/internet';

interface BoxCardProps {
  box: InternetBox & { operatorLogo?: React.ReactNode };
}

// Fonction pour obtenir l'URL d'affiliation en fonction de l'opérateur
const getAffiliateUrl = (operator: string): string => {
  const affiliateUrls: Record<string, string> = {
    'Free': 'https://free.fr/freebox/?utm_source=compareprix&utm_medium=affiliation&utm_campaign=internet',
    'Bouygues': 'https://www.bouyguestelecom.fr/offres-internet/?utm_source=compareprix&utm_medium=affiliation',
    'Sosh': 'https://www.sosh.fr/offres-mobiles/sosh-mobile-livebox/?utm_source=compareprix&utm_medium=affiliation',
    'Orange': 'https://boutique.orange.fr/internet/offres-fibre/?utm_source=compareprix&utm_medium=affiliation',
    'SFR': 'https://www.sfr.fr/offre-internet/?utm_source=compareprix&utm_medium=affiliation',
    'RED': 'https://www.red-by-sfr.fr/offres-internet/?utm_source=compareprix&utm_medium=affiliation',
    'Bouygues Telecom': 'https://www.bouyguestelecom.fr/offres-internet/?utm_source=compareprix&utm_medium=affiliation',
  };
  
  return affiliateUrls[operator] || 'https://compareprix.fr/redirect';
};

const BoxCard = ({ box }: BoxCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Extract numeric price value for styling
  const priceValue = parseFloat(box.price);
  const priceInt = Math.floor(priceValue);
  const priceDecimal = (priceValue % 1).toFixed(2).substring(2);
  
  // Générer l'URL d'affiliation
  const affiliateUrl = box.affiliate_url || getAffiliateUrl(box.operator);

  return (
    <div 
      className="max-w-full mx-auto flex flex-col md:flex-row overflow-hidden rounded-2xl border border-border transition-all duration-300 shadow-sm hover:shadow-md animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left side - Operator and Box Name */}
      <div className="w-full md:w-1/5 p-4 md:p-6 bg-gradient-to-br from-background to-muted/50 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-border">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3">
            {box.operatorLogo || (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
                <span className="text-2xl font-bold text-primary">{box.operator.charAt(0)}</span>
              </div>
            )}
          </div>
          <h3 className="font-semibold text-lg">{box.operator}</h3>
          <div className="mt-1 text-sm text-muted-foreground">{box.name}</div>
          
          {box.wifiType && (
            <div className="mt-3 flex items-center bg-muted px-2 py-1 rounded text-xs font-medium">
              <Wifi className="h-3 w-3 mr-1" /> {box.wifiType}
            </div>
          )}
          
          {box.specialOffer && (
            <div className="mt-2 bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-semibold">
              {box.specialOffer}
            </div>
          )}
        </div>
      </div>

      {/* Middle - Connection information and price */}
      <div className="w-full md:w-2/5 p-6 bg-card flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0 space-y-3">
          <div className="flex flex-col">
            <div className="flex items-center justify-center md:justify-start">
              <Download className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-muted-foreground">Download</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold mt-1">
              {box.downloadSpeed}
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center justify-center md:justify-start">
              <Upload className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-muted-foreground">Upload</span>
            </div>
            <div className="text-xl md:text-2xl font-bold mt-1">
              {box.uploadSpeed}
            </div>
          </div>
          
          {box.tvOption && (
            <div className="flex items-center justify-center md:justify-start text-sm">
              <Monitor className="w-4 h-4 text-primary mr-2" />
              {box.tvOption}
            </div>
          )}
        </div>
        
        <div className="text-center md:text-right">
          <div className="text-sm font-medium text-muted-foreground mb-1">Prix mensuel</div>
          <div className="flex items-center justify-center md:justify-end">
            <span className="text-3xl md:text-4xl font-bold">{priceInt}</span>
            <span className="text-xl md:text-2xl font-bold">.{priceDecimal}€</span>
          </div>
          <div className="text-xs text-muted-foreground">/mois</div>
          
          {box.commitment && (
            <div className="mt-2 text-xs">
              <span className="text-muted-foreground">Engagement: </span>
              <span className="font-medium">{box.commitment}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Features */}
      <div className="w-full md:w-2/5 p-6 bg-muted/20 flex flex-col justify-between">
        <div>
          <ul className="space-y-2">
            {box.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2 mt-0.5 flex-shrink-0">
                  <Check size={16} />
                </span>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <Button 
            className={cn(
              "w-full rounded-full transition-all duration-300 group",
              isHovered 
                ? "bg-primary" 
                : "bg-primary/90"
            )}
            asChild
          >
            <a href={affiliateUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              Voir l'offre
              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BoxCard;

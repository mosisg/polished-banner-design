
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Wifi, ExternalLink, Check, ArrowUpFromLine, Phone, Tv } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { InternetBox } from '@/types/internet';
import { Skeleton } from '@/components/ui/skeleton';

interface BoxCardProps {
  box: InternetBox;
  isLoading?: boolean;
}

export function BoxCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Operator section */}
        <div className="md:col-span-3 p-4 md:p-6 bg-gradient-to-br from-background to-muted/30 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-border">
          <Skeleton className="w-16 h-16 rounded-xl mb-3" />
          <Skeleton className="h-5 w-28 mb-2" />
          <Skeleton className="h-4 w-20 mb-3" />
          <Skeleton className="h-6 w-24" />
        </div>

        {/* Details section */}
        <div className="md:col-span-5 p-4 md:p-6 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-8 w-28" />
            </div>
            <div>
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-8 w-28" />
            </div>
            <div>
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-8 w-28" />
            </div>
            <div>
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
        </div>

        {/* Price and CTA section */}
        <div className="md:col-span-4 p-4 md:p-6 bg-muted/10 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border">
          <div>
            <Skeleton className="h-5 w-28 mb-2" />
            <Skeleton className="h-11 w-32 mb-2" />
            <Skeleton className="h-4 w-20 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          </div>
          <div className="mt-4">
            <Skeleton className="h-10 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

const BoxCard = ({ box, isLoading = false }: BoxCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  if (isLoading) {
    return <BoxCardSkeleton />;
  }

  // Extract numeric price value for styling
  const priceValue = parseFloat(box.price);
  const priceInt = Math.floor(priceValue);
  const priceDecimal = (priceValue % 1).toFixed(2).substring(2);
  
  // Generate the affiliate URL
  const affiliateUrl = box.affiliate_url || 'https://compareprix.fr/redirect';

  return (
    <div 
      className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Operator section */}
        <div className="md:col-span-3 p-4 md:p-6 bg-gradient-to-br from-background to-muted/30 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-border">
          {box.operatorLogo}
          <h3 className="font-semibold text-lg mt-2">{box.operator}</h3>
          <div className="mt-1 text-sm text-muted-foreground">{box.name}</div>
          
          {box.commitment && (
            <Badge variant="outline" className="mt-3 font-medium">
              {box.commitment}
            </Badge>
          )}
        </div>

        {/* Details section */}
        <div className="md:col-span-5 p-4 md:p-6 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <ArrowUpFromLine className="w-4 h-4 mr-1" />
                Download
              </div>
              <div className="font-semibold text-xl">{box.downloadSpeed}</div>
            </div>
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <ArrowUpFromLine className="w-4 h-4 mr-1 rotate-180" />
                Upload
              </div>
              <div className="font-semibold text-xl">{box.uploadSpeed}</div>
            </div>
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Wifi className="w-4 h-4 mr-1" />
                WiFi
              </div>
              <div className="font-semibold text-xl">{box.wifiType}</div>
            </div>
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Tv className="w-4 h-4 mr-1" />
                TV
              </div>
              <div className="font-semibold text-xl">{box.tvOption || 'Non inclus'}</div>
            </div>
          </div>
        </div>

        {/* Price and CTA section */}
        <div className="md:col-span-4 p-4 md:p-6 bg-muted/10 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Prix mensuel</div>
            <div className="flex items-baseline mt-1">
              <span className="text-3xl font-bold">{priceInt}</span>
              <span className="text-xl font-bold">.{priceDecimal}€</span>
              <span className="text-xs text-muted-foreground ml-1">/mois</span>
            </div>
            
            {box.specialOffer && (
              <Badge variant="secondary" className="mt-2">
                {box.specialOffer}
              </Badge>
            )}
            
            <ul className="mt-4 space-y-1">
              {box.features.slice(0, 2).map((feature, index) => (
                <li key={index} className="flex items-start text-sm">
                  <Check size={16} className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-4">
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
    </div>
  );
};

export default BoxCard;

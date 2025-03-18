
import React from 'react';
import { Phone as PhoneType } from '@/types/phones';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Package2, Sparkles } from 'lucide-react';
import { 
  formatPrice, 
  renderRating,
  EcoFriendlyBadge 
} from './PhoneCardUtils';

interface PhoneCardListProps {
  phone: PhoneType;
  isInComparison: boolean;
  onCompareToggle: () => void;
}

const PhoneCardList = ({ 
  phone, 
  isInComparison,
  onCompareToggle 
}: PhoneCardListProps) => {
  return (
    <Card className="overflow-hidden border border-gray-200 hover:border-gray-300">
      <div className="flex flex-col sm:flex-row p-4 gap-4">
        <div className="sm:w-1/4 max-w-[160px] mx-auto sm:mx-0">
          <div className="aspect-square relative bg-muted/20 flex items-center justify-center p-4 rounded-md">
            {phone.discount && phone.discount > 0 && (
              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                -{phone.discount}€
              </Badge>
            )}
            
            <img 
              src={phone.image || '/placeholder.svg'} 
              alt={phone.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
        
        <div className="sm:w-2/4 flex-1">
          <Badge variant="outline" className="mb-2">
            {phone.trademark}
          </Badge>
          
          <h3 className="font-semibold text-lg mb-2">{phone.title}</h3>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {phone.storage && (
              <Badge variant="secondary" className="text-xs">
                {phone.storage}
              </Badge>
            )}
            {phone.operatingSystem && (
              <Badge variant="secondary" className="text-xs">
                {phone.operatingSystem}
              </Badge>
            )}
            {phone.condition !== 'new' && (
              <Badge variant="secondary" className="text-xs capitalize">
                {phone.condition === 'refurbished' ? 'Reconditionné' : 'Occasion'}
              </Badge>
            )}
          </div>
          
          {phone.promotion && (
            <div className="mb-2">
              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">
                <Sparkles className="h-3 w-3 mr-1" />
                {phone.promotion}
              </Badge>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {phone.description}
          </p>
          
          {phone.isEcoFriendly && (
            <div className="flex items-center text-green-600 text-sm">
              <EcoFriendlyBadge />
            </div>
          )}
          
          {phone.rating && (
            <div className="mt-1">
              {renderRating(phone.rating)}
            </div>
          )}
        </div>
        
        <div className="sm:w-1/4 flex flex-col items-end justify-between mt-4 sm:mt-0">
          <div className="text-right w-full">
            <div className="flex items-end justify-end gap-2">
              <span className="text-2xl font-bold">
                {formatPrice(phone.price)}
              </span>
              
              {phone.originalPrice && phone.originalPrice > phone.price && (
                <span className="text-muted-foreground line-through text-sm">
                  {formatPrice(phone.originalPrice)}
                </span>
              )}
            </div>
            
            {phone.installmentPrice && phone.installmentMonths && (
              <div className="text-sm text-muted-foreground mb-2">
                ou {phone.installmentPrice}€/mois sur {phone.installmentMonths} mois
              </div>
            )}
            
            {phone.shipping && (
              <div className="text-sm text-muted-foreground mb-2">
                <Package2 className="h-3 w-3 inline mr-1" />
                {phone.shipping}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2 w-full mt-4">
            <Button size="sm" className="w-full">
              Voir l'offre
            </Button>
            
            <div className="flex items-center justify-center">
              <Checkbox 
                id={`compare-list-${phone.id}`}
                checked={isInComparison}
                onCheckedChange={() => onCompareToggle()}
              />
              <label 
                htmlFor={`compare-list-${phone.id}`}
                className="text-sm text-muted-foreground ml-2 cursor-pointer"
              >
                Ajouter au comparateur
              </label>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PhoneCardList;

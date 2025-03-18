import React from 'react';
import { Phone as PhoneType } from '@/types/phones';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Leaf, Info, Package2, Sparkles } from 'lucide-react';

interface PhoneCardProps {
  phone: PhoneType;
  viewType: 'grid' | 'list';
  isInComparison: boolean;
  onCompareToggle: () => void;
}

const PhoneCard = ({ 
  phone, 
  viewType, 
  isInComparison,
  onCompareToggle 
}: PhoneCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  };
  
  const renderRating = (rating: number = 0, reviewCount: number = 0) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : star - 0.5 <= rating
                ? 'text-yellow-400 fill-yellow-400/50'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
        {reviewCount > 0 && (
          <span className="ml-1 text-sm text-muted-foreground">
            ({reviewCount} avis)
          </span>
        )}
      </div>
    );
  };
  
  const getPromotionTag = () => {
    if (phone.description.includes("OFFERTE")) {
      return "GALAXY TABS6 LITE 2024 OFFERTE";
    }
    
    if (phone.discount) {
      if (phone.discount >= 100) {
        return `-100€ REMISE IMMÉDIATE`;
      } else if (phone.discount >= 60) {
        return `-60€ REMISE IMMÉDIATE`;
      } else if (phone.discount > 0) {
        return `-${phone.discount}€ REMISE IMMÉDIATE`;
      }
    }
    
    return null;
  };
  
  const renderColorOptions = () => {
    const colors = ['black', 'white', 'blue', 'green'];
    
    return (
      <div className="flex space-x-1 mt-2">
        {colors.map((color) => (
          <div 
            key={color} 
            className={`w-4 h-4 rounded-full border ${
              color === 'black' ? 'bg-black' : 
              color === 'white' ? 'bg-white' : 
              color === 'blue' ? 'bg-blue-500' : 
              'bg-green-500'
            }`}
          />
        ))}
      </div>
    );
  };
  
  const promotionTag = getPromotionTag();
  const isNewRelease = phone.title.includes("16") || phone.title.includes("A26") || phone.title.includes("S25");
  
  return viewType === 'grid' ? (
    <Card className="overflow-hidden h-full flex flex-col border border-gray-200 hover:border-gray-300">
      {promotionTag && (
        <div className={`text-center text-white text-xs font-semibold py-1 px-2 ${
          promotionTag.includes('OFFERTE') ? 'bg-blue-700' : 'bg-orange-500'
        }`}>
          {promotionTag}
        </div>
      )}
      
      {isNewRelease && !promotionTag && (
        <div className="text-center text-white text-xs font-semibold py-1 px-2 bg-blue-900">
          NOUVEAUTÉ
        </div>
      )}
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-1">{phone.title}</h3>
        
        {phone.rating && (
          <div className="mb-3">
            {renderRating(phone.rating, phone.reviewCount || 0)}
          </div>
        )}
        
        <div className="relative flex-grow flex items-center justify-center py-4">
          {phone.isEcoFriendly && (
            <div className="absolute top-0 right-0">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Leaf className="h-3 w-3 mr-1" />
                TECH & DURABLE
              </Badge>
            </div>
          )}
          
          <img 
            src={phone.image || '/placeholder.svg'} 
            alt={phone.title}
            className="max-h-[150px] object-contain"
          />
          
          {renderColorOptions()}
        </div>
        
        <div className="mt-auto pt-4">
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className="text-sm font-medium text-gray-500">À partir de</span>
            </div>
            <span className="text-2xl font-bold">
              1<sup>€</sup>
            </span>
            
            {phone.installmentPrice && phone.installmentMonths && (
              <div className="text-sm text-gray-600 mt-1">
                +{phone.installmentPrice}€/mois x {phone.installmentMonths} mois
                <br />
                <span className="text-xs text-gray-500">après remboursement</span>
                <Info className="inline-block h-3 w-3 ml-1 text-gray-400" />
              </div>
            )}
            
            <div className="flex items-center mt-2 py-2 border-t border-gray-100">
              <div className="flex-shrink-0">
                <img 
                  src="/placeholder.svg" 
                  alt="Phone icon" 
                  className="w-8 h-8"
                />
              </div>
              <div className="ml-2">
                <div className="text-xs text-gray-500">
                  Valeur ancien mobile
                </div>
                <div className="flex items-baseline">
                  <span className="font-semibold text-sm">100€</span>
                  <span className="ml-1 text-xs text-gray-500">de bonus</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center mt-3 pt-3 border-t border-gray-100">
              <Checkbox 
                id={`compare-${phone.id}`}
                checked={isInComparison}
                onCheckedChange={() => onCompareToggle()}
              />
              <label 
                htmlFor={`compare-${phone.id}`}
                className="text-sm text-gray-500 ml-2 cursor-pointer"
              >
                Ajouter au comparateur
              </label>
            </div>
          </div>
        </div>
      </div>
    </Card>
  ) : (
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
              <Leaf className="h-4 w-4 mr-1" />
              Produit éco-responsable
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

export default PhoneCard;

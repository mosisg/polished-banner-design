
import React from 'react';
import { Phone as PhoneType } from '@/types/phones';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Leaf, Package, Sparkles } from 'lucide-react';

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
  // Format price with Euro symbol
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  };
  
  // Generate stars for rating
  const renderRating = (rating: number = 0) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };
  
  return viewType === 'grid' ? (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:border-primary/50 group">
      <div className="aspect-[4/3] relative bg-muted/20 flex items-center justify-center p-6 overflow-hidden">
        {phone.discount && phone.discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
            -{phone.discount}€
          </Badge>
        )}
        
        {phone.isEcoFriendly && (
          <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
            <Leaf className="h-3 w-3 mr-1" />
            Eco
          </Badge>
        )}
        
        <img 
          src={phone.image || '/placeholder.svg'} 
          alt={phone.title}
          className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
        />
      </div>
      
      <CardContent className="p-4 flex-1 flex flex-col">
        {/* Manufacturer */}
        <Badge variant="outline" className="mb-2 w-fit">
          {phone.trademark}
        </Badge>
        
        {/* Title */}
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{phone.title}</h3>
        
        {/* Storage and OS info */}
        <div className="flex flex-wrap gap-1 mb-2">
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
          {phone.color && (
            <Badge variant="secondary" className="text-xs">
              {phone.color}
            </Badge>
          )}
          {phone.condition !== 'new' && (
            <Badge variant="secondary" className="text-xs capitalize">
              {phone.condition === 'refurbished' ? 'Reconditionné' : 'Occasion'}
            </Badge>
          )}
        </div>
        
        {/* Promotion badge */}
        {phone.promotion && (
          <div className="mb-2">
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              {phone.promotion}
            </Badge>
          </div>
        )}
        
        {/* Price block */}
        <div className="mt-auto pt-4">
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold">
              {formatPrice(phone.price)}
            </span>
            
            {phone.originalPrice && phone.originalPrice > phone.price && (
              <span className="text-muted-foreground line-through text-sm">
                {formatPrice(phone.originalPrice)}
              </span>
            )}
          </div>
          
          {/* Installment price */}
          {phone.installmentPrice && phone.installmentMonths && (
            <div className="text-sm text-muted-foreground mb-2">
              ou {phone.installmentPrice}€/mois sur {phone.installmentMonths} mois
            </div>
          )}
          
          {/* Rating */}
          {phone.rating && (
            <div className="mb-3">
              {renderRating(phone.rating)}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-1">
              <Checkbox 
                id={`compare-${phone.id}`}
                checked={isInComparison}
                onCheckedChange={() => onCompareToggle()}
              />
              <label 
                htmlFor={`compare-${phone.id}`}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Comparer
              </label>
            </div>
            
            <Button size="sm">
              Voir l'offre
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ) : (
    // List view
    <Card className="overflow-hidden transition-all hover:border-primary/50">
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
                <Package className="h-3 w-3 inline mr-1" />
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

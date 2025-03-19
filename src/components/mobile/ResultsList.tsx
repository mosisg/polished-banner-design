import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Smartphone, Star, ArrowRight, Package, Timer, Zap, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMobilePlans } from '@/hooks/use-mobile';
import { Plan } from '@/types/mobile';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const ResultsList = () => {
  const { planResults, isLoading, addToCompare, compareList } = useMobilePlans();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const operatorLogos: Record<string, string> = {
    'Orange': '/logo-orange.svg',
    'SFR': '/logo-sfr.svg',
    'Free': '/logo-free.svg',
    'Bouygues': '/logo-bouygues.svg',
    'Sosh': '/logo-sosh.svg',
    'RED': '/logo-red.svg',
    'Prixtel': '/logo-prixtel.svg',
    'Coriolis': '/logo-coriolis.svg',
    'Lebara': '/logo-lebara.svg',
    'Auchan Telecom': '/logo-auchan-telecom.svg',
    'YouPrice': '/logo-youprice.svg',
  };
  
  const getStarColor = (rating: number): string => {
    if (rating >= 4.5) return "text-green-500";
    if (rating >= 3.5) return "text-yellow-500";
    return "text-red-500";
  };

  const handleCompare = (plan: Plan) => {
    if (compareList.includes(plan.id)) {
      toast({
        title: "Forfait déjà dans la comparaison",
        description: "Ce forfait est déjà présent dans votre liste de comparaison.",
      });
      return;
    }
    
    if (compareList.length >= 3) {
      toast({
        title: "Comparaison limitée à 3 forfaits",
        description: "Vous ne pouvez pas comparer plus de 3 forfaits simultanément.",
      });
      return;
    }
    
    addToCompare(plan.id);
    toast({
      title: "Forfait ajouté à la comparaison",
      description: "Vous pouvez comparer jusqu'à 3 forfaits en même temps.",
    });
  };
  
  const goToVisitors = (plan: Plan) => {
    // Simulating visitor count - would be fetched from an analytics API in a real app
    const baseVisitors = Math.floor(Math.random() * 100) + 50;
    const currentVisitors = baseVisitors + new Date().getMinutes();
    
    toast({
      title: `${currentVisitors.toString()} personnes consultent cette offre`,
      description: "Cette offre est populaire auprès de nos utilisateurs.",
    });
  };
  
  const showRemainingTime = (plan: Plan) => {
    // Simulate a random remaining time for the offer
    const hours = Math.floor(Math.random() * 24) + 1;
    const minutes = Math.floor(Math.random() * 60);
    
    toast({
      title: "Offre à durée limitée !",
      description: `Cette offre expire dans ${hours}h et ${minutes}min - Ne ratez pas cette opportunité !`,
      variant: "destructive",
    });
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="overflow-hidden">
            <CardHeader className="p-4 border-b">
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid md:grid-cols-4 gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
            <CardFooter className="p-4 flex flex-wrap justify-between gap-2 border-t">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  const renderPlans = () => {
    if (!planResults || planResults.length === 0) {
      return (
        <div className="text-center py-10">
          <Smartphone className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold text-muted-foreground">Aucun forfait ne correspond à vos critères.</p>
          <p className="text-sm text-muted-foreground">Essayez d'ajuster vos filtres de recherche.</p>
        </div>
      );
    }
    
    return planResults.map((plan) => (
      <Card key={plan.id} className="overflow-hidden">
        <CardHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {operatorLogos[plan.operator] && (
                <img src={operatorLogos[plan.operator]} alt={`${plan.operator} Logo`} className="h-6 w-auto" />
              )}
              <h3 className="text-lg font-semibold">{plan.operator}</h3>
            </div>
            <Badge variant="secondary">
              {plan.price}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <Package className="h-5 w-5 text-primary mb-1" />
              <span className="font-bold">{plan.data}</span>
              <span className="text-xs text-muted-foreground">Data</span>
            </div>
            <div className="flex flex-col items-center">
              <Smartphone className="h-5 w-5 text-primary mb-1" />
              <span className="font-bold">{plan.call}</span>
              <span className="text-xs text-muted-foreground">Appels & SMS</span>
            </div>
            <div className="flex flex-col items-center">
              <Timer className="h-5 w-5 text-primary mb-1" />
              <span className="font-bold">{plan.commitment}</span>
              <span className="text-xs text-muted-foreground">Engagement</span>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="h-5 w-5 text-primary mb-1" />
              <span className="font-bold">{plan.network}</span>
              <span className="text-xs text-muted-foreground">Réseau</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 flex flex-wrap justify-between gap-2 border-t">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => handleCompare(plan)} disabled={compareList.includes(plan.id)}>
                  {compareList.includes(plan.id) ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Comparé
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Comparer
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ajouter à la comparaison</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex gap-2">
            {plan.rating && (
              <Badge variant="secondary" className="gap-1.5">
                <Star className={cn("h-3 w-3 fill-current", getStarColor(parseFloat(plan.rating)))} />
                <span>{plan.rating}</span>
              </Badge>
            )}
            <Button size="sm" onClick={() => { goToVisitors(plan); showRemainingTime(plan); navigate(plan.link) }}>
              Voir l'offre <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    ));
  };
  
  return (
    <div>
      {renderPlans()}
    </div>
  );
};

export default ResultsList;

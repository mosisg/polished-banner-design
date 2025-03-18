
import React, { useState } from 'react';
import { 
  SortAsc, SortDesc, Star, Filter, X, 
  BarChart2, CircleCheck 
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import PhoneCard from './PhoneCard';
import PhoneComparisonTable from './PhoneComparisonTable';
import { Phone, SortOption } from '@/types/phones';

interface PhoneResultsPanelProps {
  phones: Phone[];
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  isLoading: boolean;
  comparisonList: string[];
  toggleComparison: (id: string) => void;
}

const PhoneResultsPanel = ({
  phones,
  sortOption,
  setSortOption,
  isLoading,
  comparisonList,
  toggleComparison
}: PhoneResultsPanelProps) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const phonesPerPage = 12;
  
  // Get comparison phones
  const comparisonPhones = phones.filter(phone => 
    comparisonList.includes(phone.id)
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(phones.length / phonesPerPage);
  const startIndex = (page - 1) * phonesPerPage;
  const paginatedPhones = phones.slice(startIndex, startIndex + phonesPerPage);
  
  // Page change handler
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center items-center space-x-2 my-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Précédent
        </Button>
        
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
            .map((p, i, arr) => (
              <React.Fragment key={p}>
                {i > 0 && arr[i - 1] !== p - 1 && (
                  <span className="px-2 text-muted-foreground">...</span>
                )}
                <Button
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </Button>
              </React.Fragment>
            ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Suivant
        </Button>
      </div>
    );
  };
  
  return (
    <div className="lg:col-span-3">
      {/* Results Header */}
      <div className="bg-card border border-border rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            {isLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <h2 className="font-medium text-lg">
                {phones.length} Téléphone{phones.length !== 1 ? 's' : ''}
              </h2>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Comparison trigger */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={comparisonList.length === 0}
                  className="hidden sm:flex"
                >
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Comparer ({comparisonList.length})
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-w-4xl mx-auto">
                <DrawerHeader>
                  <DrawerTitle>Comparaison de téléphones</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 py-2">
                  <PhoneComparisonTable phones={comparisonPhones} />
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Fermer</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            
            {/* View switcher */}
            <div className="flex border rounded-md">
              <Button
                variant={view === 'grid' ? "default" : "ghost"}
                size="sm"
                className="rounded-r-none border-0"
                onClick={() => setView('grid')}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </Button>
              <Button
                variant={view === 'list' ? "default" : "ghost"}
                size="sm"
                className="rounded-l-none border-0"
                onClick={() => setView('list')}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="4" rx="1" />
                  <rect x="3" y="10" width="18" height="4" rx="1" />
                  <rect x="3" y="17" width="18" height="4" rx="1" />
                </svg>
              </Button>
            </div>
            
            {/* Sort select */}
            <Select
              value={sortOption}
              onValueChange={(value) => setSortOption(value as SortOption)}
            >
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">
                  <span className="flex items-center">
                    <SortAsc className="mr-2 h-4 w-4" />
                    Prix croissant
                  </span>
                </SelectItem>
                <SelectItem value="price-desc">
                  <span className="flex items-center">
                    <SortDesc className="mr-2 h-4 w-4" />
                    Prix décroissant
                  </span>
                </SelectItem>
                <SelectItem value="rating-desc">
                  <span className="flex items-center">
                    <Star className="mr-2 h-4 w-4" />
                    Meilleures notes
                  </span>
                </SelectItem>
                <SelectItem value="popularity">Popularité</SelectItem>
                <SelectItem value="newest">Nouveautés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Mobile comparison button */}
        {comparisonList.length > 0 && (
          <div className="mt-4 sm:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Comparer {comparisonList.length} téléphone{comparisonList.length > 1 ? 's' : ''}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Comparaison de téléphones</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 py-2">
                  <PhoneComparisonTable phones={comparisonPhones} />
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Fermer</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        )}
      </div>

      {/* Comparison selection reminder */}
      {comparisonList.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <CircleCheck className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm font-medium">
              {comparisonList.length} téléphone{comparisonList.length > 1 ? 's' : ''} sélectionné{comparisonList.length > 1 ? 's' : ''} pour comparaison
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleComparison(comparisonList[0])}
            className="h-8 px-2"
          >
            <X className="h-4 w-4 mr-1" />
            Effacer
          </Button>
        </div>
      )}

      {/* Results Content */}
      {isLoading ? (
        // Skeletons for loading state
        <div className={`grid ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 h-full">
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-5 w-1/3 mb-2" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : phones.length === 0 ? (
        // Empty state
        <div className="bg-card border border-border rounded-lg shadow-sm p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-muted rounded-full p-3">
              <X className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Aucun téléphone trouvé</h3>
            <p className="text-muted-foreground max-w-md">
              Aucun téléphone ne correspond à vos critères de recherche.
              Essayez de modifier ou de réinitialiser vos filtres.
            </p>
          </div>
        </div>
      ) : (
        // Results grid/list
        <>
          <div className={`grid ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {paginatedPhones.map((phone) => (
              <PhoneCard 
                key={phone.id}
                phone={phone}
                viewType={view}
                isInComparison={comparisonList.includes(phone.id)}
                onCompareToggle={() => toggleComparison(phone.id)}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default PhoneResultsPanel;

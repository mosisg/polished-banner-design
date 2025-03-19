
import { useState } from 'react';
import PlanCard from '@/components/ui/PlanCard';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  BarChart,
  ListFilter,
  LayoutGrid
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { MobilePlan } from '@/types/mobile';

interface ResultsListProps {
  filteredPlans: MobilePlan[];
}

const ResultsList = ({ filteredPlans }: ResultsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState<'list' | 'grid'>('list');
  
  const itemsPerPage = viewType === 'list' ? 5 : 9;
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  
  const currentItems = filteredPlans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const pageNumbers: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  // Determine which page numbers to display
  const getVisiblePageNumbers = () => {
    if (totalPages <= 5) {
      return pageNumbers;
    }
    
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };
  
  const visiblePageNumbers = getVisiblePageNumbers();

  const changePage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {filteredPlans.length} offres trouvées
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setViewType('list')}
            className={viewType === 'list' ? 'bg-primary/10' : ''}
          >
            <ListFilter className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setViewType('grid')}
            className={viewType === 'grid' ? 'bg-primary/10' : ''}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Visitor counter and urgency elements */}
      <Card className="bg-primary/5 p-3 border border-primary/10">
        <div className="flex justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-full">
              <BarChart className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm">
              <strong>267 personnes</strong> comparent des forfaits en ce moment
            </span>
          </div>
          <div className="text-sm text-amber-600 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Dernière mise à jour il y a 12 minutes
          </div>
        </div>
      </Card>
      
      {/* Results display */}
      {viewType === 'list' ? (
        <div className="space-y-4">
          {currentItems.map((plan, index) => (
            <PlanCard key={`${plan.id}-${index}`} plan={plan} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map((plan, index) => (
            <PlanCard key={`${plan.id}-${index}`} plan={plan} variant="compact" />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-8">
          <div className="join">
            <Button
              variant="outline"
              size="icon"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="join-item"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {visiblePageNumbers.map((pageNumber, idx) => (
              pageNumber === '...' ? (
                <Button 
                  key={`ellipsis-${idx}`}
                  variant="outline"
                  size="icon"
                  disabled
                  className="join-item"
                >
                  ...
                </Button>
              ) : (
                <Button
                  key={`page-${pageNumber}`}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="icon"
                  onClick={() => typeof pageNumber === 'number' ? changePage(pageNumber) : null}
                  className="join-item"
                >
                  {pageNumber}
                </Button>
              )
            ))}
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="join-item"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsList;

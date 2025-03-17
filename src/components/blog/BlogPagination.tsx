
import React from 'react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

const BlogPagination = ({ currentPage, pageCount, onPageChange }: PaginationProps) => {
  if (pageCount <= 1) return null;

  return (
    <div className="flex justify-center mt-12">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          Précédent
        </Button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: pageCount }).map((_, i) => (
            <Button 
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(i + 1)}
              className="w-9 h-9"
            >
              {i + 1}
            </Button>
          ))}
        </div>
        
        <Button 
          variant="outline"
          disabled={currentPage === pageCount}
          onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default BlogPagination;

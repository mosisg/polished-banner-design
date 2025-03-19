
import React from 'react';
import { Article } from '@/services/strapi';
import ArticleCard from './ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface ArticleGridProps {
  articles?: Article[];
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
}

const ArticleGrid = ({ articles, isLoading, error, onRetry }: ArticleGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="rounded-xl overflow-hidden border border-border">
            <Skeleton className="w-full h-48" />
            <div className="p-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Une erreur est survenue lors du chargement des articles.</p>
        <Button onClick={onRetry} className="bg-blue-500 hover:bg-blue-600">
          Réessayer
        </Button>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Aucun article disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default ArticleGrid;

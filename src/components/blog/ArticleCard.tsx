
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Article } from '@/services/strapi';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Link 
      to={`/blog/${article.slug}`} 
      key={article.id}
      className="group rounded-xl overflow-hidden border border-border transition-all duration-300 hover:shadow-md flex flex-col h-full"
      aria-label={`Article: ${article.title}`}
    >
      <div className="relative h-48 overflow-hidden">
        {article.cover?.url ? (
          <OptimizedImage 
            src={article.cover.url} 
            alt={article.cover.alternativeText || `Image pour l'article: ${article.title}`}
            width={400}
            height={225}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Aucune image</span>
          </div>
        )}
        {article.category && (
          <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
            {article.category.name}
          </span>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h2 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h2>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
          {article.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <div className="flex items-center">
            {article.author && (
              <span className="text-xs text-muted-foreground">
                Par {article.author.name}
              </span>
            )}
          </div>
          <time className="text-xs text-muted-foreground" dateTime={article.publishedAt}>
            {format(new Date(article.publishedAt), 'dd MMM yyyy', { locale: fr })}
          </time>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;

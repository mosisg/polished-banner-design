
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { StrapiArticle } from '@/services/strapi';
import { Calendar, User, Tag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ArticleHeaderProps {
  article: StrapiArticle;
}

const ArticleHeader = ({ article }: ArticleHeaderProps) => {
  return (
    <header>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4">
        {article.attributes.title}
      </h1>
      
      <p className="text-xl text-muted-foreground text-center mb-8">
        {article.attributes.description}
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-10">
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          <time dateTime={article.attributes.publishedAt}>
            {format(new Date(article.attributes.publishedAt), 'dd MMMM yyyy', { locale: fr })}
          </time>
        </div>
        
        {article.attributes.author?.data && (
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{article.attributes.author.data.attributes.name}</span>
          </div>
        )}
        
        {article.attributes.category?.data && (
          <div className="flex items-center">
            <Tag className="mr-2 h-4 w-4" />
            <span>{article.attributes.category.data.attributes.name}</span>
          </div>
        )}
      </div>
      
      <Separator className="my-8" />
    </header>
  );
};

export default ArticleHeader;

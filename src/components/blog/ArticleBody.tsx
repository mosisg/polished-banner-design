
import React from 'react';
import { StrapiArticle, getStrapiMedia } from '@/services/strapi';
import ArticleBlock from './ArticleBlock';

interface ArticleBodyProps {
  article: StrapiArticle;
}

const ArticleBody = ({ article }: ArticleBodyProps) => {
  return (
    <div>
      {article.attributes.cover?.data && (
        <figure className="my-8">
          <img 
            src={getStrapiMedia(article.attributes.cover.data.attributes.url)} 
            alt={article.attributes.cover.data.attributes.alternativeText || article.attributes.title}
            className="w-full h-auto rounded-xl"
          />
        </figure>
      )}
      
      <div className="mt-10 space-y-8">
        {article.attributes.blocks?.map((block, index) => (
          <ArticleBlock key={index} block={block} />
        ))}
      </div>
    </div>
  );
};

export default ArticleBody;

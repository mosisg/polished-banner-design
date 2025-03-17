
import React from 'react';
import { StrapiBlock, getStrapiMedia } from '@/services/strapi';

interface ArticleBlockProps {
  block: StrapiBlock;
}

const ArticleBlock = ({ block }: ArticleBlockProps) => {
  switch (block.__component) {
    case 'shared.rich-text':
      return (
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: block.body }} />
      );
    
    case 'shared.media':
      return (
        <figure className="my-8">
          <img 
            src={getStrapiMedia(block.file.data.attributes.url)} 
            alt={block.file.data.attributes.alternativeText || 'Image'} 
            className="w-full h-auto rounded-lg"
          />
        </figure>
      );
    
    case 'shared.quote':
      return (
        <blockquote className="border-l-4 border-primary pl-6 my-8 italic">
          {block.title && <p className="font-semibold text-xl mb-2">{block.title}</p>}
          <p className="text-muted-foreground">{block.body}</p>
        </blockquote>
      );
    
    case 'shared.slider':
      return (
        <div className="my-8">
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {block.files.data.map((file) => (
              <img 
                key={file.id}
                src={getStrapiMedia(file.attributes.url)} 
                alt={file.attributes.alternativeText || 'Image'} 
                className="h-60 w-auto rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
      );
    
    default:
      return null;
  }
};

export default ArticleBlock;

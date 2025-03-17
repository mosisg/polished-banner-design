
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getArticle, getStrapiMedia, StrapiBlock } from '@/services/strapi';
import Header from '@/components/layout/Header';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, User, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: articleData, isLoading, error } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => getArticle(slug || ''),
  });
  
  const article = articleData?.data[0];
  
  const renderBlock = (block: StrapiBlock) => {
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
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Article non trouvé</h1>
            <p className="text-muted-foreground mb-6">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
            <Button onClick={() => navigate('/blog')}>Retour au blog</Button>
          </div>
        </main>
      </div>
    );
  }
  
  const structuredData = article ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.attributes.title,
    "description": article.attributes.description,
    "datePublished": article.attributes.publishedAt,
    "dateModified": article.attributes.updatedAt,
    "author": {
      "@type": "Person",
      "name": article.attributes.author?.data?.attributes.name || "ComparePrix"
    },
    "image": article.attributes.cover?.data?.attributes.url
      ? getStrapiMedia(article.attributes.cover.data.attributes.url)
      : undefined
  } : null;

  return (
    <>
      <Helmet>
        <html lang="fr" />
        {article && (
          <>
            <title>{article.attributes.title} | Blog ComparePrix</title>
            <meta name="description" content={article.attributes.description} />
            <link rel="canonical" href={`https://compareprix.fr/blog/${article.attributes.slug}`} />
            {structuredData && (
              <script type="application/ld+json">
                {JSON.stringify(structuredData)}
              </script>
            )}
          </>
        )}
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Button variant="ghost" onClick={() => navigate('/blog')} className="group">
                <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Retour au blog
              </Button>
            </div>
            
            {isLoading ? (
              <div className="space-y-8">
                <Skeleton className="h-10 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-2/3 mx-auto" />
                <div className="flex justify-center gap-6 my-8">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="w-full h-96 rounded-xl" />
                <div className="space-y-4 mt-8">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              </div>
            ) : article ? (
              <article className="max-w-4xl mx-auto">
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
                    <div key={index}>
                      {renderBlock(block)}
                    </div>
                  ))}
                </div>
              </article>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Article non trouvé</p>
                <Button as={Link} to="/blog">Retour au blog</Button>
              </div>
            )}
          </div>
        </main>
        
        <footer className="bg-muted py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-blue-purple flex items-center justify-center">
                    <span className="text-white font-bold text-sm">C</span>
                  </div>
                  <div className="font-bold text-xl">
                    <span className="text-gradient-blue-purple">Compare</span>
                    <span className="text-gradient-purple-pink">Prix</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} ComparePrix. Tous droits réservés.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default BlogArticle;

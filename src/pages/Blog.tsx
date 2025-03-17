
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { getArticles, getStrapiMedia } from '@/services/strapi';
import Header from '@/components/layout/Header';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [page, setPage] = useState(1);
  
  const { data: articlesData, isLoading, error } = useQuery({
    queryKey: ['articles', page],
    queryFn: () => getArticles(page),
  });
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "headline": "Blog ComparePrix - Actualités et conseils sur les forfaits mobiles et box internet",
    "description": "Découvrez nos articles et conseils pour bien choisir votre forfait mobile ou box internet et faire des économies.",
    "author": {
      "@type": "Organization",
      "name": "ComparePrix",
      "url": "https://compareprix.fr"
    }
  };

  return (
    <>
      <Helmet>
        <html lang="fr" />
        <title>Blog ComparePrix - Actualités et conseils sur les forfaits mobiles et box internet</title>
        <meta name="description" content="Découvrez nos articles et conseils pour bien choisir votre forfait mobile ou box internet et faire des économies." />
        <link rel="canonical" href="https://compareprix.fr/blog" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4">
            <section className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
              <p className="text-xl text-muted-foreground">
                Découvrez nos derniers articles et conseils pour bien choisir votre forfait mobile ou box internet.
              </p>
            </section>
            
            <Separator className="my-8" />
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
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
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">Une erreur est survenue lors du chargement des articles.</p>
                <Button onClick={() => window.location.reload()}>Réessayer</Button>
              </div>
            ) : articlesData && articlesData.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articlesData.data.map((article) => (
                    <Link 
                      to={`/blog/${article.attributes.slug}`} 
                      key={article.id}
                      className="group rounded-xl overflow-hidden border border-border transition-all duration-300 hover:shadow-md flex flex-col h-full"
                    >
                      <div className="relative h-48 overflow-hidden">
                        {article.attributes.cover?.data ? (
                          <img 
                            src={getStrapiMedia(article.attributes.cover.data.attributes.url)} 
                            alt={article.attributes.cover.data.attributes.alternativeText || article.attributes.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground">Aucune image</span>
                          </div>
                        )}
                        {article.attributes.category?.data && (
                          <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                            {article.attributes.category.data.attributes.name}
                          </span>
                        )}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h2 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {article.attributes.title}
                        </h2>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                          {article.attributes.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                          <div className="flex items-center">
                            {article.attributes.author?.data && (
                              <span className="text-xs text-muted-foreground">
                                Par {article.attributes.author.data.attributes.name}
                              </span>
                            )}
                          </div>
                          <time className="text-xs text-muted-foreground">
                            {format(new Date(article.attributes.publishedAt), 'dd MMM yyyy', { locale: fr })}
                          </time>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {articlesData.meta.pagination.pageCount > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                      >
                        Précédent
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: articlesData.meta.pagination.pageCount }).map((_, i) => (
                          <Button 
                            key={i}
                            variant={page === i + 1 ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(i + 1)}
                            className="w-9 h-9"
                          >
                            {i + 1}
                          </Button>
                        ))}
                      </div>
                      
                      <Button 
                        variant="outline"
                        disabled={page === articlesData.meta.pagination.pageCount}
                        onClick={() => setPage(p => Math.min(articlesData.meta.pagination.pageCount, p + 1))}
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Aucun article disponible pour le moment.</p>
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

export default Blog;

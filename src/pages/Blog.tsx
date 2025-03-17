import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { getArticles, transformArticlesToSimpleFormat } from '@/services/strapi';
import Header from '@/components/layout/Header';
import { toast } from 'sonner';
import BlogHeader from '@/components/blog/BlogHeader';
import ArticleGrid from '@/components/blog/ArticleGrid';
import BlogPagination from '@/components/blog/BlogPagination';
import Footer from '@/components/layout/Footer';

const Blog = () => {
  const [page, setPage] = useState(1);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['articles', page],
    queryFn: async () => {
      try {
        const response = await getArticles(page);
        return {
          articles: transformArticlesToSimpleFormat(response.data),
          pagination: response.meta.pagination
        };
      } catch (error) {
        console.error("Error fetching articles:", error);
        throw error;
      }
    },
    retry: 1,
  });
  
  const handleRetry = () => {
    toast.promise(refetch(), {
      loading: 'Chargement des articles...',
      success: 'Les articles ont été chargés avec succès',
      error: 'Erreur lors du chargement des articles'
    });
  };
  
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
            <BlogHeader />
            
            <ArticleGrid 
              articles={data?.articles} 
              isLoading={isLoading} 
              error={error} 
              onRetry={handleRetry} 
            />
            
            {data?.pagination && (
              <BlogPagination 
                currentPage={page} 
                pageCount={data.pagination.pageCount} 
                onPageChange={setPage} 
              />
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Blog;

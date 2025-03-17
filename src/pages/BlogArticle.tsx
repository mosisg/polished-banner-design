
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getArticle, getStrapiMedia } from '@/services/strapi';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import ArticleHeader from '@/components/blog/ArticleHeader';
import ArticleBody from '@/components/blog/ArticleBody';
import ArticleSkeleton from '@/components/blog/ArticleSkeleton';
import ArticleErrorState from '@/components/blog/ArticleErrorState';

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: articleData, isLoading, error, refetch } = useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      try {
        const response = await getArticle(slug || '');
        if (response.data.length === 0) {
          throw new Error("Article not found");
        }
        return response.data[0];
      } catch (error) {
        console.error("Error fetching article:", error);
        throw error;
      }
    },
    retry: 1,
  });
  
  const handleRetry = () => {
    toast.promise(refetch(), {
      loading: 'Chargement de l\'article...',
      success: 'L\'article a été chargé avec succès',
      error: 'Erreur lors du chargement de l\'article'
    });
  };
  
  const structuredData = articleData ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": articleData.attributes.title,
    "description": articleData.attributes.description,
    "datePublished": articleData.attributes.publishedAt,
    "dateModified": articleData.attributes.updatedAt,
    "author": {
      "@type": "Person",
      "name": articleData.attributes.author?.data?.attributes.name || "ComparePrix"
    },
    "image": articleData.attributes.cover?.data?.attributes.url
      ? getStrapiMedia(articleData.attributes.cover.data.attributes.url)
      : undefined
  } : null;

  return (
    <>
      <Helmet>
        <html lang="fr" />
        {articleData && (
          <>
            <title>{articleData.attributes.title} | Blog ComparePrix</title>
            <meta name="description" content={articleData.attributes.description} />
            <link rel="canonical" href={`https://compareprix.fr/blog/${articleData.attributes.slug}`} />
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
              <ArticleSkeleton />
            ) : error ? (
              <ArticleErrorState onRetry={handleRetry} />
            ) : articleData ? (
              <article className="max-w-4xl mx-auto">
                <ArticleHeader article={articleData} />
                <ArticleBody article={articleData} />
              </article>
            ) : (
              <ArticleErrorState />
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

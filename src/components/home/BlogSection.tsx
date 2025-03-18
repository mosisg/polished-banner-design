
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Newspaper, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from "@/components/ui/carousel";
import { getArticles, transformArticlesToSimpleFormat } from '@/services/strapi';

const BlogSection = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['homepageArticles'],
    queryFn: async () => {
      const response = await getArticles(1, 5);
      return transformArticlesToSimpleFormat(response.data);
    }
  });

  return (
    <section className="py-16 bg-white dark:bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <Newspaper className="h-7 w-7 text-primary" />
              <h2 className="text-3xl font-bold">Actualités Telecom & Conseils</h2>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Restez informé des dernières nouveautés du monde des télécommunications et découvrez nos conseils pour faire les meilleurs choix.
            </p>
            <Button asChild size="lg" className="group">
              <Link to="/blog" className="inline-flex items-center">
                Lire nos articles
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="relative mt-8 mx-auto max-w-5xl">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden border border-border">
                  <Skeleton className="h-40 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-muted-foreground">
              Impossible de charger les derniers articles pour le moment.
            </p>
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {data?.map((article) => (
                  <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
                    <Link to={`/blog/${article.slug}`}>
                      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow border border-border">
                        <div className="w-full h-40 overflow-hidden">
                          <img 
                            src={article.cover.url} 
                            alt={article.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground mb-1">
                            {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                          <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </div>
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

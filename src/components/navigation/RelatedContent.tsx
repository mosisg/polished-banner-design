
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface RelatedLink {
  path: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface RelatedContentProps {
  title?: string;
  links: RelatedLink[];
}

const RelatedContent: React.FC<RelatedContentProps> = ({ 
  title = "Contenu connexe",
  links 
}) => {
  if (links.length === 0) return null;
  
  return (
    <section className="py-8 bg-muted/20" aria-labelledby="related-content-title">
      <div className="container">
        <h2 id="related-content-title" className="text-2xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {link.icon && <span className="mr-2" aria-hidden="true">{link.icon}</span>}
                  {link.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {link.description && (
                  <p className="text-muted-foreground text-sm mb-3">{link.description}</p>
                )}
                <Link 
                  to={link.path} 
                  className="text-primary flex items-center text-sm font-medium hover:underline"
                  aria-label={`En savoir plus sur ${link.label}`}
                >
                  En savoir plus <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedContent;

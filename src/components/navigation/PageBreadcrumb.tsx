import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon } from 'lucide-react';

// Map of URL paths to their display names
const pathNames: Record<string, string> = {
  '': 'Accueil',
  'mobile': 'Forfaits Mobile',
  'internet': 'Box Internet',
  'telephones': 'Téléphones',
  'blog': 'Blog',
  'terms': 'CGV',
  'privacy': 'Politique de Confidentialité',
  'cookies': 'Politique des Cookies',
  'legal': 'Mentions Légales',
  'sitemap': 'Plan du Site',
};

interface PageBreadcrumbProps {
  customPaths?: Array<{
    path: string;
    label: string;
  }>;
}

const PageBreadcrumb = ({ customPaths }: PageBreadcrumbProps) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // If no segments (homepage), don't show breadcrumbs
  if (pathSegments.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className="px-4 py-3 md:px-8 bg-muted/30 border-b border-border/40">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" aria-label="Accueil">
              <HomeIcon className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {customPaths ? (
          // Use custom paths if provided
          customPaths.map((item, index) => {
            const isLast = index === customPaths.length - 1;
            return (
              <React.Fragment key={item.path}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={item.path}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })
        ) : (
          // Otherwise, auto-generate from path
          pathSegments.map((segment, index) => {
            const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
            const isLast = index === pathSegments.length - 1;
            const label = pathNames[segment] || segment;
            
            return (
              <React.Fragment key={path}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={path}>{label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageBreadcrumb;

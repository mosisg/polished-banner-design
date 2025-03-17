
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Page non trouvée | ComparePrix</title>
        <meta name="description" content="La page que vous recherchez n'existe pas ou a été déplacée." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md px-4">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Page non trouvée</h2>
          <p className="text-muted-foreground mb-6">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Button asChild className="gap-2">
            <a href="/">
              <HomeIcon className="h-4 w-4" />
              Retour à l'accueil
            </a>
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotFound;

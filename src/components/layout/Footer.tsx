
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-muted py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
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
        
        <div className="border-t border-border pt-6">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link to="/politique-confidentialite" className="hover:underline hover:text-primary transition-colors">
              Politique de confidentialité
            </Link>
            <Link to="/politique-cookies" className="hover:underline hover:text-primary transition-colors">
              Politique de cookies
            </Link>
            <Link to="/mentions-legales" className="hover:underline hover:text-primary transition-colors">
              Mentions légales
            </Link>
            <Link to="/cgv" className="hover:underline hover:text-primary transition-colors">
              CGV
            </Link>
            <Link to="/sitemap.xml" className="hover:underline hover:text-primary transition-colors">
              Plan du site
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

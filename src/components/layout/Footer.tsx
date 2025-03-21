
import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Wifi, Phone, FileText, Shield, HelpCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1e2029] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-blue-purple flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <div className="font-bold text-xl">
                <span className="text-gradient-blue-purple">Compare</span>
                <span className="text-gradient-purple-pink">Prix</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Comparateur indépendant de forfaits mobiles, box internet et téléphones en France.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Nos Comparateurs</h3>
            <ul className="text-gray-400 space-y-2">
              <li>
                <Link to="/mobile" className="hover:text-primary transition-colors flex items-center">
                  <Smartphone className="h-4 w-4 mr-2" />
                  <span>Forfaits Mobiles</span>
                </Link>
              </li>
              <li>
                <Link to="/internet" className="hover:text-primary transition-colors flex items-center">
                  <Wifi className="h-4 w-4 mr-2" />
                  <span>Box Internet</span>
                </Link>
              </li>
              <li>
                <Link to="/telephones" className="hover:text-primary transition-colors flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>Téléphones</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Ressources</h3>
            <ul className="text-gray-400 space-y-2">
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Blog</span>
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="hover:text-primary transition-colors flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <span>Plan du site</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Informations Légales</h3>
            <ul className="text-gray-400 space-y-2">
              <li>
                <Link to="/politique-confidentialite" className="hover:text-primary transition-colors flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Politique de confidentialité</span>
                </Link>
              </li>
              <li>
                <Link to="/politique-cookies" className="hover:text-primary transition-colors">
                  Politique de cookies
                </Link>
              </li>
              <li>
                <Link to="/mentions-legales" className="hover:text-primary transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/cgv" className="hover:text-primary transition-colors">
                  CGV
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} ComparePrix. Tous droits réservés.
          </div>
          <div>
            <Link to="/sitemap.xml" className="text-sm text-gray-400 hover:underline hover:text-primary transition-colors">
              Plan du site XML
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

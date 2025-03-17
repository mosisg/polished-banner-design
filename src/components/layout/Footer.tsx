
import React from 'react';

const Footer = () => {
  return (
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
  );
};

export default Footer;

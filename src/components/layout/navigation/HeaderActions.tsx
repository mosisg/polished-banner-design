
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface HeaderActionsProps {
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

const HeaderActions = ({ 
  toggleMobileMenu, 
  isMobileMenuOpen 
}: HeaderActionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <ThemeToggle />
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMobileMenu}
        className="md:hidden"
        aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-navigation"
        type="button"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default HeaderActions;

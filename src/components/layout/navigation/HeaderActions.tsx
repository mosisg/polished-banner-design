
import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, ShieldAlert, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface HeaderActionsProps {
  user: any;
  handleLogout: () => Promise<void>;
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

const HeaderActions = ({ 
  user, 
  handleLogout, 
  toggleMobileMenu, 
  isMobileMenuOpen 
}: HeaderActionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      {/* Admin link - showing for all logged in users */}
      {user && (
        <Link
          to="/admin/knowledge-base"
          className="flex items-center px-3 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-all duration-200 text-sm font-medium"
        >
          <ShieldAlert className="w-4 h-4 mr-2" />
          <span className="hidden md:inline">Admin</span>
        </Link>
      )}
      
      {/* Login/Logout Button */}
      {user ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="flex items-center"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span className="hidden md:inline">Déconnexion</span>
        </Button>
      ) : (
        <Link to="/login">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <LogIn className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Connexion</span>
          </Button>
        </Link>
      )}
      
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

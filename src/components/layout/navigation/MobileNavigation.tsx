
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Wifi, FileText, LogIn, LogOut, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavItem } from './types';

interface MobileNavigationProps {
  navItems: NavItem[];
  isOpen: boolean;
  headerHeight: number | undefined;
  handleCloseMobileMenu: () => void;
  user: any;
  handleLogout: () => Promise<void>;
}

const MobileNavigation = ({
  navItems,
  isOpen,
  headerHeight,
  handleCloseMobileMenu,
  user,
  handleLogout
}: MobileNavigationProps) => {
  return (
    <>
      <div 
        id="mobile-navigation"
        className={cn(
          "md:hidden fixed inset-x-0 bg-background border-b border-border z-40",
          "transition-[opacity,margin-top] duration-300 ease-in-out",
          "shadow-lg backdrop-blur-lg",
          isOpen
            ? "mt-16 opacity-100"
            : "-mt-[100vh] opacity-0"
        )}
        style={{ top: headerHeight || "4rem" }}
      >
        <nav className="container mx-auto py-2 px-4 flex flex-col">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="py-3 px-4 rounded-lg hover:bg-muted/50 flex items-center text-foreground cursor-pointer"
              role="menuitem"
              onClick={handleCloseMobileMenu}
            >
              {React.cloneElement(item.icon, { className: "w-5 h-5 mr-3" })}
              <span className="text-base">{item.label}</span>
            </Link>
          ))}
          
          {/* Admin link in mobile menu - showing for all logged in users */}
          {user && (
            <Link
              to="/admin/knowledge-base"
              className="py-3 px-4 rounded-lg hover:bg-muted/50 flex items-center text-foreground cursor-pointer"
              role="menuitem"
              onClick={handleCloseMobileMenu}
            >
              <ShieldAlert className="w-5 h-5 mr-3" />
              <span className="text-base">Admin</span>
            </Link>
          )}
          
          {/* Auth links in mobile menu */}
          {user ? (
            <button
              className="py-3 px-4 rounded-lg hover:bg-muted/50 flex items-center text-foreground cursor-pointer w-full text-left"
              role="menuitem"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="text-base">Déconnexion</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="py-3 px-4 rounded-lg hover:bg-muted/50 flex items-center text-foreground cursor-pointer"
              role="menuitem"
              onClick={handleCloseMobileMenu}
            >
              <LogIn className="w-5 h-5 mr-3" />
              <span className="text-base">Connexion</span>
            </Link>
          )}
        </nav>
      </div>

      {/* Overlay behind mobile menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 md:hidden" 
          onClick={handleCloseMobileMenu}
          role="presentation"
        />
      )}
    </>
  );
};

export default MobileNavigation;

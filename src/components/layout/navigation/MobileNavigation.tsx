
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NavItem } from './types';

interface MobileNavigationProps {
  navItems: NavItem[];
  isOpen: boolean;
  headerHeight: number | undefined;
  handleCloseMobileMenu: () => void;
}

const MobileNavigation = ({
  navItems,
  isOpen,
  headerHeight,
  handleCloseMobileMenu
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
          
          {/* Admin links now accessible to anyone */}
          <Link
            to="/admin/knowledge-base"
            className="py-3 px-4 rounded-lg hover:bg-muted/50 flex items-center text-foreground cursor-pointer"
            role="menuitem"
            onClick={handleCloseMobileMenu}
          >
            <span className="text-base">Admin Base de Connaissances</span>
          </Link>
          
          <Link
            to="/admin/users"
            className="py-3 px-4 rounded-lg hover:bg-muted/50 flex items-center text-foreground cursor-pointer"
            role="menuitem"
            onClick={handleCloseMobileMenu}
          >
            <span className="text-base">Admin Utilisateurs</span>
          </Link>
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

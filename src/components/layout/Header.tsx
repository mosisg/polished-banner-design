
import React from 'react';
import { cn } from '@/lib/utils';
import { useHeaderController } from './navigation/useHeaderController';
import Logo from './navigation/Logo';
import DesktopNavigation from './navigation/DesktopNavigation';
import MobileNavigation from './navigation/MobileNavigation';
import HeaderActions from './navigation/HeaderActions';
import { navItems } from './navigation/navItems';

const Header = () => {
  const {
    isScrolled,
    isMobileMenuOpen,
    headerRef,
    toggleMobileMenu,
    handleCloseMobileMenu
  } = useHeaderController();

  return (
    <header 
      ref={headerRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 h-16",
        isScrolled 
          ? "bg-background/80 backdrop-blur-lg shadow-md" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <DesktopNavigation navItems={navItems} />

          {/* Right Side Actions */}
          <HeaderActions 
            toggleMobileMenu={toggleMobileMenu} 
            isMobileMenuOpen={isMobileMenuOpen} 
          />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation 
        navItems={navItems}
        isOpen={isMobileMenuOpen}
        headerHeight={headerRef.current?.offsetHeight}
        handleCloseMobileMenu={handleCloseMobileMenu}
      />
    </header>
  );
};

export default Header;

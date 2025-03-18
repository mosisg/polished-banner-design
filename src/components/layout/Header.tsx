
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Phone, Wifi, Home, Flame, Package, Smartphone, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Forfait Mobile', href: '/mobile', icon: <Smartphone className="w-4 h-4 mr-2" /> },
  { label: 'Box Internet', href: '/internet', icon: <Wifi className="w-4 h-4 mr-2" /> },
  { label: 'Téléphones', href: '/telephones', icon: <Phone className="w-4 h-4 mr-2" /> },
  { label: 'Box + Mobile', href: '/packages', icon: <Package className="w-4 h-4 mr-2" /> },
  { label: 'Blog', href: '/blog', icon: <FileText className="w-4 h-4 mr-2" /> },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8",
        isScrolled 
          ? "py-2 bg-background/95 backdrop-blur-lg shadow-md" 
          : "py-3 md:py-5 bg-transparent"
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group transition-all"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-blue-purple flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-base md:text-lg">C</span>
            </div>
            <div className="font-bold text-xl md:text-2xl tracking-tight transition-colors">
              <span className="text-gradient-blue-purple">Compare</span>
              <span className="text-gradient-purple-pink">Prix</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="relative px-3 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-all duration-200 flex items-center text-sm font-medium"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              type="button"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={cn(
          "md:hidden fixed inset-x-0 top-[58px] bg-background/95 backdrop-blur-lg border-b border-border transform transition-all duration-300 ease-in-out z-40",
          isMobileMenuOpen 
            ? "translate-y-0 opacity-100 shadow-md" 
            : "-translate-y-full opacity-0"
        )}
      >
        <nav className="container mx-auto py-3 px-4 flex flex-col space-y-1">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="py-3 px-4 rounded-lg hover:bg-muted/70 flex items-center transition-colors text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="w-8 flex justify-center">{item.icon}</div>
              <span className="ml-2 font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;

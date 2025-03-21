
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Phone, Wifi, Home, Book, Smartphone, FileText, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactElement;
}

const navItems: NavItem[] = [
  { label: 'Forfait Mobile', href: '/mobile', icon: <Smartphone className="w-4 h-4 mr-2" /> },
  { label: 'Box Internet', href: '/internet', icon: <Wifi className="w-4 h-4 mr-2" /> },
  { label: 'Téléphones', href: '/telephones', icon: <Phone className="w-4 h-4 mr-2" /> },
  { label: 'Blog', href: '/blog', icon: <FileText className="w-4 h-4 mr-2" /> },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Gestion du défilement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Blocage du défilement
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Fermeture au clic externe
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle closing the mobile menu
  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle navigation without page reload
  const handleNavigate = (href: string, event: React.MouseEvent) => {
    event.preventDefault();
    navigate(href);
    setIsMobileMenuOpen(false);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
          <Link 
            to="/"
            className="flex items-center space-x-2 group transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-blue-purple flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div className="font-bold text-2xl tracking-tight transition-colors">
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
                className="relative px-3 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-all duration-200 flex items-center text-sm font-medium cursor-pointer"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {isAdmin && (
              <Link
                to="/admin/knowledge-base"
                className="hidden md:flex items-center px-3 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-all duration-200 text-sm font-medium"
              >
                <Book className="w-4 h-4 mr-2" />
                Admin
              </Link>
            )}
            
            {/* Login/Logout Button - Modified to show on all screen sizes */}
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              type="button"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        id="mobile-navigation"
        className={cn(
          "md:hidden fixed inset-x-0 bg-background border-b border-border z-40",
          "transition-[opacity,margin-top] duration-300 ease-in-out",
          "shadow-lg backdrop-blur-lg",
          isMobileMenuOpen
            ? "mt-16 opacity-100"
            : "-mt-[100vh] opacity-0"
        )}
        style={{ top: headerRef.current?.offsetHeight || "4rem" }}
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
          
          {/* Auth links in mobile menu */}
          {user ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin/knowledge-base"
                  className="py-3 px-4 rounded-lg hover:bg-muted/50 flex items-center text-foreground cursor-pointer"
                  role="menuitem"
                  onClick={handleCloseMobileMenu}
                >
                  <Book className="w-5 h-5 mr-3" />
                  <span className="text-base">Admin</span>
                </Link>
              )}
              <button
                className="py-3 px-4 rounded-lg hover:bg-muted/50 flex items-center text-foreground cursor-pointer w-full text-left"
                role="menuitem"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span className="text-base">Déconnexion</span>
              </button>
            </>
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

      {/* Overlay arrière */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
          role="presentation"
        />
      )}
    </header>
  );
};

export default Header;

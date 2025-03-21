
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useHeaderController = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
      console.log("Header controller: Initiating logout");
      await signOut();
      console.log("Header controller: Logout successful, navigating to home");
      navigate('/', { replace: true });
      return Promise.resolve();
    } catch (error) {
      console.error('Logout error:', error);
      return Promise.reject(error);
    }
  };

  return {
    isScrolled,
    isMobileMenuOpen,
    headerRef,
    user,
    toggleMobileMenu,
    handleCloseMobileMenu,
    handleNavigate,
    handleLogout
  };
};


import React from 'react';
import { Link } from 'react-router-dom';
import { NavItem } from './types';

interface DesktopNavigationProps {
  navItems: NavItem[];
}

const DesktopNavigation = ({ navItems }: DesktopNavigationProps) => {
  return (
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
  );
};

export default DesktopNavigation;

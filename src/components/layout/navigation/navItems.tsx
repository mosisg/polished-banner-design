
import React from 'react';
import { Phone, Wifi, Smartphone, FileText, LogIn } from 'lucide-react';
import { NavItem } from './types';

export const navItems: NavItem[] = [
  { label: 'Forfait Mobile', href: '/mobile', icon: <Smartphone className="w-4 h-4 mr-2" /> },
  { label: 'Box Internet', href: '/internet', icon: <Wifi className="w-4 h-4 mr-2" /> },
  { label: 'Téléphones', href: '/telephones', icon: <Phone className="w-4 h-4 mr-2" /> },
  { label: 'Blog', href: '/blog', icon: <FileText className="w-4 h-4 mr-2" /> },
  { label: 'Connexion / Inscription', href: '/login', icon: <LogIn className="w-4 h-4 mr-2" /> },
];

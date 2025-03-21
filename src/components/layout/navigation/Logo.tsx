
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
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
  );
};

export default Logo;


import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nous gardons cette vérification, mais elle sera gérée au niveau de l'interface utilisateur
  // plutôt que par une redirection complète
  if (adminOnly && !isAdmin) {
    // Au lieu de rediriger, nous montrons toujours l'interface mais avec des restrictions
    console.log("Utilisateur non administrateur accédant à une section protégée");
  }

  return <>{children}</>;
};

export default ProtectedRoute;

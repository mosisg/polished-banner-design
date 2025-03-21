
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Show a toast if trying to access admin-only routes without admin privileges
    if (!isLoading && user && adminOnly && !isAdmin) {
      toast({
        title: "Accès restreint",
        description: "Vous n'avez pas les droits d'administrateur nécessaires pour accéder à cette page.",
        variant: "destructive"
      });
    }
  }, [user, isAdmin, adminOnly, isLoading, toast]);

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

  // Redirect non-admin users trying to access admin-only routes
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

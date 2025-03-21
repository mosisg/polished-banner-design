
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
  const { user, isLoading, isAdmin, session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if session is invalid but we still have user data
    if (!isLoading && !session && user) {
      toast({
        title: "Session expirée",
        description: "Votre session a expiré. Veuillez vous reconnecter.",
        variant: "destructive"
      });
      navigate("/admin/login", { replace: true, state: { from: location.pathname } });
      return;
    }

    // Show a toast if trying to access admin-only routes without admin privileges
    if (!isLoading && user && adminOnly && !isAdmin) {
      toast({
        title: "Accès restreint",
        description: "Vous n'avez pas les droits d'administrateur nécessaires pour accéder à cette page.",
        variant: "destructive"
      });
    }
  }, [user, isAdmin, adminOnly, isLoading, toast, session, navigate, location]);

  console.log("ProtectedRoute state:", {
    isLoading,
    hasUser: !!user,
    hasSession: !!session,
    isAdmin,
    adminOnly,
    currentPath: location.pathname
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // No user or no valid session - redirect to admin login with current path in state
  if (!user || !session) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  // Redirect non-admin users trying to access admin-only routes
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

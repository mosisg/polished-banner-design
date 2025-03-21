
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const { user, isLoading, session, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Rediriger vers la page de login si l'utilisateur n'est pas connecté
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté et n'est pas déjà sur la page de login
  if (!user || !session) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="font-bold text-xl text-primary">Tableau de bord administrateur</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Connecté en tant que {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

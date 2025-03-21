
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const AdminLayout: React.FC = () => {
  const { user, isLoading, session, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  console.log("AdminLayout state:", {
    isLoading,
    hasUser: !!user,
    hasSession: !!session,
    isAdmin,
    currentPath: location.pathname
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !session) {
    toast({
      title: "Accès non autorisé",
      description: "Veuillez vous connecter pour accéder à cette page.",
      variant: "destructive"
    });
    navigate('/admin/login', { replace: true, state: { from: location.pathname } });
    return null;
  }

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

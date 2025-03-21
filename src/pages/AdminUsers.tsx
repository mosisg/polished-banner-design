
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import AdminUserForm from '@/components/admin/users/AdminUserForm';
import AdminUserInfo from '@/components/admin/users/AdminUserInfo';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminUsers = () => {
  const { user, isAdmin, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!session || !user) {
      toast({
        title: 'Session expirée',
        description: 'Votre session a expiré. Veuillez vous reconnecter.',
        variant: 'destructive',
      });
      navigate('/login', { state: { from: '/admin/users' }, replace: true });
      return;
    }
    
    // Vérifier si l'utilisateur est admin
    if (!isAdmin) {
      toast({
        title: 'Accès restreint',
        description: 'Vous n\'avez pas les droits d\'administrateur nécessaires pour accéder à cette page.',
        variant: 'destructive',
      });
      navigate('/', { replace: true });
    }
  }, [user, isAdmin, session, navigate, toast]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <>
      <Helmet>
        <title>Gestion des Administrateurs | ComparePrix</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleGoBack} 
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
            <h1 className="text-3xl font-bold">
              Gestion des Administrateurs
            </h1>
            {isAdmin && (
              <Shield className="h-5 w-5 ml-2 text-primary" />
            )}
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ajouter un administrateur</CardTitle>
              <AdminUserInfo />
            </CardHeader>
            
            <CardContent>
              <AdminUserForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default AdminUsers;

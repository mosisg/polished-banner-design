
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import KnowledgeBaseManager from '@/components/admin/KnowledgeBaseManager';
import SystemStatusChecker from '@/components/admin/SystemStatusChecker';
import { Button } from '@/components/ui/button';
import { ShieldCheck, AlertTriangle, LogOut, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

const KnowledgeBase = () => {
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Base de Connaissances | ComparePrix</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              Administration de la Base de Connaissances
            </h1>
            
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  Retour à l'accueil
                </Button>
              </Link>
              
              <Link to="/admin/users">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" />
                  Gérer les administrateurs
                </Button>
              </Link>
              
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
          
          {!isAdmin && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Accès limité</AlertTitle>
              <AlertDescription>
                Vous êtes connecté mais vous n'avez pas les droits d'administrateur. 
                Certaines fonctionnalités peuvent être limitées. Contactez un administrateur 
                pour obtenir des droits supplémentaires.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mb-8">
            <SystemStatusChecker />
          </div>
          
          <KnowledgeBaseManager />
        </div>
      </main>
    </>
  );
};

export default KnowledgeBase;

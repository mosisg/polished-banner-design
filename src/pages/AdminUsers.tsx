
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import AdminUserForm from '@/components/admin/users/AdminUserForm';
import AdminUserInfo from '@/components/admin/users/AdminUserInfo';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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

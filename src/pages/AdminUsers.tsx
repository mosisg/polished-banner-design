
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import AdminUserForm from '@/components/admin/users/AdminUserForm';
import AdminUserInfo from '@/components/admin/users/AdminUserInfo';

const AdminUsers = () => {
  const { user } = useAuth();
  
  return (
    <>
      <Helmet>
        <title>Gestion des Administrateurs | ComparePrix</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">
            Gestion des Administrateurs
          </h1>
          
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

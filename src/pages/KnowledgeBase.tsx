
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import KnowledgeBaseManager from '@/components/admin/KnowledgeBaseManager';
import SystemStatusChecker from '@/components/admin/SystemStatusChecker';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const KnowledgeBase = () => {
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
                  Gérer les administrateurs
                </Button>
              </Link>
            </div>
          </div>
          
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

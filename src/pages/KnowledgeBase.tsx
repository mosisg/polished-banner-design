
import React from 'react';
import { Helmet } from 'react-helmet-async';
import KnowledgeBaseManager from '@/components/admin/KnowledgeBaseManager';
import SystemStatusChecker from '@/components/admin/SystemStatusChecker';

const KnowledgeBase = () => {
  return (
    <>
      <Helmet>
        <title>Base de Connaissances | ComparePrix</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">
            Administration de la Base de Connaissances
          </h1>
          
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

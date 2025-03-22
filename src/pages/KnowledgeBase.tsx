
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageBreadcrumb from '@/components/navigation/PageBreadcrumb';
import KnowledgeBaseManager from '@/components/support/knowledge/KnowledgeBaseManager';

const KnowledgeBase = () => {
  return (
    <>
      <Helmet>
        <title>Base de connaissances - ComparePrix</title>
        <meta name="description" content="Gérer la base de connaissances de l'assistant virtuel Prixo" />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <PageBreadcrumb 
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Base de connaissances', href: '/knowledge-base' }
          ]} 
        />
        <h1 className="text-3xl font-bold mb-6">Base de connaissances de Prixo</h1>
        <KnowledgeBaseManager />
      </div>
    </>
  );
};

export default KnowledgeBase;

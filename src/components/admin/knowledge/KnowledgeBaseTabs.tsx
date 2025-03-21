
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import DocumentForm from './DocumentForm';
import DocumentList from './DocumentList';

const KnowledgeBaseTabs = () => {
  const [selectedTab, setSelectedTab] = useState('add');

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <div className="h-8 w-8 text-primary">🗄️</div>
        Gestion de la Base de Connaissances
      </h1>
      
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Les documents ajoutés seront utilisés pour enrichir les réponses de l'assistant. 
          Ajoutez uniquement des informations fiables et pertinentes pour votre entreprise.
        </AlertDescription>
      </Alert>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="add">Ajouter un document</TabsTrigger>
          <TabsTrigger value="manage">Gérer les documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="add">
          <DocumentForm />
        </TabsContent>
        
        <TabsContent value="manage">
          <DocumentList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeBaseTabs;

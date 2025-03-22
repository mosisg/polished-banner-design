
import React, { useState, useEffect } from 'react';
import { Loader2, PlusCircle, MessageSquare } from 'lucide-react';
import { getDocuments, deleteDocument, DocumentItem } from '@/services/openai/documentService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import DocumentUploadForm from './DocumentUploadForm';
import DocumentList from './DocumentList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const KnowledgeBaseManager: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const { toast } = useToast();

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les documents.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDocumentDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      setDocuments(documents.filter(doc => doc.id !== id));
      toast({
        title: 'Document supprimé',
        description: 'Le document a été supprimé avec succès.',
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le document.',
        variant: 'destructive',
      });
    }
  };

  const handleDocumentAdded = () => {
    loadDocuments();
    setShowUploadForm(false);
    toast({
      title: 'Document ajouté',
      description: 'Le document a été ajouté avec succès à la base de connaissances.',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Base de connaissances</h2>
            <p className="text-muted-foreground mt-1">
              Gérez les documents utilisés par l'assistant virtuel Prixo
            </p>
          </div>
          <Button 
            onClick={() => setShowUploadForm(prev => !prev)}
            className="mt-4 sm:mt-0"
          >
            {showUploadForm ? 'Annuler' : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un document
              </>
            )}
          </Button>
        </div>

        {showUploadForm && (
          <div className="mb-6">
            <DocumentUploadForm onDocumentAdded={handleDocumentAdded} />
          </div>
        )}

        <Tabs defaultValue="documents">
          <TabsList>
            <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Chargement des documents...</span>
              </div>
            ) : (
              <DocumentList 
                documents={documents} 
                onDelete={handleDocumentDelete} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="stats" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-4 flex items-center">
                <MessageSquare className="h-8 w-8 text-primary mr-4" />
                <div>
                  <div className="text-xl font-bold">{documents.length}</div>
                  <div className="text-sm text-muted-foreground">Documents dans la base</div>
                </div>
              </Card>
              {/* More stats can be added here in the future */}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default KnowledgeBaseManager;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Loader2 } from 'lucide-react';
import { 
  getDocuments, 
  deleteDocument,
  DocumentItem as DocumentItemType
} from '@/services/openai/documentService';
import { useToast } from '@/hooks/use-toast';
import DocumentItem from './DocumentItem';

const DocumentList = () => {
  const [documents, setDocuments] = useState<DocumentItemType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer les documents.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      return;
    }

    try {
      await deleteDocument(id);
      toast({
        title: 'Succès',
        description: 'Document supprimé avec succès.',
        variant: 'default',
      });
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le document.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents dans la base de connaissances</CardTitle>
        <CardDescription>
          Consultez et gérez les documents utilisés pour enrichir les réponses de l'assistant.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : documents.length > 0 ? (
          <ScrollArea className="h-[500px] rounded-md border">
            <div className="p-4 space-y-4">
              {documents.map((doc) => (
                <DocumentItem 
                  key={doc.id} 
                  document={doc} 
                  onDelete={handleDeleteDocument} 
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun document trouvé</h3>
            <p className="text-muted-foreground">
              Ajoutez des documents à votre base de connaissances pour améliorer les réponses de l'assistant.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentList;

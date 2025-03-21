
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';
import { 
  prepareDocumentForIngestion, 
  ingestDocuments,
} from '@/services/openai/documentService';
import { useToast } from '@/hooks/use-toast';

const DocumentForm = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [newDocumentContent, setNewDocumentContent] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentSource, setDocumentSource] = useState('');
  const [documentCategory, setDocumentCategory] = useState('');
  const { toast } = useToast();

  const handleAddDocument = async () => {
    if (!newDocumentContent.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le contenu du document ne peut pas être vide.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const metadata = {
        title: documentTitle || 'Document sans titre',
        source: documentSource || 'Manuel',
        category: documentCategory || 'Général',
        date_added: new Date().toISOString(),
      };

      const preparedDocuments = prepareDocumentForIngestion(newDocumentContent, metadata);
      
      const result = await ingestDocuments(preparedDocuments);
      
      if (result.success) {
        toast({
          title: 'Succès',
          description: `${result.inserted} document(s) ajouté(s) à la base de connaissances.`,
          variant: 'default',
        });
        
        // Reset form
        setNewDocumentContent('');
        setDocumentTitle('');
        setDocumentSource('');
        setDocumentCategory('');
      } else {
        throw new Error('Échec de l\'ajout du document');
      }
    } catch (error) {
      console.error('Error adding document:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter le document à la base de connaissances.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouveau document</CardTitle>
        <CardDescription>
          Ajoutez du contenu à votre base de connaissances. Les documents longs seront automatiquement
          divisés en morceaux plus petits pour une meilleure indexation.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du document</Label>
            <Input
              id="title"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Guide d'utilisation"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Input
              id="category"
              value={documentCategory}
              onChange={(e) => setDocumentCategory(e.target.value)}
              placeholder="FAQ, Manuel, etc."
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Input
            id="source"
            value={documentSource}
            onChange={(e) => setDocumentSource(e.target.value)}
            placeholder="Site web, documentation interne, etc."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Contenu du document</Label>
          <Textarea
            id="content"
            value={newDocumentContent}
            onChange={(e) => setNewDocumentContent(e.target.value)}
            placeholder="Entrez le texte du document..."
            className="min-h-[200px]"
          />
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleAddDocument} 
          disabled={isUploading || !newDocumentContent.trim()}
          className="w-full sm:w-auto"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Ajouter à la base de connaissances
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentForm;

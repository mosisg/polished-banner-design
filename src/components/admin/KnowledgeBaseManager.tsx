
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Upload, Database, Trash2, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { 
  prepareDocumentForIngestion, 
  ingestDocuments, 
  getDocuments, 
  deleteDocument 
} from '@/services/openai/documentService';
import { useToast } from '@/hooks/use-toast';

interface DocumentItem {
  id: string;
  content: string;
  metadata: {
    title?: string;
    source?: string;
    category?: string;
    [key: string]: any;
  };
  created_at: string;
}

const KnowledgeBaseManager = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newDocumentContent, setNewDocumentContent] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentSource, setDocumentSource] = useState('');
  const [documentCategory, setDocumentCategory] = useState('');
  const [selectedTab, setSelectedTab] = useState('add');
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
    if (selectedTab === 'manage') {
      fetchDocuments();
    }
  }, [selectedTab]);

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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Database className="h-8 w-8 text-primary" />
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
        </TabsContent>
        
        <TabsContent value="manage">
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
                      <div 
                        key={doc.id} 
                        className="p-4 border rounded-lg bg-background hover:bg-accent/10 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-medium">{doc.metadata.title || "Document sans titre"}</h3>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          {doc.metadata.category && (
                            <Badge variant="outline" className="text-xs">
                              {doc.metadata.category}
                            </Badge>
                          )}
                          {doc.metadata.source && (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              Source: {doc.metadata.source}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            Ajouté le: {new Date(doc.created_at).toLocaleDateString()}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {doc.content}
                        </p>
                      </div>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeBaseManager;

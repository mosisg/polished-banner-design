
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, AlertTriangle, RefreshCcw, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SystemStatusProps {
  onRefresh?: () => void;
}

const SystemStatusChecker: React.FC<SystemStatusProps> = ({ onRefresh }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tableExists, setTableExists] = useState(false);
  const [functionExists, setFunctionExists] = useState(false);
  const [edgeFunctionsReady, setEdgeFunctionsReady] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  
  const checkSystem = async () => {
    setIsLoading(true);
    
    try {
      // Check if documents table exists
      const { data: tableData, error: tableError } = await (supabase
        .from('documents') as any)
        .select('id')
        .limit(1);
      
      setTableExists(!tableError);
      
      // Check if search function exists by trying to call it
      try {
        const { data: functionData, error: functionError } = await (supabase.rpc(
          'match_documents',
          { 
            query_embedding: Array(1536).fill(0),
            match_threshold: 0.0,
            match_count: 1
          }
        ) as any);
        
        setFunctionExists(!functionError);
      } catch (err) {
        setFunctionExists(false);
      }
      
      // Check if Edge Functions are deployed
      try {
        const { data: healthCheck, error: healthError } = await supabase.functions.invoke(
          'openai-chat',
          { 
            body: { 
              health_check: true 
            } 
          }
        );
        
        setEdgeFunctionsReady(!healthError && healthCheck?.status === 'ok');
        setApiKeyConfigured(!healthError && healthCheck?.openai_key_configured === true);
      } catch (err) {
        setEdgeFunctionsReady(false);
        setApiKeyConfigured(false);
      }
    } catch (err) {
      console.error('Error checking system:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check system on component mount
  useEffect(() => {
    checkSystem();
  }, []);
  
  const handleRefresh = () => {
    checkSystem();
    if (onRefresh) onRefresh();
  };
  
  const renderStatusBadge = (status: boolean) => (
    status ? (
      <Badge className="bg-green-500">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Prêt
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Non configuré
      </Badge>
    )
  );
  
  const getSystemReadiness = () => {
    if (tableExists && functionExists && edgeFunctionsReady && apiKeyConfigured) {
      return 'ready';
    } else if (tableExists && functionExists) {
      return 'partial';
    } else {
      return 'not-ready';
    }
  };
  
  const systemStatus = getSystemReadiness();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          État du système RAG
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
        <CardDescription>
          Vérification de la configuration nécessaire pour le système de réponses contextualisées
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Table 'documents'</span>
                {renderStatusBadge(tableExists)}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Fonction 'match_documents'</span>
                {renderStatusBadge(functionExists)}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Edge Functions</span>
                {renderStatusBadge(edgeFunctionsReady)}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Clé API OpenAI</span>
                {renderStatusBadge(apiKeyConfigured)}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {systemStatus === 'ready' ? (
              <Alert className="bg-green-500/10 border-green-500/50">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle>Système prêt</AlertTitle>
                <AlertDescription>
                  Toutes les composantes du système RAG sont correctement configurées.
                  Vous pouvez maintenant ajouter des documents à votre base de connaissances.
                </AlertDescription>
              </Alert>
            ) : systemStatus === 'partial' ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Configuration partielle</AlertTitle>
                <AlertDescription>
                  La base de données est prête, mais les fonctions Edge ne sont pas correctement configurées.
                  Assurez-vous que vos fonctions sont déployées et que la clé API OpenAI est configurée.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Système non configuré</AlertTitle>
                <AlertDescription>
                  Votre système RAG n'est pas correctement configuré. Suivez ces étapes :
                  <ol className="list-decimal list-inside mt-2 ml-2 space-y-1">
                    <li>Exécutez le script de migration pour créer la table 'documents'</li>
                    <li>Créez la fonction 'match_documents' dans votre base de données</li>
                    <li>Déployez les fonctions Edge</li>
                    <li>Configurez votre clé API OpenAI dans les secrets Supabase</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemStatusChecker;

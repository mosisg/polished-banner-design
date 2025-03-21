
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const checkSystem = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    // Set a timeout to avoid infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setErrorMessage("La vérification du système a pris trop de temps. Veuillez réessayer.");
      }
    }, 10000); // 10 seconds timeout
    
    try {
      // Verify session is valid before proceeding
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        clearTimeout(timeoutId);
        setIsLoading(false);
        setErrorMessage("Session invalide ou expirée. Veuillez vous reconnecter.");
        return;
      }
      
      // Check if documents table exists
      try {
        const { data: tableData, error: tableError } = await supabase
          .from('documents')
          .select('id')
          .limit(1);
        
        setTableExists(!tableError);
      } catch (err) {
        console.log("Table check error:", err);
        setTableExists(false);
      }
      
      // Check if search function exists by trying to call it with safe parameters
      try {
        // We use a try-catch here because this might throw if the function doesn't exist
        const { data: functionData, error: functionError } = await supabase.rpc(
          'match_documents',
          { 
            query_embedding: Array(1536).fill(0),
            match_threshold: 0.0,
            match_count: 1
          }
        );
        
        setFunctionExists(!functionError);
      } catch (err) {
        console.log("Function check error:", err);
        setFunctionExists(false);
      }
      
      // Check if Edge Functions are deployed
      try {
        // Create an AbortController for the timeout
        const abortController = new AbortController();
        const timeoutPromise = setTimeout(() => {
          abortController.abort();
        }, 5000); // 5 second timeout
        
        const response = await supabase.functions.invoke(
          'openai-chat',
          { 
            body: { health_check: true },
            signal: abortController.signal
          }
        );
        
        clearTimeout(timeoutPromise);
        
        if (response.error) {
          console.log("Edge function error:", response.error);
          setEdgeFunctionsReady(false);
          setApiKeyConfigured(false);
        } else {
          const healthCheck = response.data;
          setEdgeFunctionsReady(healthCheck?.status === 'ok');
          setApiKeyConfigured(healthCheck?.openai_key_configured === true);
        }
      } catch (err) {
        console.log("Edge function invocation error:", err);
        setEdgeFunctionsReady(false);
        setApiKeyConfigured(false);
      }
    } catch (err) {
      console.error('Error checking system:', err);
      setErrorMessage('Une erreur est survenue lors de la vérification du système. Veuillez réessayer.');
    } finally {
      clearTimeout(timeoutId);
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
        ) : errorMessage ? (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
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

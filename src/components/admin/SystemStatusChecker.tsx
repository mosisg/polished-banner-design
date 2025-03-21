
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { RefreshCcw, Loader2, XCircle } from 'lucide-react';
import StatusItem from './status/StatusItem';
import StatusAlert from './status/StatusAlert';
import { checkSystemStatus, getSystemReadiness, SystemStatus } from '@/services/admin/statusChecker';

interface SystemStatusCheckerProps {
  onRefresh?: () => void;
}

const SystemStatusChecker: React.FC<SystemStatusCheckerProps> = ({ onRefresh }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    tableExists: false,
    functionExists: false,
    edgeFunctionsReady: false,
    apiKeyConfigured: false
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const checkSystem = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    // Create AbortController for the timeout
    const abortController = new AbortController();
    
    // Set a timeout to avoid infinite loading
    const timeoutId = setTimeout(() => {
      abortController.abort();
      setIsLoading(false);
      setErrorMessage("La vérification du système a pris trop de temps. Veuillez réessayer.");
    }, 10000); // 10 seconds timeout
    
    try {
      const status = await checkSystemStatus(abortController.signal);
      setSystemStatus(status);
    } catch (err) {
      console.error('Error checking system:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Une erreur est survenue lors de la vérification du système. Veuillez réessayer.');
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
  
  const readinessStatus = getSystemReadiness(systemStatus);
  
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
              <StatusItem label="Table 'documents'" status={systemStatus.tableExists} />
              <StatusItem label="Fonction 'match_documents'" status={systemStatus.functionExists} />
              <StatusItem label="Edge Functions" status={systemStatus.edgeFunctionsReady} />
              <StatusItem label="Clé API OpenAI" status={systemStatus.apiKeyConfigured} />
            </div>
            
            <Separator className="my-4" />
            
            <StatusAlert status={readinessStatus} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemStatusChecker;

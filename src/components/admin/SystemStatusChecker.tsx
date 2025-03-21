
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import StatusItem from './status/StatusItem';
import StatusAlert from './status/StatusAlert';
import { checkSystemStatus, getSystemReadiness, SystemStatus } from '@/services/admin/statusChecker';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_STATUS: SystemStatus = {
  tableExists: false,
  functionExists: false,
  edgeFunctionsReady: false,
  apiKeyConfigured: false
};

const SystemStatusChecker: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(DEFAULT_STATUS);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const { toast } = useToast();

  // Clean up function to handle component unmounting
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const checkStatus = async () => {
    // Clean up previous controller if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    if (isMountedRef.current) {
      setIsLoading(true);
      setHasError(false);
    }
    
    try {
      // Set a timeout to prevent endless loading
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current === controller) {
          controller.abort();
          console.log("Status check aborted due to timeout");
          if (isMountedRef.current) {
            setIsLoading(false);
            setHasError(true);
            toast({
              title: "Timeout",
              description: "La vérification du statut a pris trop de temps. Veuillez réessayer.",
              variant: "destructive"
            });
          }
        }
      }, 10000); // 10 seconds timeout
      
      const status = await checkSystemStatus(controller.signal);
      
      clearTimeout(timeoutId);
      
      // Only update state if component is still mounted and this is the current request
      if (isMountedRef.current && abortControllerRef.current === controller) {
        setSystemStatus(status);
        setIsLoading(false);
        setHasError(false);
        abortControllerRef.current = null;
      }
    } catch (error) {
      console.error("Error checking system status:", error);
      
      // Only update state if component is still mounted and this is the current request
      if (isMountedRef.current && abortControllerRef.current === controller) {
        setIsLoading(false);
        setHasError(true);
        
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Une erreur est survenue lors de la vérification du statut. Veuillez réessayer.",
          variant: "destructive"
        });
        
        abortControllerRef.current = null;
      }
    }
  };

  useEffect(() => {
    // Only run on mount
    checkStatus();
  }, []);

  const readiness = getSystemReadiness(systemStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statut du système</CardTitle>
        <CardDescription>
          Vérifiez si tous les composants nécessaires sont correctement configurés.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <StatusAlert readiness={readiness} hasError={hasError} />
          
          <div className="space-y-4">
            <StatusItem 
              label="Table de documents" 
              status={systemStatus.tableExists} 
            />
            <StatusItem 
              label="Fonction de recherche vectorielle" 
              status={systemStatus.functionExists} 
            />
            <StatusItem 
              label="Edge Functions déployées" 
              status={systemStatus.edgeFunctionsReady} 
            />
            <StatusItem 
              label="API OpenAI configurée" 
              status={systemStatus.apiKeyConfigured} 
            />
          </div>
          
          <Button 
            onClick={checkStatus} 
            disabled={isLoading}
            variant="outline" 
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vérification en cours...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser le statut
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatusChecker;

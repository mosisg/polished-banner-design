
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Bug } from 'lucide-react';
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
  const [isDebugMode, setIsDebugMode] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const { toast } = useToast();
  const timeoutRef = useRef<number | null>(null);

  // Clean up function to handle component unmounting
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const checkStatus = async () => {
    // Clean up previous controller if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Clean up previous timeout if exists
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Create new abort controller for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    if (isMountedRef.current) {
      setIsLoading(true);
      setHasError(false);
    }
    
    try {
      // Clear previous console logs before starting new check
      if (isDebugMode) {
        console.clear();
        console.log("🔍 Starting system status check...");
      }
      
      // Set a timeout to prevent endless loading (15 seconds)
      timeoutRef.current = window.setTimeout(() => {
        if (abortControllerRef.current === controller) {
          controller.abort();
          console.log("⚠️ Status check aborted due to timeout");
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
      }, 15000);
      
      const status = await checkSystemStatus(controller.signal);
      
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Only update state if component is still mounted and this is the current request
      if (isMountedRef.current && abortControllerRef.current === controller) {
        setSystemStatus(status);
        setIsLoading(false);
        setHasError(false);
        abortControllerRef.current = null;
        
        if (isDebugMode) {
          console.log("✅ Status check completed:", status);
        }
      }
    } catch (error) {
      console.error("❌ Error checking system status:", error);
      
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
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
    // Only run on mount and only for admin pages
    const path = window.location.pathname;
    if (path.includes('admin')) {
      checkStatus();
    }
  }, []);

  const readiness = getSystemReadiness(systemStatus);
  
  // Toggle debug mode
  const toggleDebugMode = () => {
    setIsDebugMode(!isDebugMode);
    
    if (!isDebugMode) {
      toast({
        title: "Mode débogage activé",
        description: "Les messages de débogage seront affichés dans la console du navigateur.",
        variant: "default"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Statut du système</CardTitle>
            <CardDescription>
              Vérifiez si tous les composants nécessaires sont correctement configurés.
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDebugMode}
            className={isDebugMode ? "bg-amber-500/10" : ""}
          >
            <Bug className={`h-4 w-4 ${isDebugMode ? "text-amber-500" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <StatusAlert readiness={readiness} hasError={hasError} />
          
          <div className="space-y-4">
            <StatusItem 
              label="Table de documents" 
              status={systemStatus.tableExists} 
              description="Vérifie si la table 'documents' existe dans la base de données"
            />
            <StatusItem 
              label="Fonction de recherche vectorielle" 
              status={systemStatus.functionExists} 
              description="Vérifie si la fonction SQL 'match_documents' est disponible"
            />
            <StatusItem 
              label="Edge Functions déployées" 
              status={systemStatus.edgeFunctionsReady} 
              description="Vérifie si les fonctions Edge sont accessibles"
            />
            <StatusItem 
              label="API OpenAI configurée" 
              status={systemStatus.apiKeyConfigured} 
              description="Vérifie si la clé API OpenAI est configurée dans les secrets"
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
          
          {isDebugMode && (
            <div className="text-xs text-muted-foreground bg-muted p-2 rounded border">
              <p>Mode débogage activé. Vérifiez la console du navigateur pour plus d'informations.</p>
              <p>Statut actuel: {JSON.stringify(systemStatus)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatusChecker;

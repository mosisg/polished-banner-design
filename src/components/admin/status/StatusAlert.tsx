
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { SystemReadiness } from '@/services/admin/statusChecker';

interface StatusAlertProps {
  readiness: SystemReadiness;
  hasError: boolean;
}

const StatusAlert: React.FC<StatusAlertProps> = ({ readiness, hasError }) => {
  if (hasError) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Erreur de connexion</AlertTitle>
        <AlertDescription>
          Impossible de vérifier le statut du système. Veuillez réessayer dans quelques instants.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (readiness === 'ready') {
    return (
      <Alert className="bg-green-500/10 border-green-500/50">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertTitle>Système prêt</AlertTitle>
        <AlertDescription>
          Toutes les composantes du système RAG sont correctement configurées.
          Vous pouvez maintenant ajouter des documents à votre base de connaissances.
        </AlertDescription>
      </Alert>
    );
  } else if (readiness === 'partial') {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Configuration partielle</AlertTitle>
        <AlertDescription>
          La base de données est prête, mais les fonctions Edge ne sont pas correctement configurées.
          Assurez-vous que vos fonctions sont déployées et que la clé API OpenAI est configurée.
        </AlertDescription>
      </Alert>
    );
  } else {
    return (
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
    );
  }
};

export default StatusAlert;

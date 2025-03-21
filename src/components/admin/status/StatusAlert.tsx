
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
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
          Impossible de vérifier le statut du système. Veuillez vous assurer que vous êtes connecté 
          avec un compte administrateur et réessayez dans quelques instants.
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
      <Alert className="bg-amber-500/10 border-amber-500/50">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertTitle>Configuration partielle</AlertTitle>
        <AlertDescription>
          <p>
            La base de données semble prête, mais les fonctions Edge ne sont pas correctement configurées.
          </p>
          <div className="mt-2">
            <p className="font-medium">Actions possibles :</p>
            <ul className="list-disc list-inside mt-1 ml-2 space-y-1 text-sm">
              <li>Vérifiez que les fonctions Edge sont bien déployées sur votre projet Supabase</li>
              <li>Assurez-vous que la clé API OpenAI est configurée dans les variables d'environnement Supabase</li>
              <li>Vérifiez les permissions de la clé API utilisée pour accéder aux fonctions Edge</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    );
  } else {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Système non configuré</AlertTitle>
        <AlertDescription>
          <p>
            Votre système RAG n'est pas correctement configuré. Suivez ces étapes :
          </p>
          <ol className="list-decimal list-inside mt-2 ml-2 space-y-1">
            <li>Exécutez le script de migration pour créer la table 'documents'</li>
            <li>Créez la fonction 'match_documents' dans votre base de données</li>
            <li>Déployez les fonctions Edge</li>
            <li>Configurez votre clé API OpenAI dans les secrets Supabase</li>
          </ol>
          <div className="mt-3 bg-slate-900/10 p-3 rounded-md">
            <p className="text-sm font-medium flex items-center">
              <Info className="h-3 w-3 mr-1" /> Conseil de débogage :
            </p>
            <p className="text-xs mt-1">
              Vérifiez la console du navigateur pour voir les messages de logs détaillés qui 
              peuvent vous aider à identifier les problèmes spécifiques à votre configuration.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    );
  }
};

export default StatusAlert;

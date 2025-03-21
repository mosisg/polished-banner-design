
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type AdminFormStatus = 'idle' | 'success' | 'error';

const AdminUserForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<AdminFormStatus>('idle');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer une adresse email',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    setStatus('idle');
    
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        throw new Error('Session non valide, veuillez vous reconnecter');
      }
      
      const { data, error } = await supabase.functions.invoke('make-admin', {
        body: { email },
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setStatus('success');
      setMessage(`${email} est maintenant administrateur.`);
      toast({
        title: 'Succès',
        description: `${email} est maintenant administrateur.`,
      });
      
      setEmail('');
    } catch (error) {
      console.error('Error making admin:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Une erreur est survenue');
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {status === 'success' && (
        <Alert className="mb-4 bg-green-500/10 border-green-500/50">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Succès</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert className="mb-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleMakeAdmin} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email de l'utilisateur</label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="utilisateur@example.com"
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !email}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                'Ajouter comme admin'
              )}
            </Button>
          </div>
        </div>
      </form>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Notes:</p>
        <ul className="list-disc list-inside pl-2 mt-1">
          <li>L'utilisateur doit d'abord avoir créé un compte sur la plateforme.</li>
          <li>Assurez-vous que l'email est exactement le même que celui utilisé lors de l'inscription.</li>
          <li>L'opération ne peut pas être annulée via cette interface.</li>
        </ul>
      </div>
    </>
  );
};

export default AdminUserForm;

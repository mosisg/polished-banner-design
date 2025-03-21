
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AdminUsers = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

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
      const { data: sessionData } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('make-admin', {
        body: { email },
        headers: {
          Authorization: `Bearer ${sessionData.session?.access_token}`,
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
      <Helmet>
        <title>Gestion des Administrateurs | ComparePrix</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">
            Gestion des Administrateurs
          </h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ajouter un administrateur</CardTitle>
              <CardDescription>
                Les administrateurs ont un accès complet à la base de connaissances et à toutes les fonctionnalités d'administration.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
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
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default AdminUsers;


import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get the intended destination from location state, or default to admin dashboard
  const from = (location.state as { from?: string })?.from || '/admin/knowledge-base';

  useEffect(() => {
    console.log("AdminLogin - Auth state:", { user, session, from });
    // If user is already logged in with valid session, redirect to admin dashboard
    if (user && session) {
      console.log("User already logged in, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [user, session, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log('Attempting to sign in with:', email);
      await signIn(email, password);
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté à l'espace administrateur.",
      });
      
      // Redirect to the previous page or admin dashboard
      console.log("Login successful, redirecting to:", from);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Identifiants incorrects. Veuillez vérifier votre email et mot de passe.');
        } else {
          setError(error.message);
        }
      } else {
        setError('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Connexion Administrateur | ComparePrix</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-background p-4 pt-20">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Espace Administrateur</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder au tableau de bord
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Pas encore de compte?{' '}
              <Link 
                to="/admin/signup" 
                className="text-primary hover:text-primary/90 transition-colors"
              >
                Créer un compte
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              <Link 
                to="/" 
                className="text-primary hover:text-primary/90 transition-colors"
              >
                Retourner au site
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default AdminLogin;


import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log("Checking admin status for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching admin status:', error);
        return false;
      }
      
      console.log("Admin status result:", data);
      return data?.is_admin || false;
    } catch (err) {
      console.error('Failed to check admin status:', err);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    
    const initSession = async () => {
      try {
        console.log("Initializing auth session");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          console.log("Session from getSession:", session ? "exists" : "null");
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            const isUserAdmin = await checkAdminStatus(session.user.id);
            console.log("User admin status:", isUserAdmin);
            setIsAdmin(isUserAdmin);
          } else {
            setIsAdmin(false);
          }
        }
      } catch (err) {
        console.error('Error initializing session:', err);
        toast({
          title: "Erreur de session",
          description: "Impossible de récupérer votre session. Veuillez vous reconnecter.",
          variant: "destructive"
        });
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "session exists" : "no session");
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            const isUserAdmin = await checkAdminStatus(session.user.id);
            setIsAdmin(isUserAdmin);
          } else {
            setIsAdmin(false);
          }
          
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    initSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      console.log("Attempting sign in for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      console.log("Sign in successful:", data.user?.id);
      if (data.user) {
        const isUserAdmin = await checkAdminStatus(data.user.id);
        setIsAdmin(isUserAdmin);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("Attempting sign out");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("Sign out successful");
      // Force state reset to ensure UI updates
      setIsAdmin(false);
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signIn, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

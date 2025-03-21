
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "session exists" : "no session");
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    const initSession = async () => {
      try {
        console.log("Initializing auth session");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          console.log("Session from getSession:", session ? "exists" : "null");
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error initializing session:', err);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    initSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      console.log("Attempting sign in for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      console.log("Sign in successful:", data.user?.id);
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
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signIn, signOut }}>
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

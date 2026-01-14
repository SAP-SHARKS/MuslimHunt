import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  role: string;
  app_metadata?: {
    role?: string;
    [key: string]: any;
  };
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  devLoginAsAdmin: () => void;
  devLoginAsUser: () => void;
  logout: () => Promise<void>;
  isDevMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDevMode, setIsDevMode] = useState(false);

  // Check if user is admin
  const isAdmin = user?.app_metadata?.role === 'admin' || user?.role === 'admin';

  useEffect(() => {
    // Check for dev session on mount
    const devSession = localStorage.getItem('dev_session');
    const devSessionData = devSession ? JSON.parse(devSession) : null;

    if (devSessionData) {
      setUser(devSessionData.user);
      setSession(devSessionData.session);
      setIsDevMode(true);
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const mappedUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          role: session.user.role || 'authenticated',
          app_metadata: session.user.app_metadata,
          user_metadata: session.user.user_metadata,
        };
        setUser(mappedUser);
        setSession(session);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const mappedUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          role: session.user.role || 'authenticated',
          app_metadata: session.user.app_metadata,
          user_metadata: session.user.user_metadata,
        };
        setUser(mappedUser);
        setSession(session);
      } else {
        setUser(null);
        setSession(null);
        setIsDevMode(false);
        localStorage.removeItem('dev_session');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Dev login as admin (bypasses real authentication)
  const devLoginAsAdmin = () => {
    const mockUser: User = {
      id: 'dev-admin-id',
      email: 'admin@dev.local',
      role: 'authenticated',
      app_metadata: {
        role: 'admin',
        provider: 'dev',
      },
      user_metadata: {
        full_name: 'Dev Admin',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DevAdmin',
      },
    };

    const mockSession: Session = {
      access_token: 'mock-admin-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      token_type: 'bearer',
      user: mockUser as any,
    };

    setUser(mockUser);
    setSession(mockSession);
    setIsDevMode(true);

    // Persist dev session
    localStorage.setItem('dev_session', JSON.stringify({
      user: mockUser,
      session: mockSession,
    }));

    console.log('[Dev Auth] Logged in as Admin:', mockUser.email);
  };

  // Dev login as regular user (for testing non-admin features)
  const devLoginAsUser = () => {
    const mockUser: User = {
      id: 'dev-user-id',
      email: 'user@dev.local',
      role: 'authenticated',
      app_metadata: {
        provider: 'dev',
      },
      user_metadata: {
        full_name: 'Dev User',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DevUser',
      },
    };

    const mockSession: Session = {
      access_token: 'mock-user-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      token_type: 'bearer',
      user: mockUser as any,
    };

    setUser(mockUser);
    setSession(mockSession);
    setIsDevMode(true);

    // Persist dev session
    localStorage.setItem('dev_session', JSON.stringify({
      user: mockUser,
      session: mockSession,
    }));

    console.log('[Dev Auth] Logged in as User:', mockUser.email);
  };

  // Logout function
  const logout = async () => {
    if (isDevMode) {
      // Clear dev session
      localStorage.removeItem('dev_session');
      setUser(null);
      setSession(null);
      setIsDevMode(false);
      console.log('[Dev Auth] Logged out');
    } else {
      // Real logout
      await supabase.auth.signOut();
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isAdmin,
    loading,
    devLoginAsAdmin,
    devLoginAsUser,
    logout,
    isDevMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import React, { createContext, useContext, ReactNode } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

interface AuthContextType {
  user: any;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerkAuth();

  const signOut = async () => {
    await clerkSignOut();
  };

  const value = {
    user: user ? {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      full_name: user.fullName,
      email_confirmed_at: user.primaryEmailAddress?.verification?.status === 'verified' ? new Date() : null,
    } : null,
    loading: !isLoaded,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
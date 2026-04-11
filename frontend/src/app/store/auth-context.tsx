import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CurrentUser } from '../../shared/types/auth';

type AuthContextType = {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  login: (userData: CurrentUser) => void;
  logout: () => void;
  isInitializing: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('current_user');
      const token = localStorage.getItem('access_token');
      
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Ignored
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const login = (userData: CurrentUser) => {
    localStorage.setItem('access_token', userData.token);
    localStorage.setItem('current_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      isInitializing
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

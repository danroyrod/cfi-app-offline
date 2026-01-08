import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Password is stored here - you can change this to any password you want
// For production, consider using environment variables or a more secure method
const PROTECTED_PASSWORD = 'cfi2024'; // Change this to your desired password

const AUTH_KEY = 'cfi_app_authenticated';
const AUTH_TIMESTAMP_KEY = 'cfi_app_auth_timestamp';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check if user was authenticated in this session
    const authStatus = sessionStorage.getItem(AUTH_KEY);
    const timestamp = sessionStorage.getItem(AUTH_TIMESTAMP_KEY);
    
    if (authStatus === 'true' && timestamp) {
      const authTime = parseInt(timestamp, 10);
      const now = Date.now();
      // Check if session is still valid (within 24 hours)
      if (now - authTime < SESSION_DURATION) {
        return true;
      } else {
        // Session expired, clear it
        sessionStorage.removeItem(AUTH_KEY);
        sessionStorage.removeItem(AUTH_TIMESTAMP_KEY);
      }
    }
    
    return false;
  });

  useEffect(() => {
    // Update state if sessionStorage changes (e.g., from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AUTH_KEY) {
        setIsAuthenticated(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (password: string): boolean => {
    if (password === PROTECTED_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_KEY, 'true');
      sessionStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_TIMESTAMP_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout
      }}
    >
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

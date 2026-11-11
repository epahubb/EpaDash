import { createContext, useContext, useEffect, useState } from "react";
import { useAuthStore } from "./auth-store";
import { TokenManager } from "./token-manager";
const AuthContext = createContext({ isInitialized: false });
const AuthProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAuthenticated, logout, setLoading } = useAuthStore();
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const token = TokenManager.getAccessToken();
      if (token) {
        if (TokenManager.isTokenExpired()) {
          const refreshToken = TokenManager.getRefreshToken();
          if (!refreshToken) {
            logout();
          }
        }
      } else if (isAuthenticated) {
        logout();
      }
      setLoading(false);
      setIsInitialized(true);
    };
    initializeAuth();
  }, [isAuthenticated, logout, setLoading]);
  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="flex flex-col items-center gap-3"><div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" /><p className="text-sm font-medium text-gray-500">Initializing EpaDash Platform...</p></div></div>;
  }
  return <AuthContext.Provider value={{ isInitialized }}>{children}</AuthContext.Provider>;
};
const useAuth = () => useContext(AuthContext);
export {
  AuthProvider,
  useAuth
};

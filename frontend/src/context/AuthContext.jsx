import { createContext, useContext, useState } from 'react';
import { isTokenValid, removeToken, setToken } from '../util/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(isTokenValid());

  const login = (token) => {
    setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

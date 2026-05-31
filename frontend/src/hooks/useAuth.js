import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Verificar autenticación al montar
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
      // Aquí podrías cargar datos del usuario desde el backend
    }
  }, []);

  const login = useCallback(async (usuario, contrasena) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.login(usuario, contrasena);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };
};

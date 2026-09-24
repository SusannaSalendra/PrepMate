import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Sync state and check current active session
  const verifySession = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data?.success && res.data?.data) {
        setUser(res.data.data);
        localStorage.setItem('user', JSON.stringify(res.data.data));
      }
    } catch (err) {
      // If error, token might be invalid or expired
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession();

    // Listen for global unauthorized events from axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [verifySession]);

  // Login action
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: receivedToken, data: userData } = res.data;

      setToken(receivedToken);
      setUser(userData);

      if (receivedToken) {
        localStorage.setItem('token', receivedToken);
      }
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || err.customMessage || 'Login failed';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Register action
  const register = async (name, email, password, role = 'user') => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      const { token: receivedToken, data: userData } = res.data;

      setToken(receivedToken);
      setUser(userData);

      if (receivedToken) {
        localStorage.setItem('token', receivedToken);
      }
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || err.customMessage || 'Registration failed';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout action
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore API logout errors
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  // Update profile in context state
  const updateUserData = (newUserData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newUserData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUserData,
    verifySession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

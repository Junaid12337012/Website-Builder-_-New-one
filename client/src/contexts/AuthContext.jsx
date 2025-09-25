import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getToken, setToken, removeToken, isAuthenticated } from '../lib/auth';
import api from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  const checkAuth = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return null;
      }

      const { data } = await api.get('/auth/me');
      setUser(data);
      return data;
    } catch (err) {
      console.error('Auth check failed:', err);
      if (err.response?.status === 401) {
        removeToken();
      }
      setError(err.response?.data?.message || 'Authentication failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login function
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login with:', { email });
      const { data } = await api.post('/auth/login', { 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      if (!data || !data.token || !data.user) {
        throw new Error('Invalid response from server');
      }
      
      console.log('Login successful, setting token and user data');
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      
      if (err.response) {
        // Handle HTTP errors
        const { status, data } = err.response;
        
        if (status === 400 && data.message) {
          errorMessage = data.message;
        } else if (status === 401) {
          errorMessage = data?.message || 'Invalid email or password';
        } else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      console.error('Login failed:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Signup function
  const signup = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await api.post('/auth/signup', userData);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error('Signup failed:', err);
      const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    removeToken();
    // Clear any cached data or redirect if needed
  }, []);

  // Check if user is authenticated
  const isAuth = useCallback(() => {
    return isAuthenticated() && !!user;
  }, [user]);

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: isAuth(),
    login,
    signup,
    logout,
    setUser,
    refreshUser: checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

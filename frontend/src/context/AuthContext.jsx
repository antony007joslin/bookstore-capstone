import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bookstore_user');
    return saved ? JSON.parse(saved) : {
      id: 1,
      username: 'johndoe',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      giftPoints: 250,
      role: 'ROLE_USER',
      token: 'mock_token_demo'
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('bookstore_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bookstore_user');
    }
  }, [user]);

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await authApi.login({ usernameOrEmail, password });
      setUser(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, error: message };
    }
  };

  const register = async (formData) => {
    try {
      const response = await authApi.register(formData);
      setUser(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      return { success: false, error: message };
    }
  };

  const refreshProfile = async () => {
    if (!user?.id) return;
    try {
      const response = await authApi.getProfile(user.id);
      setUser(prev => ({
        ...prev,
        giftPoints: response.data.giftPoints,
        fullName: response.data.fullName,
        phone: response.data.phone
      }));
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

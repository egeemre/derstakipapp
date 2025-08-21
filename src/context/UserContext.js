import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from AsyncStorage on app start
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
    setIsLoading(false);
  };

  const updateUser = async (userData) => {
    try {
      setUser(userData);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error) {
      console.log('Error saving user data:', error);
    }
  };

  const clearUser = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user_data');
    } catch (error) {
      console.log('Error clearing user data:', error);
    }
  };

  // Store user credentials for manual login
  const storeUserCredentials = async (email, password) => {
    try {
      const credentials = { email, password };
      await AsyncStorage.setItem('user_credentials', JSON.stringify(credentials));
    } catch (error) {
      console.log('Error storing credentials:', error);
    }
  };

  const getUserCredentials = async () => {
    try {
      const credentials = await AsyncStorage.getItem('user_credentials');
      return credentials ? JSON.parse(credentials) : null;
    } catch (error) {
      console.log('Error getting credentials:', error);
      return null;
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      updateUser, 
      clearUser, 
      isLoading,
      storeUserCredentials,
      getUserCredentials
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
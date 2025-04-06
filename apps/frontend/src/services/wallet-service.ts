import { api } from './api';
import { useNavigate } from 'react-router-dom';

// Define a interface for the user data
interface UserData {
  id: string;
  wallet: string;
  phone?: string;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Checks if a wallet exists in the database and redirects accordingly
 * @param wallet Wallet address to check
 * @param navigate Navigation function from useNavigate
 * @returns Promise<boolean> True if wallet exists, false otherwise
 */
export const checkWalletAndRedirect = async (wallet: string, navigate: ReturnType<typeof useNavigate>): Promise<boolean> => {
  try {
    // Check if the wallet exists in the database
    const response = await api.login({ wallet });
    
    if (response.status === 200) {
      // Wallet exists, redirect to select-app
      navigate('/select-app');
      return true;
    } else if (response.status === 404) {
      // Wallet doesn't exist, redirect to verify
      navigate('/verify');
      return false;
    }
    
    // Default case - just return false without redirecting
    return false;
  } catch (error) {
    console.error('Error checking wallet:', error);
    // On error, don't redirect
    return false;
  }
};

/**
 * Save authentication token and user data to local storage
 * @param token Authentication token from API
 * @param userData User data to save
 */
export const saveAuthData = (token: string, userData: UserData) => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user_data', JSON.stringify(userData));
};

/**
 * Get authentication token from local storage
 * @returns The authentication token or null if not found
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Get user data from local storage
 * @returns The user data or null if not found
 */
export const getUserData = (): UserData | null => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Check if user is authenticated
 * @returns True if authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Clear authentication data from local storage
 */
export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
}; 
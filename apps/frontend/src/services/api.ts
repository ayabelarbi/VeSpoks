// API service for frontend
const API_URL = 'http://localhost:3002/api/v1';

// Interface for API responses
interface ApiResponse<T = unknown> {
  status: number;
  data: T;
  error?: string;
}

// Login request interface
interface LoginRequest {
  wallet: string;
}

// Signin request interface
interface SigninRequest {
  wallet: string;
  phone: string;
}

// Verify login request interface
interface VerifyLoginRequest {
  wallet: string;
  otp: string;
}

// API service
export const api = {
  /**
   * Check if a wallet exists in the database
   * @param params Login request parameters
   * @returns Promise with response
   */
  login: async (params: LoginRequest): Promise<ApiResponse> => {
    try {
      console.log(`Checking login for wallet: ${params.wallet}`);
        // Use query parameters instead of body for GET request
      const response = await fetch(`${API_URL}/login?wallet=${params.wallet}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('API response:', response.status, data);
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      console.error('API login error:', error);
      return {
        status: 500,
        data: null,
        error: 'Network error',
      };
    }
  },

  /**
   * Register a new user
   * @param params Signin request parameters
   * @returns Promise with response
   */
  signin: async (params: SigninRequest): Promise<ApiResponse> => {
    try {
      console.log(`Signing in user with wallet: ${params.wallet}, phone: ${params.phone}`);
      const response = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      console.log('API response:', response.status, data);
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      console.error('API signin error:', error);
      return {
        status: 500,
        data: null,
        error: 'Network error',
      };
    }
  },

  /**
   * Verify OTP for login
   * @param params Verify login request parameters
   * @returns Promise with response
   */
  verifyLogin: async (params: VerifyLoginRequest): Promise<ApiResponse> => {
    try {
      console.log(`Verifying OTP for wallet: ${params.wallet}`);
      const response = await fetch(`${API_URL}/login/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      console.log('API response:', response.status, data);
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      console.error('API verify login error:', error);
      return {
        status: 500,
        data: null,
        error: 'Network error',
      };
    }
  },

  checkSignin: async (params: LoginRequest): Promise<ApiResponse> => {
    try {
      console.log(`Checking signin for wallet: ${params.wallet}`);
      const response = await fetch(`${API_URL}/check-signin?wallet=${params.wallet}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('API response:', response.status, data);
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      console.error('API check signin error:', error);
      return {
        status: 500,
        data: null,
        error: 'Network error',
      };
    }
  }
}; 
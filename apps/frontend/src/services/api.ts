// API service for backend communication
const API_URL = 'http://localhost:3000/api/v1';

export interface SigninRequest {
  phone: string;
  wallet: string;
}

export interface LoginRequest {
  wallet: string;
}

export interface LoginVerifyRequest {
  wallet: string;
  otp: string;
}

// Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

// API methods
export const api = {
  // Sign in a new user
  async signin(data: SigninRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return {
        data: await response.json(),
        status: response.status,
      };
    } catch (error) {
      console.error('Signin error:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      };
    }
  },

  // Login a user - this will trigger the SMS code
  async login(data: LoginRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return {
        data: await response.json(),
        status: response.status,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      };
    }
  },

  // Verify the OTP code
  async verifyLogin(data: LoginVerifyRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_URL}/login/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return {
        data: await response.json(),
        status: response.status,
      };
    } catch (error) {
      console.error('Verify login error:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      };
    }
  },

  async checkSignIn(data: LoginRequest): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/check-signin/${data.wallet}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return {
      data: await response.json(),
      status: response.status,
    };
  },
  
}; 
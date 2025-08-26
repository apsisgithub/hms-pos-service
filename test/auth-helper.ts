import axios from 'axios';

export class AuthHelper {
  private static readonly AUTH_SERVICE_URL = 'http://localhost:3000';
  private static readonly LOGIN_ENDPOINT = '/auth/login';
  
  static async getAuthToken(): Promise<string> {
    try {
      const response = await axios.post(`${this.AUTH_SERVICE_URL}${this.LOGIN_ENDPOINT}`, {
        username: 'admin',
        password: 'password'
      });

      if (response.data && response.data.accessToken) {
        return `Bearer ${response.data.accessToken}`;
      }
      
      // Fallback to check different response structures
      if (response.data && response.data.data && response.data.data.accessToken) {
        return `Bearer ${response.data.data.accessToken}`;
      }
      
      if (response.data && response.data.access_token) {
        return `Bearer ${response.data.access_token}`;
      }

      throw new Error('Access token not found in response');
    } catch (error) {
      console.error('Failed to get auth token:', error.message);
      // Fallback to mock token if auth service is not available
      return 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX3JvbGVfaWQiOjEsInJvbGUiOiJBRE1JTiIsImlhdCI6MTYzMDAwMDAwMCwiZXhwIjoxNjMwMDg2NDAwfQ.test';
    }
  }
}
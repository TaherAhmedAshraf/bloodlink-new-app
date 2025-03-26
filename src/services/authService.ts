import apiClient from './apiClient';

// Response types
export interface OtpResponse {
  success: boolean;
  message: string;
  requestId: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    phoneNumber: string;
    bloodType: string;
    address: string;
  };
}

class AuthService {
  // Send OTP to phone number
  public async sendOtp(phoneNumber: string): Promise<OtpResponse> {
    return apiClient.post<OtpResponse>('/auth/send-otp', { phoneNumber });
  }

  // Verify OTP
  public async verifyOtp(phoneNumber: string, otp: string, requestId: string): Promise<VerifyOtpResponse> {
    const response = await apiClient.post<VerifyOtpResponse>('/auth/verify-otp', {
      phoneNumber,
      otp,
      requestId,
    });
    
    // Store the token in the API client
    if (response.token) {
      apiClient.setToken(response.token);
    }
    
    return response;
  }

  // Logout
  public logout(): void {
    apiClient.clearToken();
  }
}

const authService = new AuthService();
export default authService; 
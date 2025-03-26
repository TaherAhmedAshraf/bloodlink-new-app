import apiClient from './apiClient';

// User profile type
export interface UserProfile {
  id: string;
  name: string;
  phoneNumber: string;
  bloodType: string;
  address: string;
  lastDonation?: string;
  hemoglobin?: number;
  gender?: string;
  age?: number;
  role?: string;
  createdAt?: string;
}

// Update profile request type
export interface UpdateProfileRequest {
  name: string;
  phoneNumber: string;
  bloodType: string;
  address: string;
}

// Update donation info request type
export interface UpdateDonationInfoRequest {
  lastDonated: string;
  currentHemoglobin: number;
  gender: string;
  age: number;
}

// History item type
export interface HistoryItem {
  id: string;
  hospital: string;
  location: string;
  bloodType: string;
  viewCount?: number;
  date: string;
}

// History response type
export interface HistoryResponse {
  accepted: HistoryItem[];
  requested: HistoryItem[];
}

// Success response type
export interface SuccessResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
  donationInfo?: {
    lastDonated: string;
    currentHemoglobin: number;
    gender: string;
    age: number;
  };
}

class UserService {
  // Get user profile
  public async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/user/profile');
  }

  // Update user profile
  public async updateProfile(profileData: UpdateProfileRequest): Promise<SuccessResponse> {
    return apiClient.put<SuccessResponse>('/user/profile', profileData);
  }

  // Update donation information
  public async updateDonationInfo(donationData: UpdateDonationInfoRequest): Promise<SuccessResponse> {
    return apiClient.put<SuccessResponse>('/user/donation-info', donationData);
  }

  // Get user history
  public async getHistory(type?: 'accepted' | 'requested'): Promise<HistoryResponse> {
    const params = type ? { type } : {};
    return apiClient.get<HistoryResponse>('/user/history', { params });
  }
}

const userService = new UserService();
export default userService; 
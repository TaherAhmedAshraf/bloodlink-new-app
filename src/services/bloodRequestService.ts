import apiClient from './apiClient';

// Blood request type
export interface BloodRequest {
  id: string;
  bloodType: string;
  hospital: string;
  location: string;
  zone: string;
  date: string;
  time: string;
  status: string;
  viewCount: number;
  daysAgo: number;
  bagNeeded: string;
}

// Blood request detail type
export interface BloodRequestDetail extends BloodRequest {
  hemoglobinPoint: string;
  patientProblem: string;
  bagNeeded: string;
  additionalInfo: string;
  createdAt: string;
  requester: {
    id: string;
    name: string;
    phoneNumber: string;
  };
}

// Ongoing blood request type
export interface OngoingBloodRequest {
  id: string;
  hospital: string;
  location: string;
  bloodType: string;
  date: string;
  time: string;
  status: string;
  role: 'donor' | 'requester';
  viewCount?: number;
  requesterInfo?: {
    id: string;
    name: string;
    phoneNumber: string;
  };
  donorInfo?: {
    id: string;
    name: string;
    phoneNumber: string;
  };
}

// Ongoing blood requests response type
export interface OngoingBloodRequestsResponse {
  ongoingRequests: OngoingBloodRequest[];
}

// Create blood request request type
export interface CreateBloodRequestRequest {
  bloodType: string;
  hospital: string;
  location: string;
  hemoglobinPoint: string;
  patientProblem: string;
  bagNeeded: string;
  zone: string;
  date: string;
  time: string;
  additionalInfo: string;
}

// Blood request response type
export interface BloodRequestResponse {
  requests: BloodRequest[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Success response type
export interface SuccessResponse {
  success: boolean;
  message: string;
  requestId?: string;
  status?: string;
}

class BloodRequestService {
  // Create blood request
  public async createBloodRequest(requestData: CreateBloodRequestRequest): Promise<SuccessResponse> {
    return apiClient.post<SuccessResponse>('/blood-requests', requestData);
  }

  // Get blood requests
  public async getBloodRequests(
    bloodType?: string,
    zone?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<BloodRequestResponse> {
    const params = { bloodType, zone, page, limit };
    return apiClient.get<BloodRequestResponse>('/blood-requests', { params });
  }

  // Get blood request details
  public async getBloodRequestDetail(requestId: string): Promise<BloodRequestDetail> {
    return apiClient.get<BloodRequestDetail>(`/blood-requests/${requestId}`);
  }

  // Accept blood request
  public async acceptBloodRequest(requestId: string): Promise<SuccessResponse> {
    return apiClient.post<SuccessResponse>(`/blood-requests/${requestId}/accept`);
  }

  // Get ongoing blood requests
  public async getOngoingRequests(): Promise<OngoingBloodRequestsResponse> {
    return apiClient.get<OngoingBloodRequestsResponse>('/user/ongoing-requests');
  }

  // Get ongoing blood request detail by ID
  public async getOngoingRequestDetail(requestId: string): Promise<OngoingBloodRequest> {
    return apiClient.get<OngoingBloodRequest>(`/user/ongoing-requests/${requestId}`);
  }

  // Complete blood request
  public async completeBloodRequest(requestId: string): Promise<SuccessResponse> {
    return apiClient.post<SuccessResponse>(`/blood-requests/${requestId}/complete`);
  }

  // Cancel blood request
  public async cancelBloodRequest(requestId: string, reason?: string): Promise<SuccessResponse> {
    return apiClient.post<SuccessResponse>(`/blood-requests/${requestId}/cancel`, { reason });
  }

  // Report donor
  public async reportDonor(requestId: string, reason: string): Promise<SuccessResponse> {
    return apiClient.post<SuccessResponse>(`/blood-requests/${requestId}/report-donor`, { reason });
  }

  // Request change donor
  public async requestChangeDonor(requestId: string, reason: string): Promise<SuccessResponse> {
    return apiClient.post<SuccessResponse>(`/blood-requests/${requestId}/change-donor`, { reason });
  }
}

const bloodRequestService = new BloodRequestService();
export default bloodRequestService; 
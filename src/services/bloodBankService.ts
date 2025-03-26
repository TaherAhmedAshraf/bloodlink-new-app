import apiClient from './apiClient';

// Blood bank type
export interface BloodBank {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  phone: string;
}

// Blood bank detail type
export interface BloodBankDetail extends BloodBank {
  hours: string;
  bloodNeeded: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// Blood bank response type
export interface BloodBankResponse {
  bloodBanks: BloodBank[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

class BloodBankService {
  // Get blood banks
  public async getBloodBanks(
    zone?: string,
    district?: string,
    page: number = 1,
    limit: number = 10,
    lat?: number,
    lng?: number
  ): Promise<BloodBankResponse> {
    const params = { zone, district, page, limit, lat, lng };
    return apiClient.get<BloodBankResponse>('/blood-banks', { params });
  }

  // Get blood bank details
  public async getBloodBankDetail(
    bankId: string,
    lat?: number,
    lng?: number
  ): Promise<BloodBankDetail> {
    const params = { lat, lng };
    return apiClient.get<BloodBankDetail>(`/blood-banks/${bankId}`, { params });
  }
}

const bloodBankService = new BloodBankService();
export default bloodBankService; 
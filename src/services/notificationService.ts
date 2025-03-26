import apiClient from './apiClient';

// Define notification types
export type NotificationType = 
  | 'request_accepted' 
  | 'blood_needed' 
  | 'donation_reminder' 
  | 'system_announcement' 
  | 'donor_changed' 
  | 'request_cancelled' 
  | 'donation_completed';

// Device type
export type DeviceType = 'ios' | 'android' | 'web';

// Notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  time: string;
  isRead: boolean;
  title?: string;
  message?: string;
  userName?: string;
  userImage?: string;
  bloodType?: string;
  metadata?: Record<string, any>; // For additional context
}

// Notification response type
export interface NotificationResponse {
  notifications: Notification[];
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
  notificationId?: string;
  count?: number;
}

// Notification settings type
export interface NotificationSettings {
  pushNotificationsEnabled: boolean;
  bloodRequestsEnabled: boolean;
  requestUpdatesEnabled: boolean;
  donationRemindersEnabled: boolean;
  systemAnnouncementsEnabled: boolean;
}

// Device token registration request
export interface RegisterTokenRequest {
  token: string;
  deviceType: DeviceType;
  deviceId?: string;
}

// Unread notification count response
export interface UnreadCountResponse {
  count: number;
}

// Send test notification request
export interface SendTestNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

class NotificationService {
  // Get notifications with pagination
  public async getNotifications(
    page: number = 1,
    limit: number = 10
  ): Promise<NotificationResponse> {
    const params = { page, limit };
    return apiClient.get<NotificationResponse>('/notifications', { params });
  }

  // Mark notification as read
  public async markAsRead(notificationId: string): Promise<SuccessResponse> {
    return apiClient.put<SuccessResponse>(`/notifications/${notificationId}/read`);
  }

  // Mark all notifications as read
  public async markAllAsRead(): Promise<SuccessResponse> {
    return apiClient.put<SuccessResponse>('/notifications/read-all');
  }

  // Get notification settings
  public async getSettings(): Promise<NotificationSettings> {
    return apiClient.get<NotificationSettings>('/notifications/settings');
  }

  // Update notification settings
  public async updateSettings(settings: NotificationSettings): Promise<SuccessResponse> {
    return apiClient.put<SuccessResponse>('/notifications/settings', settings);
  }

  // Register device token for push notifications
  public async registerDeviceToken(
    token: string, 
    deviceType: DeviceType,
    deviceId?: string
  ): Promise<SuccessResponse> {
    const data: RegisterTokenRequest = {
      token,
      deviceType,
      ...(deviceId && { deviceId })
    };
    
    return apiClient.post<SuccessResponse>('/notifications/register-token', data);
  }

  // Get unread notification count
  public async getUnreadCount(): Promise<UnreadCountResponse> {
    return apiClient.get<UnreadCountResponse>('/notifications/unread-count');
  }

  // Send test notification (admin only)
  public async sendTestNotification(
    data: SendTestNotificationRequest
  ): Promise<SuccessResponse> {
    return apiClient.post<SuccessResponse>('/notifications/send-test', data);
  }
}

const notificationService = new NotificationService();
export default notificationService; 
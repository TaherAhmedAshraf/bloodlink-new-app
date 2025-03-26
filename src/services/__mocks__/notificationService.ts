import { 
  Notification, 
  NotificationType, 
  NotificationResponse, 
  NotificationSettings,
  SuccessResponse,
  UnreadCountResponse,
  RegisterTokenRequest,
  SendTestNotificationRequest,
  DeviceType
} from '../notificationService';

// Mock notifications for testing
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'blood_needed',
    time: new Date().toISOString(),
    isRead: false,
    title: 'Urgent: A+ Blood Needed',
    message: 'Someone in your area needs A+ blood type urgently.',
    bloodType: 'A+',
    metadata: { requestId: 'request-123' }
  },
  {
    id: 'notif-2',
    type: 'request_accepted',
    time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    isRead: false,
    title: 'Your request has been accepted',
    message: 'John Doe has accepted your blood request.',
    userName: 'John Doe',
    userImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    metadata: { requestId: 'request-456', userId: 'user-123' }
  },
  {
    id: 'notif-3',
    type: 'donation_reminder',
    time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    isRead: true,
    title: 'Donation Reminder',
    message: 'It\'s been 3 months since your last donation. You are eligible to donate again!',
  },
  {
    id: 'notif-4',
    type: 'system_announcement',
    time: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    isRead: true,
    title: 'BloodLink Update',
    message: 'We\'ve updated our app with new features! Check it out.',
  }
];

// Mock notification settings
const mockSettings: NotificationSettings = {
  pushNotificationsEnabled: true,
  bloodRequestsEnabled: true,
  requestUpdatesEnabled: true,
  donationRemindersEnabled: true,
  systemAnnouncementsEnabled: true
};

// Device tokens storage
const deviceTokens: { token: string, deviceType: DeviceType, deviceId?: string }[] = [];

class MockNotificationService {
  // Get notifications with pagination
  public async getNotifications(
    page: number = 1,
    limit: number = 10
  ): Promise<NotificationResponse> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNotifications = mockNotifications.slice(startIndex, endIndex);
    
    return {
      notifications: paginatedNotifications,
      pagination: {
        total: mockNotifications.length,
        page,
        limit,
        pages: Math.ceil(mockNotifications.length / limit)
      }
    };
  }

  // Mark notification as read
  public async markAsRead(notificationId: string): Promise<SuccessResponse> {
    const notification = mockNotifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.isRead = true;
      return {
        success: true,
        message: 'Notification marked as read',
        notificationId
      };
    }
    
    return {
      success: false,
      message: 'Notification not found'
    };
  }

  // Mark all notifications as read
  public async markAllAsRead(): Promise<SuccessResponse> {
    const unreadCount = mockNotifications.filter(n => !n.isRead).length;
    mockNotifications.forEach(n => n.isRead = true);
    
    return {
      success: true,
      message: 'All notifications marked as read',
      count: unreadCount
    };
  }

  // Get notification settings
  public async getSettings(): Promise<NotificationSettings> {
    return { ...mockSettings };
  }

  // Update notification settings
  public async updateSettings(settings: NotificationSettings): Promise<SuccessResponse> {
    Object.assign(mockSettings, settings);
    
    return {
      success: true,
      message: 'Notification settings updated successfully'
    };
  }

  // Register device token for push notifications
  public async registerDeviceToken(
    token: string, 
    deviceType: DeviceType,
    deviceId?: string
  ): Promise<SuccessResponse> {
    // Check if token already exists
    const existingIndex = deviceTokens.findIndex(dt => dt.token === token);
    
    if (existingIndex >= 0) {
      // Update existing token
      deviceTokens[existingIndex] = { token, deviceType, deviceId };
    } else {
      // Add new token
      deviceTokens.push({ token, deviceType, deviceId });
    }
    
    return {
      success: true,
      message: 'Device token registered successfully'
    };
  }

  // Get unread notification count
  public async getUnreadCount(): Promise<UnreadCountResponse> {
    const count = mockNotifications.filter(n => !n.isRead).length;
    
    return { count };
  }

  // Send test notification (admin only)
  public async sendTestNotification(
    data: SendTestNotificationRequest
  ): Promise<SuccessResponse> {
    const newNotificationId = `notif-test-${Date.now()}`;
    
    // Create a new mock notification
    const newNotification: Notification = {
      id: newNotificationId,
      type: data.type,
      time: new Date().toISOString(),
      isRead: false,
      title: data.title,
      message: data.message,
      metadata: data.data
    };
    
    // Add to mock notifications
    mockNotifications.unshift(newNotification);
    
    return {
      success: true,
      message: 'Test notification sent',
      notificationId: newNotificationId
    };
  }
}

const mockNotificationService = new MockNotificationService();
export default mockNotificationService; 
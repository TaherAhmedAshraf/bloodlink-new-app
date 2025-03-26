import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { navigate } from '../navigation/navigationRef';
import { notificationService } from '../services';
import { Notification, NotificationType, DeviceType } from '../services/notificationService';
import toast from '../utils/toast';
import DeviceInfo from 'react-native-device-info';
import { emitNewNotification, emitNotificationCountUpdated } from './notificationEventEmitter';

// For TypeScript
declare module 'react-native-push-notification' {
  interface PushNotificationPermissions {
    alert?: boolean;
    badge?: boolean;
    sound?: boolean;
  }

  interface PushNotification {
    configure(options: any): void;
    createChannel(channelId: string, channelName: string, channelOptions: any, callback: (created: boolean) => void): void;
    onNotification(notification: any): void;
    onAction(notification: any): void;
    onRegistrationError(error: any): void;
    requestPermissions(permissions?: string[]): Promise<PushNotificationPermissions>;
  }
}

interface PushNotificationToken {
  token: string;
  os: 'ios' | 'android';
}

interface FirebaseMessage {
  data?: Record<string, any>;
  notification?: {
    title?: string;
    body?: string;
  };
  messageId?: string;
  foreground?: boolean;
}

// Configure push notifications
const configurePushNotification = () => {
  PushNotification.configure({
    // Called when Token is generated
    onRegister: function (token: PushNotificationToken) {
      console.log('TOKEN:', token);
    },

    // Called when a remote notification is received
    onNotification: function (notification: any) {
      console.log('NOTIFICATION:', notification);

      // Process the notification
      processNotification(notification);

      // Handle iOS notification requirements
      if (Platform.OS === 'ios') {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      }
    },

    // Called when user taps on notification
    onAction: function (notification: any) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATION:', notification);

      // Process the notification action
      processNotificationAction(notification);
    },

    // Called when the user rejects permissions
    onRegistrationError: function(err: any) {
      console.error('Registration error:', err.message);
    },

    // iOS only: permissions
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Android only: channel configuration
    popInitialNotification: true,
    requestPermissions: true,
  });

  // Create a notification channel for Android
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: 'BloodLink',
        channelName: 'BloodLink',
        channelDescription: 'BloodLink notifications',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created: boolean) => console.log(`Channel created: ${created}`)
    );
  }
};

// Request notification permission from user
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      // For iOS
      const authStatus = await messaging().requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    } else {
      // For Android 13+ (API 33+), check and request permissions
      if (parseInt(Platform.Version as string, 10) >= 33) {
        // Check current permission status
        const hasPermission = await messaging().hasPermission();
        
        // If permission is not determined, request it
        if (hasPermission === messaging.AuthorizationStatus.NOT_DETERMINED) {
          const status = await messaging().requestPermission();
          return status === messaging.AuthorizationStatus.AUTHORIZED || 
                 status === messaging.AuthorizationStatus.PROVISIONAL;
        }
        
        // Return true if already authorized or provisional
        return hasPermission === messaging.AuthorizationStatus.AUTHORIZED ||
               hasPermission === messaging.AuthorizationStatus.PROVISIONAL;
      } else {
        // For older Android versions, check if Firebase Messaging is available
        try {
          // This will throw an error if Firebase is not properly set up
          await messaging().getToken();
          return true;
        } catch (error) {
          console.error('Failed to get FCM token:', error);
          return false;
        }
      }
    }
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return false;
  }
};

// Get device unique identifier
export const getDeviceId = async (): Promise<string> => {
  try {
    const uniqueId = await DeviceInfo.getUniqueId();
    return uniqueId;
  } catch (error) {
    console.error('Failed to get device ID:', error);
    return Date.now().toString(); // Fallback to timestamp
  }
};

// Get FCM token for the device
export const getDeviceToken = async (): Promise<string | null> => {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Failed to get FCM token:', error);
    return null;
  }
};

// Process incoming notifications
const processNotification = (notification: FirebaseMessage) => {
  const title = notification.notification?.title || 'New Notification';
  const body = notification.notification?.body || '';
  const data = notification.data || {};
  
  // Emit event for new notification
  emitNewNotification({
    title,
    body,
    ...data
  });
  
  // Update notification count
  notificationService.getUnreadCount()
    .then(response => {
      emitNotificationCountUpdated(response.count);
    })
    .catch(error => {
      console.error('Failed to get unread count:', error);
    });
  
  // Show notification in-app if the app is in foreground
  if (notification.foreground) {
    showInAppNotification(title, body, data.type as string, data);
  }
};

// Process notification actions when user taps on notification
const processNotificationAction = (notification: FirebaseMessage) => {
  const data = notification.data;
  
  if (data) {
    // Navigate to appropriate screen based on notification type
    handleNotificationNavigation(data);
  }
};

// Handle navigation based on notification type
export const handleNotificationOpen = (notification: Notification) => {
  try {
    const { type, id, metadata } = notification;
    const requestId = metadata?.requestId || id;
    
    // Log notification information instead of navigating
    console.log('Notification pressed:', { type, id, requestId, metadata });
    
    // Show toast message that the notification was pressed
    toast.info('Notification', 'Notification details are available in the notification screen');
    
    // Always navigate to the notification screen only
    navigate('Notification');
  } catch (error) {
    console.error('Error handling notification press:', error);
    navigate('Notification');
  }
};

// Handle navigation based on notification data
export const handleNotificationNavigation = (data: Record<string, any>) => {
  try {
    const { type, requestId } = data;
    
    // Log notification data instead of navigating
    console.log('Notification data received:', { type, requestId, ...data });
    
    // Show toast message that the notification was received
    toast.info('Notification', 'Notification received');
    
    // Always navigate to the notification screen only
    navigate('Notification');
  } catch (error) {
    console.error('Error handling notification data:', error);
    navigate('Notification');
  }
};

// Show in-app notification
export const showInAppNotification = (
  title: string,
  message: string,
  type?: string,
  data?: Record<string, any>
) => {
  // Use toast for in-app notifications
  toast.info(title, message, {
    visibilityTime: 5000,
    position: 'top',
    // Custom callback when toast is pressed - always go to notification screen
    onPress: () => {
      console.log('In-app notification pressed:', { title, message, type, data });
      navigate('Notification');
    }
  } as any); // Type as any since ToastOptions doesn't include onPress
};

// Register device token with the server
export const registerDeviceToken = async (token: string): Promise<boolean> => {
  try {
    const deviceType: DeviceType = Platform.OS === 'ios' ? 'ios' : 'android';
    const deviceId = await getDeviceId();
    
    const response = await notificationService.registerDeviceToken(
      token,
      deviceType,
      deviceId
    );
    
    return response.success;
  } catch (error) {
    console.error('Failed to register device token:', error);
    return false;
  }
};

// Setup push notifications
export const setupPushNotifications = async (): Promise<() => void> => {
  try {
    // Request permission
    const granted = await requestNotificationPermission();
    
    if (!granted) {
      console.log('Notification permission not granted');
      return () => {}; // Return empty cleanup function
    }
    
    // Get device token
    const token = await getDeviceToken();
    
    // Register token with backend
    if (token) {
      try {
        const success = await registerDeviceToken(token);
        if (success) {
          console.log('Device token registered successfully');
        } else {
          console.error('Failed to register device token');
        }
      } catch (error) {
        console.error('Failed to register device token:', error);
      }
    }
    
    // Configure local notifications
    configurePushNotification();
    
    // Set up listeners for incoming messages
    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage: FirebaseMessage) => {
      console.log('Foreground message received:', remoteMessage);
      
      // Show in-app notification for foreground messages
      showInAppNotification(
        remoteMessage.notification?.title || 'New Notification',
        remoteMessage.notification?.body || '',
        remoteMessage.data?.type as string | undefined,
        remoteMessage.data
      );
    });
    
    // Handle background/quit state notifications when app is opened
    messaging().getInitialNotification().then((remoteMessage: FirebaseMessage | null) => {
      if (remoteMessage) {
        console.log('Notification caused app to open:', remoteMessage);
        // Always navigate to notification screen
        navigate('Notification');
      }
    });
    
    // Handle notification open events
    const unsubscribeOnNotificationOpen = messaging().onNotificationOpenedApp((remoteMessage: FirebaseMessage) => {
      console.log('Notification opened app:', remoteMessage);
      // Always navigate to notification screen
      navigate('Notification');
    });
    
    // Handle token refresh
    const unsubscribeOnTokenRefresh = messaging().onTokenRefresh(async (newToken: string) => {
      console.log('FCM token refreshed:', newToken);
      
      try {
        const success = await registerDeviceToken(newToken);
        if (success) {
          console.log('Refreshed token registered successfully');
        } else {
          console.error('Failed to register refreshed token');
        }
      } catch (error) {
        console.error('Failed to register refreshed token:', error);
      }
    });
    
    // Return a cleanup function
    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpen();
      unsubscribeOnTokenRefresh();
    };
  } catch (error) {
    console.error('Failed to setup push notifications:', error);
    return () => {}; // Return empty cleanup function on error
  }
};

export default {
  setupPushNotifications,
  requestNotificationPermission,
  getDeviceToken,
  registerDeviceToken,
  handleNotificationNavigation,
  showInAppNotification,
}; 
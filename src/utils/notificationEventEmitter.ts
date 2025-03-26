import { DeviceEventEmitter } from 'react-native';

// Event names
export const NOTIFICATION_EVENTS = {
  NOTIFICATION_READ: 'bloodlink:notification_read',
  ALL_NOTIFICATIONS_READ: 'bloodlink:all_notifications_read',
  NEW_NOTIFICATION: 'bloodlink:new_notification',
  NOTIFICATION_COUNT_UPDATED: 'bloodlink:notification_count_updated',
};

// Emit event when a notification is read
export const emitNotificationRead = (notificationId: string) => {
  DeviceEventEmitter.emit(NOTIFICATION_EVENTS.NOTIFICATION_READ, { notificationId });
};

// Emit event when all notifications are marked as read
export const emitAllNotificationsRead = () => {
  DeviceEventEmitter.emit(NOTIFICATION_EVENTS.ALL_NOTIFICATIONS_READ);
};

// Emit event when a new notification is received
export const emitNewNotification = (notification: any) => {
  DeviceEventEmitter.emit(NOTIFICATION_EVENTS.NEW_NOTIFICATION, { notification });
};

// Emit event when notification count is updated
export const emitNotificationCountUpdated = (count: number) => {
  DeviceEventEmitter.emit(NOTIFICATION_EVENTS.NOTIFICATION_COUNT_UPDATED, { count });
};

// Listen for notification read events
export const listenToNotificationRead = (callback: (data: { notificationId: string }) => void) => {
  return DeviceEventEmitter.addListener(
    NOTIFICATION_EVENTS.NOTIFICATION_READ,
    callback
  );
};

// Listen for all notifications read event
export const listenToAllNotificationsRead = (callback: () => void) => {
  return DeviceEventEmitter.addListener(
    NOTIFICATION_EVENTS.ALL_NOTIFICATIONS_READ,
    callback
  );
};

// Listen for new notification event
export const listenToNewNotification = (callback: (data: { notification: any }) => void) => {
  return DeviceEventEmitter.addListener(
    NOTIFICATION_EVENTS.NEW_NOTIFICATION,
    callback
  );
};

// Listen for notification count updated event
export const listenToNotificationCountUpdated = (callback: (data: { count: number }) => void) => {
  return DeviceEventEmitter.addListener(
    NOTIFICATION_EVENTS.NOTIFICATION_COUNT_UPDATED,
    callback
  );
}; 
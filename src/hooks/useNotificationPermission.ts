import { useState, useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { requestNotificationPermission } from '../utils/notificationHandler';
import messaging from '@react-native-firebase/messaging';

type PermissionStatus = 'checking' | 'granted' | 'denied' | 'blocked' | 'unavailable';

export const useNotificationPermission = () => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('checking');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Check if notification permissions are currently granted
      let status;
      
      if (Platform.OS === 'ios') {
        status = await messaging().hasPermission();
      } else if (parseInt(Platform.Version as string, 10) >= 33) {
        status = await messaging().hasPermission();
      } else {
        // For older Android, assume granted
        setPermissionStatus('granted');
        setIsLoading(false);
        return;
      }
      
      if (status === messaging.AuthorizationStatus.AUTHORIZED ||
          status === messaging.AuthorizationStatus.PROVISIONAL) {
        setPermissionStatus('granted');
      } else if (status === messaging.AuthorizationStatus.DENIED) {
        setPermissionStatus('denied');
      } else if (status === messaging.AuthorizationStatus.NOT_DETERMINED) {
        setPermissionStatus('denied'); // Not determined yet, will need to request
      } else {
        setPermissionStatus('unavailable');
      }
    } catch (error) {
      console.error('Error checking notification permission:', error);
      setPermissionStatus('unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const granted = await requestNotificationPermission();
      
      if (granted) {
        setPermissionStatus('granted');
        return true;
      } else {
        // Check if permission is blocked (previously denied)
        const status = await messaging().hasPermission();
        
        if (status === messaging.AuthorizationStatus.DENIED) {
          setPermissionStatus('blocked');
        } else {
          setPermissionStatus('denied');
        }
        
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setPermissionStatus('unavailable');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const showPermissionAlert = () => {
    Alert.alert(
      'Notification Permission Required',
      'To receive blood donation alerts and updates, please enable notifications for BloodLink in your device settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: openSettings }
      ]
    );
  };

  return {
    permissionStatus,
    isLoading,
    requestPermission,
    checkPermission,
    openSettings,
    showPermissionAlert
  };
};

export default useNotificationPermission; 
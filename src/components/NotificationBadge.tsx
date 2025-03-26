import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { notificationService } from '../services';
import colors from '../theme/colors';
import { 
  listenToNotificationRead, 
  listenToAllNotificationsRead, 
  listenToNotificationCountUpdated 
} from '../utils/notificationEventEmitter';

interface NotificationBadgeProps {
  size?: number;
  color?: string;
  badgeColor?: string;
  onPress?: () => void;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  size = 24,
  color = colors.text,
  badgeColor = colors.error,
  onPress,
}) => {
  const navigation = useNavigation();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Initial fetch of the unread count
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  // Set up focus listener to refresh badge when returning to this screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUnreadCount();
    });

    return unsubscribe;
  }, [navigation]);

  // Set up an interval to fetch the unread count every minute
  useEffect(() => {
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  // Set up event listeners for real-time notification updates
  useEffect(() => {
    // Listen for notification read events
    const notificationReadListener = listenToNotificationRead(() => {
      // Update the count when a notification is marked as read
      fetchUnreadCount();
    });

    // Listen for all notifications read event
    const allNotificationsReadListener = listenToAllNotificationsRead(() => {
      // Set the count to 0 when all notifications are read
      setUnreadCount(0);
    });

    // Listen for notification count updated events
    const notificationCountUpdatedListener = listenToNotificationCountUpdated((data) => {
      // Set the count to the updated value
      setUnreadCount(data.count);
    });

    // Clean up listeners
    return () => {
      notificationReadListener.remove();
      allNotificationsReadListener.remove();
      notificationCountUpdatedListener.remove();
    };
  }, []);

  const fetchUnreadCount = async () => {
    try {
      setLoading(true);
      // Use the proper method to get unread count
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.count);
    } catch (error) {
      console.error('Failed to fetch unread notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('Notification');
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      disabled={loading}
    >
      <Icon name="bell" size={size} color={color} />
      
      {loading ? (
        <View style={[styles.badge, { backgroundColor: colors.border }]}>
          <ActivityIndicator size="small" color={colors.background} />
        </View>
      ) : unreadCount > 0 ? (
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default NotificationBadge; 
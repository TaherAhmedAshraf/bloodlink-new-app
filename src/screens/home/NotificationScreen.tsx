import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { notificationService, Notification as ApiNotification } from '../../services';
import toast from '../../utils/toast';

type NotificationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Notification'
>;

interface NotificationScreenProps {
  navigation: NotificationScreenNavigationProp;
}

// Define notification types
type NotificationType = 'request_accepted' | 'blood_needed';

interface Notification {
  id: string;
  type: NotificationType;
  userName?: string;
  userImage?: string;
  bloodType?: string;
  time: string;
  isRead: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'request_accepted',
    userName: 'Austin Clark',
    userImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    time: '1h',
    isRead: false,
  },
  {
    id: '2',
    type: 'request_accepted',
    userName: 'Austin Clark',
    userImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    time: '1h',
    isRead: true,
  },
  {
    id: '3',
    type: 'blood_needed',
    bloodType: 'A+',
    time: '1h',
    isRead: false,
  },
  {
    id: '4',
    type: 'blood_needed',
    bloodType: 'A+',
    time: '1h',
    isRead: true,
  },
];

const NotificationScreen: React.FC<NotificationScreenProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(!refreshing);
      setError(null);
      
      const response = await notificationService.getNotifications();
      setNotifications(response.notifications);
      
      if (refreshing) {
        toast.success('Notifications Updated', 'Your notifications have been refreshed');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      // Use mock data if API fails during development
      setNotifications(NOTIFICATIONS as unknown as ApiNotification[]);
      
      if (refreshing) {
        toast.error('Refresh Failed', 'Could not update notifications');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      // Update the notification in the state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const renderNotificationItem = ({ item }: { item: ApiNotification }) => {
    if (item.type === 'request_accepted') {
      return (
        <TouchableOpacity 
          style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
          onPress={() => handleNotificationPress(item)}
        >
          <Image 
            source={{ uri: item.userImage }} 
            style={styles.userImage} 
          />
          <View style={styles.notificationContent}>
            <Text style={styles.notificationText}>
              <Text style={styles.userName}>{item.userName}</Text> accepted your blood request
            </Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          {!item.isRead && <View style={styles.unreadIndicator} />}
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity 
          style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
          onPress={() => handleNotificationPress(item)}
        >
          <View style={styles.bloodTypeCircle}>
            <Text style={styles.bloodTypeText}>{item.bloodType}</Text>
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationText}>
              <Text style={styles.bloodType}>{item.bloodType} Blood</Text> needed near your location
            </Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          {!item.isRead && <View style={styles.unreadIndicator} />}
        </TouchableOpacity>
      );
    }
  };

  const handleNotificationPress = async (notification: ApiNotification) => {
    // Mark notification as read if it's not already read
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }
    
    // Handle navigation based on notification type
    if (notification.type === 'request_accepted') {
      console.log('Navigate to request detail or chat with donor');
      // Example navigation:
      // navigation.navigate('RequestDetail', { requestId: '123' });
    } else if (notification.type === 'blood_needed') {
      console.log('Navigate to nearby blood request');
      // Example navigation:
      // navigation.navigate('RequestDetail', { requestId: '456' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Notification List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setError(null);
              // Fetch notifications again
              notificationService.getNotifications()
                .then(response => {
                  setNotifications(response.notifications);
                  toast.success('Notifications loaded successfully');
                })
                .catch(e => {
                  setError(e instanceof Error ? e.message : 'An error occurred');
                  setNotifications(NOTIFICATIONS as unknown as ApiNotification[]);
                  toast.error('Failed to load notifications');
                })
                .finally(() => setLoading(false));
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separatorLine} />}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No notifications</Text>
            </View>
          }
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerRight: {
    width: 40,
  },
  listContainer: {
    paddingVertical: 8,
    gap: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderWidth: .5,
    borderColor: colors.border,
    borderRadius: 10,
  },
  unreadItem: {
    backgroundColor: 'rgba(198, 40, 40, 0.05)',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  bloodTypeCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  userName: {
    fontWeight: '600',
  },
  bloodType: {
    fontWeight: '600',
  },
  timeText: {
    fontSize: 14,
    color: colors.primary,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.error,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  separatorLine: {
    height: 1,
    backgroundColor: colors.border,
  },
  emptyText: {
    color: colors.text,
    fontSize: 16,
  },
});

export default NotificationScreen; 
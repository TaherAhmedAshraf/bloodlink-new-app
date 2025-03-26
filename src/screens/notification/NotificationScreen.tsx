import React, { useState, useEffect, useCallback } from 'react';
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
  RefreshControl,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { notificationService, Notification } from '../../services';
import { handleNotificationOpen } from '../../utils/notificationHandler';
import toast from '../../utils/toast';
import { emitNotificationRead, emitAllNotificationsRead, emitNotificationCountUpdated } from '../../utils/notificationEventEmitter';

// Shimmer effect component
interface ShimmerProps {
  width: number | string;
  height: number | string;
  style?: any;
}

const Shimmer: React.FC<ShimmerProps> = ({ width, height, style }) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [typeof width === 'number' ? -width : -100, typeof width === 'number' ? width : 100],
  });

  return (
    <View style={[{ width, height, backgroundColor: '#E1E9EE', overflow: 'hidden' }, style]}>
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          backgroundColor: '#F2F8FC',
          transform: [{ translateX }],
          opacity: 0.5,
        }}
      />
    </View>
  );
};

// Skeleton component for notification loading
const NotificationSkeleton: React.FC = () => {
  return (
    <View style={styles.notificationItem}>
      <Shimmer width={50} height={50} style={styles.skeletonAvatar} />
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Shimmer width={'70%'} height={18} style={styles.skeletonTitle} />
        </View>
        
        <Shimmer width={'90%'} height={14} style={styles.skeletonMessage} />
        <Shimmer width={'40%'} height={12} style={styles.skeletonTime} />
      </View>
    </View>
  );
};

const NotificationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (pageNumber = 1, append = false) => {
    try {
      setLoading(pageNumber === 1 && !append);
      if (append) setPage(pageNumber);

      const response = await notificationService.getNotifications(pageNumber, 10);
      
      if (response && response.notifications) {
        if (append) {
          setNotifications(prev => [...prev, ...response.notifications]);
        } else {
          setNotifications(response.notifications);
        }
        
        // Check if we have more pages
        setHasMore(
          response.pagination.page < response.pagination.pages
        );
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchNotifications(1, false);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading && !refreshing) {
      fetchNotifications(page + 1, true);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Mark the notification as read in the backend
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true } 
            : notif
        )
      );
      
      // Get the updated unread count
      const countResponse = await notificationService.getUnreadCount();
      
      // Emit events to update the badge in real-time
      emitNotificationRead(notificationId);
      emitNotificationCountUpdated(countResponse.count);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Mark all notifications as read in the backend
      await notificationService.markAllAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      
      // Emit events to update the badge in real-time
      emitAllNotificationsRead();
      emitNotificationCountUpdated(0);
      
      toast.success('Success', 'All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('Error', 'Failed to mark all notifications as read');
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // If notification is not read, mark it as read
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Show a toast with notification details instead of navigating
    let toastMessage = '';
    
    switch(notification.type) {
      case 'blood_needed':
        toastMessage = `${notification.bloodType || 'Blood'} needed at ${notification.message || 'nearby location'}`;
        break;
      case 'request_accepted':
        toastMessage = `${notification.userName || 'Someone'} accepted your blood request`;
        break;
      case 'donation_reminder':
        toastMessage = 'Reminder to update your donation information';
        break;
      case 'donor_changed':
        toastMessage = 'Donor has been changed for your request';
        break;
      case 'request_cancelled':
        toastMessage = 'A blood request has been cancelled';
        break;
      case 'donation_completed':
        toastMessage = 'Blood donation has been completed';
        break;
      case 'system_announcement':
        toastMessage = notification.message || 'System announcement';
        break;
      default:
        toastMessage = notification.message || 'Notification details';
    }
    
    toast.info('Notification Details', toastMessage);
  };

  const navigateToSettings = () => {
    navigation.navigate('NotificationSettings' as never);
  };

  // Helper function to get appropriate title based on notification type
  const getNotificationTitle = (type: string): string => {
    switch(type) {
      case 'blood_needed':
        return 'Blood Request';
      case 'request_accepted':
        return 'Request Accepted';
      case 'donation_reminder':
        return 'Donation Reminder';
      case 'donor_changed':
        return 'Donor Changed';
      case 'request_cancelled':
        return 'Request Cancelled';
      case 'donation_completed':
        return 'Donation Completed';
      case 'system_announcement':
        return 'Announcement';
      default:
        return 'Notification';
    }
  };

  // Helper function to get the blood type circle color based on blood type
  const getBloodTypeCircleColor = (bloodType: string) => {
    return `${colors.primary}20`; // Light red background
  };

  // Helper function to render the icon or blood type
  const getNotificationIcon = (notification: Notification) => {
    if (notification.type === 'blood_needed') {
      return (
        <View style={styles.bloodTypeContainer}>
          <Text style={styles.bloodTypeText}>{notification.bloodType}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.defaultIconContainer}>
          <Image source={require('../../assets/images/avater.png')} style={styles.userImage} />
        </View>
      );
    }
  };

  // Helper to format the date in a readable format (like "1h")
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin}m`;
    } else if (diffHour < 24) {
      return `${diffHour}h`;
    } else if (diffDay < 7) {
      return `${diffDay}d`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    // Make sure item is defined before attempting to render
    if (!item) {
      return null;
    }
    
    // Format notification message based on type
    let notificationMessage = '';
    
    switch(item.type) {
      case 'blood_needed':
        notificationMessage = `${item.bloodType || 'Blood'} needed near your location`;
        break;
      case 'request_accepted':
        notificationMessage = `${item.userName || 'Someone'} accepted your blood request`;
        break;
      case 'donation_reminder':
        notificationMessage = 'Please update your donation information';
        break;
      case 'donor_changed':
        notificationMessage = 'Donor has been changed for your request';
        break;
      case 'request_cancelled':
        notificationMessage = 'A blood request has been cancelled';
        break;
      case 'donation_completed':
        notificationMessage = 'Blood donation has been completed';
        break;
      case 'system_announcement':
        notificationMessage = item.message || 'System announcement';
        break;
      default:
        notificationMessage = item.message || 'New notification';
    }
    
    return (
      <TouchableOpacity
        style={styles.notificationItem}
        onPress={() => handleNotificationPress(item)}
      >
        {getNotificationIcon(item)}
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>
              {item.userName || item.title || getNotificationTitle(item.type)}
            </Text>
            {item.isRead === false && <View style={styles.unreadIndicator} />}
          </View>
          
          <Text style={styles.notificationMessage}>
            {notificationMessage}
          </Text>
          
          {item.metadata && Object.keys(item.metadata).length > 0 && (
            <Text style={styles.notificationMetadata}>
              ID: {item.metadata.requestId || 'N/A'}
            </Text>
          )}
          
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => {
    if (loading) {
      // Return null as we'll show skeleton loaders instead
      return null;
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Icon name="bell-off-outline" size={60} color={colors.disabled} />
        <Text style={styles.emptyText}>No notifications yet</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!hasMore) return null;
    
    return (
      <View style={styles.footerContainer}>
        {loading && <ActivityIndicator size="small" color={colors.primary} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <TouchableOpacity onPress={navigateToSettings} style={styles.settingsButton}>
          <Icon name="cog" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      {notifications.length > 0 && (
        <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      )}
      
      {loading && notifications.length === 0 ? (
        // Show skeleton loaders when loading and no notifications are cached
        <FlatList
          data={Array(5).fill(0)}
          renderItem={() => <NotificationSkeleton />}
          keyExtractor={(_, index) => `skeleton-${index}`}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        // Show actual notifications when loaded or when refreshing with cached data
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  backButton: {
    padding: 4,
  },
  settingsButton: {
    padding: 4,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  bloodTypeContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bloodTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  defaultIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: colors.textLight,
  },
  notificationMetadata: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 12,
  },
  footerContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markAllButton: {
    padding: 12,
    alignItems: 'flex-end',
    marginRight: 16,
  },
  markAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  // Skeleton styles
  skeletonAvatar: {
    borderRadius: 25,
    marginRight: 12,
  },
  skeletonTitle: {
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonMessage: {
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonTime: {
    borderRadius: 4,
  },
});

export default NotificationScreen;
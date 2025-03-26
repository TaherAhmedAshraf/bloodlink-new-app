import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');

export type NotificationType = 'blood_needed' | 'request_accepted' | 'donation_reminder' | 'system_announcement' | 'donor_changed' | 'request_cancelled' | 'donation_completed';

interface InAppNotificationProps {
  title: string;
  message: string;
  type?: NotificationType;
  onPress?: () => void;
  onClose?: () => void;
  duration?: number;
}

const InAppNotification: React.FC<InAppNotificationProps> = ({
  title,
  message,
  type = 'system_announcement',
  onPress,
  onClose,
  duration = 5000,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Show notification
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto dismiss after duration
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onClose) onClose();
    });
  };

  const handlePress = () => {
    handleClose();
    if (onPress) {
      setTimeout(() => {
        onPress();
      }, 300);
    }
  };

  const getIconName = (): string => {
    switch (type) {
      case 'blood_needed':
        return 'water';
      case 'request_accepted':
        return 'check-circle';
      case 'donation_reminder':
        return 'calendar-clock';
      case 'donor_changed':
        return 'account-switch';
      case 'request_cancelled':
        return 'close-circle';
      case 'donation_completed':
        return 'check-circle-outline';
      default:
        return 'bell';
    }
  };

  const getIconColor = (): string => {
    switch (type) {
      case 'blood_needed':
        return colors.error;
      case 'request_accepted':
        return colors.success;
      case 'donation_reminder':
        return colors.warning;
      case 'donor_changed':
        return colors.info;
      case 'request_cancelled':
        return colors.error;
      case 'donation_completed':
        return colors.success;
      default:
        return colors.primary;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }] },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        activeOpacity={0.8}
        onPress={handlePress}
      >
        <View style={styles.iconContainer}>
          <Icon name={getIconName()} size={24} color={getIconColor()} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {message}
          </Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Icon name="close" size={16} color={colors.textLight} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 40, // For status bar
    paddingHorizontal: 16,
  },
  content: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: colors.textLight,
  },
  closeButton: {
    padding: 4,
  },
});

export default InAppNotification; 
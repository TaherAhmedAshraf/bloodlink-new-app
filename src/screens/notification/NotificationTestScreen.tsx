import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { notificationService, NotificationType } from '../../services';
import toast from '../../utils/toast';
import { getDeviceToken, showInAppNotification } from '../../utils/notificationHandler';

// Add this component only in development builds
const NotificationTestScreen: React.FC = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('blood_needed');
  const [loading, setLoading] = useState(false);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);

  const notificationTypes: NotificationType[] = [
    'blood_needed',
    'request_accepted',
    'donation_reminder',
    'system_announcement',
    'donor_changed',
    'request_cancelled',
    'donation_completed'
  ];

  // Get device token on mount
  React.useEffect(() => {
    fetchDeviceToken();
  }, []);

  const fetchDeviceToken = async () => {
    try {
      const token = await getDeviceToken();
      setDeviceToken(token);
    } catch (error) {
      console.error('Failed to get device token:', error);
    }
  };

  const sendTestNotification = async () => {
    if (!title || !message) {
      Alert.alert('Missing Fields', 'Please enter a title and message');
      return;
    }

    setLoading(true);
    
    try {
      const response = await notificationService.sendTestNotification({
        userId: userId || 'self', // Use 'self' to send to current device
        type,
        title,
        message,
        data: {
          test: true,
          timestamp: new Date().toISOString()
        }
      });

      if (response.success) {
        toast.success('Notification Sent', 'Test notification sent successfully');
        // Reset fields
        setTitle('');
        setMessage('');
      } else {
        toast.error('Failed', response.message);
      }
    } catch (error) {
      console.error('Failed to send test notification:', error);
      toast.error('Error', 'Failed to send test notification');
    } finally {
      setLoading(false);
    }
  };

  const testInAppNotification = () => {
    if (!title || !message) {
      Alert.alert('Missing Fields', 'Please enter a title and message');
      return;
    }

    // Show in-app notification
    showInAppNotification(
      title,
      message,
      type,
      {
        type,
        test: true,
        timestamp: new Date().toISOString()
      }
    );
  };

  const copyDeviceToken = () => {
    if (deviceToken) {
      // In a real app, you'd use Clipboard.setString(deviceToken)
      // But for now, just show an alert with the token
      Alert.alert('Device Token', deviceToken, [
        { text: 'OK' }
      ]);
    }
  };

  const renderNotificationTypeButton = (notificationType: NotificationType) => {
    const isSelected = type === notificationType;
    return (
      <TouchableOpacity
        key={notificationType}
        style={[styles.typeButton, isSelected && styles.selectedTypeButton]}
        onPress={() => setType(notificationType)}
      >
        <Text style={[styles.typeButtonText, isSelected && styles.selectedTypeText]}>
          {notificationType.replace('_', ' ')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Test</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Device Token</Text>
        <View style={styles.tokenContainer}>
          <Text style={styles.tokenText} numberOfLines={1} ellipsizeMode="middle">
            {deviceToken || 'Loading...'}
          </Text>
          <TouchableOpacity onPress={copyDeviceToken} disabled={!deviceToken}>
            <Icon name="content-copy" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Notification Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typesContainer}>
          {notificationTypes.map(renderNotificationTypeButton)}
        </ScrollView>

        <Text style={styles.sectionTitle}>User ID (optional)</Text>
        <TextInput
          style={styles.input}
          value={userId}
          onChangeText={setUserId}
          placeholder="Leave empty to send to yourself"
          placeholderTextColor={colors.placeholder}
        />

        <Text style={styles.sectionTitle}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter notification title"
          placeholderTextColor={colors.placeholder}
        />

        <Text style={styles.sectionTitle}>Message</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          value={message}
          onChangeText={setMessage}
          placeholder="Enter notification message"
          placeholderTextColor={colors.placeholder}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={testInAppNotification}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Test In-App</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={sendTestNotification}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.secondary} />
            ) : (
              <Text style={[styles.buttonText, styles.primaryButtonText]}>Send Test</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.border,
    borderRadius: 8,
    padding: 12,
  },
  tokenText: {
    flex: 1,
    color: colors.text,
    marginRight: 8,
  },
  typesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    marginHorizontal: -4,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  selectedTypeButton: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    color: colors.text,
    fontSize: 14,
  },
  selectedTypeText: {
    color: colors.secondary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: colors.text,
  },
  messageInput: {
    height: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  primaryButtonText: {
    color: colors.secondary,
  },
});

export default NotificationTestScreen; 
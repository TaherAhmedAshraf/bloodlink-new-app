import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator
} from 'react-native';
import { colors } from '../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useNotificationPermission from '../hooks/useNotificationPermission';

interface NotificationPermissionHandlerProps {
  onPermissionGranted?: () => void;
  onDismiss?: () => void;
}

export const NotificationPermissionHandler: React.FC<NotificationPermissionHandlerProps> = ({
  onPermissionGranted,
  onDismiss
}) => {
  const { 
    permissionStatus, 
    isLoading, 
    requestPermission, 
    openSettings,
    showPermissionAlert
  } = useNotificationPermission();

  useEffect(() => {
    if (permissionStatus === 'granted') {
      onPermissionGranted?.();
    }
  }, [permissionStatus, onPermissionGranted]);

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    
    if (!granted) {
      // If permission was denied and we've already prompted before,
      // show the settings dialog
      if (permissionStatus === 'blocked') {
        showPermissionAlert();
      }
    }
  };

  const handleLater = () => {
    onDismiss?.();
  };

  if (permissionStatus === 'granted') {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Icon name="bell-alert" size={50} color={colors.primary} style={styles.icon} />
        
        <Text style={styles.title}>Enable Notifications</Text>
        <Text style={styles.description}>
          BloodLink needs notification permission to alert you about urgent blood donation requests and updates.
        </Text>
        
        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              <TouchableOpacity 
                style={styles.button}
                onPress={handleRequestPermission}
              >
                <Text style={styles.buttonText}>Enable Notifications</Text>
              </TouchableOpacity>
              
              {permissionStatus === 'blocked' && (
                <TouchableOpacity 
                  style={[styles.button, styles.settingsButton]}
                  onPress={openSettings}
                >
                  <Text style={styles.buttonText}>Open Settings</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.laterButton}
                onPress={handleLater}
              >
                <Text style={styles.laterButtonText}>Maybe Later</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  settingsButton: {
    backgroundColor: colors.info,
  },
  laterButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  laterButtonText: {
    color: colors.textLight,
    fontSize: 14,
  },
});

export default NotificationPermissionHandler; 
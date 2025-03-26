import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { notificationService } from '../../services';
import { NotificationSettings } from '../../services/notificationService';
import colors from '../../theme/colors';
import { requestNotificationPermission } from '../../utils/notificationHandler';

// Whether the app is in development mode (not production)
const isDev = __DEV__;

const NotificationSettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [settings, setSettings] = useState<NotificationSettings>({
    pushNotificationsEnabled: true,
    bloodRequestsEnabled: true,
    requestUpdatesEnabled: true,
    donationRemindersEnabled: true,
    systemAnnouncementsEnabled: true,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermissions();
    fetchSettings();
  }, []);

  const checkPermissions = async () => {
    const granted = await requestNotificationPermission();
    setPermissionGranted(granted);
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getSettings();
      setSettings(response);
    } catch (error) {
      console.error('Failed to fetch notification settings:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load notification settings',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (setting: keyof NotificationSettings) => {
    // Special handling for main toggle
    if (setting === 'pushNotificationsEnabled') {
      // If turning off main toggle, disable all notifications
      const newValue = !settings.pushNotificationsEnabled;
      setSettings(prev => ({
        ...prev,
        pushNotificationsEnabled: newValue,
        // If disabling main toggle, also disable all subtypes
        ...(newValue === false && {
          bloodRequestsEnabled: false,
          requestUpdatesEnabled: false,
          donationRemindersEnabled: false,
          systemAnnouncementsEnabled: false,
        }),
      }));
    } else {
      // For subtypes, just toggle that specific one
      setSettings(prev => ({
        ...prev,
        [setting]: !prev[setting as keyof NotificationSettings],
      }));
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await notificationService.updateSettings(settings);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Notification settings saved',
      });
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save notification settings',
      });
    } finally {
      setSaving(false);
    }
  };

  const goToTestScreen = () => {
    navigation.navigate('NotificationTest' as never);
  };

  const renderSettingItem = (
    title: string,
    description: string | null,
    setting: keyof NotificationSettings,
    icon: string,
    disabled = false
  ) => {
    return (
      <View
        style={[
          styles.settingItem,
          disabled && styles.settingItemDisabled,
        ]}
      >
        <View style={styles.settingIconContainer}>
          <Icon
            name={icon}
            size={24}
            color={disabled ? colors.disabled : colors.primary}
          />
        </View>
        <View style={styles.settingContent}>
          <Text
            style={[
              styles.settingTitle,
              disabled && styles.settingTitleDisabled,
            ]}
          >
            {title}
          </Text>
          {description && (
            <Text
              style={[
                styles.settingDescription,
                disabled && styles.settingDescriptionDisabled,
              ]}
            >
              {description}
            </Text>
          )}
        </View>
        <Switch
          value={settings[setting]}
          onValueChange={() => handleToggle(setting)}
          disabled={disabled || loading}
          trackColor={{ false: colors.border, true: `${colors.primary}80` }}
          thumbColor={settings[setting] ? colors.primary : colors.disabled}
          ios_backgroundColor={colors.border}
        />
      </View>
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        {isDev && (
          <TouchableOpacity onPress={goToTestScreen} style={styles.testButton}>
            <Icon name="lab" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        {permissionGranted === false && (
          <View style={styles.permissionWarning}>
            <Icon name="alert-circle" size={24} color={colors.warning} />
            <Text style={styles.permissionWarningText}>
              Notifications are disabled at the system level. Please enable them in your device settings.
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          {renderSettingItem(
            'Enable Notifications',
            'Receive push notifications on this device',
            'pushNotificationsEnabled',
            'bell',
            permissionGranted === false
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          {renderSettingItem(
            'Blood Requests',
            'Get notified when someone needs your blood type',
            'bloodRequestsEnabled',
            'water',
            !settings.pushNotificationsEnabled || permissionGranted === false
          )}
          {renderSettingItem(
            'Request Updates',
            'Get notified when your request is accepted or completed',
            'requestUpdatesEnabled',
            'check-circle',
            !settings.pushNotificationsEnabled || permissionGranted === false
          )}
          {renderSettingItem(
            'Donation Reminders',
            'Get reminders about your donation schedule',
            'donationRemindersEnabled',
            'calendar-clock',
            !settings.pushNotificationsEnabled || permissionGranted === false
          )}
          {renderSettingItem(
            'System Announcements',
            'Important announcements from BloodLink',
            'systemAnnouncementsEnabled',
            'bullhorn',
            !settings.pushNotificationsEnabled || permissionGranted === false
          )}
        </View>
        
        {isDev && (
          <View style={styles.devSection}>
            <TouchableOpacity
              style={styles.testNotificationButton}
              onPress={goToTestScreen}
            >
              <Icon name="test-tube" size={20} color={colors.secondary} style={styles.testIcon} />
              <Text style={styles.testButtonText}>Test Notifications</Text>
            </TouchableOpacity>
            <Text style={styles.devNote}>
              This button is only visible in development mode
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={saveSettings}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Save Settings</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  backButton: {
    padding: 4,
    width: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  testButton: {
    padding: 4,
    width: 32,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  settingItemDisabled: {
    opacity: 0.7,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  settingTitleDisabled: {
    color: colors.textLight,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  settingDescriptionDisabled: {
    color: colors.disabled,
  },
  permissionWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.warning}20`,
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  permissionWarningText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: colors.text,
  },
  devSection: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  testNotificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  testIcon: {
    marginRight: 8,
  },
  testButtonText: {
    color: colors.secondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  devNote: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: `${colors.primary}80`,
  },
  saveButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotificationSettingsScreen; 
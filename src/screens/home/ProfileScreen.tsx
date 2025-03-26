import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { ProfileScreenProps } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { useProfileCompletionContext } from '../../context/ProfileCompletionContext';
import { userService } from '../../services';
import toast from '../../utils/toast';
import AlertModal from '../../components/AlertModal';
import NotificationBadge from '../../components/NotificationBadge';

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { logout } = useAuth();
  const { isProfileComplete, loading: profileLoading, checkProfileCompletion } = useProfileCompletionContext();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [user, setUser] = useState({
    name: '',
    phoneNumber: '',
    bloodType: ''  });
  const [loading, setLoading] = useState(true);

  // Fetch user profile data and check profile completion
  useEffect(() => {
    fetchUserProfile();
    checkProfileCompletion();
  }, []);

  // Update profile info when profile completion status changes
  useEffect(() => {
    if (!profileLoading && !isProfileComplete) {
      fetchUserProfile();
    }
  }, [isProfileComplete, profileLoading]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await userService.getProfile();
      setUser({
        name: profile.name || '',
        phoneNumber: profile.phoneNumber || '',
        bloodType: profile.bloodType || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToEditProfile = () => {
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.navigate('EditProfile');
    }
  };

  const navigateToAccountSettings = () => {
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.navigate('AccountSettings');
    }
  };

  const navigateToHistory = () => {
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.navigate('History');
    }
  };

  const handleLogout = async () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      // The logout function from AuthContext will handle everything:
      // - Clear token from AsyncStorage
      // - Show toast notification
      // - Navigate to Login screen
      await logout();
      // No need for manual navigation or toast here
    } catch (error) {
      console.error('Logout error:', error);
      // Error toast is already handled by the auth context
    } finally {
      setLogoutModalVisible(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
        <View style={styles.header}>
          <View style={styles.headerLeft} />
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerRight}>
            <NotificationBadge onPress={() => {
              const rootNavigation = navigation.getParent();
              if (rootNavigation) {
                rootNavigation.navigate('Notification');
              }
            }} />
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerRight}>
          <NotificationBadge onPress={() => {
            const rootNavigation = navigation.getParent();
            if (rootNavigation) {
              rootNavigation.navigate('Notification');
            }
          }} />
        </View>
      </View>

      <View style={styles.content}>
        {/* Profile Completion Status */}
        {!isProfileComplete && (
          <TouchableOpacity 
            style={styles.completionBanner}
            onPress={navigateToEditProfile}
          >
            <Icon name="alert-circle" size={24} color={colors.warning} />
            <Text style={styles.completionText}>
              Complete your profile to unlock all features
            </Text>
            <Icon name="chevron-right" size={24} color={colors.warning} />
          </TouchableOpacity>
        )}
        
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Image
            source={require('../../assets/images/avater.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <View style={styles.bloodTypeContainer}>
              <Text style={styles.userName}>{user.name || 'Complete your profile'}</Text>
              <View style={styles.bloodType}><Text style={styles.bloodTypeText}>{user.bloodType || '?'}</Text></View>
            </View>
            <Text style={styles.phoneNumber}>{user.phoneNumber || 'Add phone number'}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToAccountSettings}
          >
            <Icon name="cog-outline" size={24} color={colors.text} />
            <Text style={styles.menuText}>Account Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToHistory}
          >
            <Icon name="history" size={24} color={colors.text} />
            <Text style={styles.menuText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <Icon name="logout" size={24} color={colors.error} />
            <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AlertModal
        visible={logoutModalVisible}
        type="confirm"
        title="Logout"
        message="Are you sure you want to logout?"
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={confirmLogout}
        confirmText="Logout"
        cancelText="Cancel"
      />
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
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  completionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  completionText: {
    flex: 1,
    color: colors.warning,
    marginLeft: 12,
    fontWeight: '500',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent:'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent:'center',
    
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  bloodTypeContainer: {
    flexDirection:'row',
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    gap:5
  },
  bloodType: {
    backgroundColor: '#FFEBEE',
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',
    width:35,
  },
  bloodTypeText:{
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  editButton: {
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneNumber: {
    fontSize: 16,
    color: colors.textLight,
  },
  menuContainer: {
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuText: {
    marginLeft: 16,
    fontSize: 16,
    color: colors.text,
  },
  logoutText: {
    color: colors.error,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textLight,
  },
});

export default ProfileScreen; 
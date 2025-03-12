import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { ProfileScreenProps } from '../../navigation/types';

// Mock user data
const USER = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+880 1712345678',
  bloodType: 'A+',
  donationsCount: 5,
  lastDonation: '2023-02-15',
  profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const handleLogout = () => {
    // Navigate to Login screen using root navigation
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: USER.profileImage }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{USER.name}</Text>
              <View style={styles.bloodTypeContainer}>
                <Text style={styles.bloodType}>{USER.bloodType}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{USER.donationsCount}</Text>
              <Text style={styles.statLabel}>Donations</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Requests</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Lives Saved</Text>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoItem}>
            <Icon name="email" size={20} color={colors.primary} />
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{USER.email}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Icon name="phone" size={20} color={colors.primary} />
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{USER.phone}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Icon name="calendar" size={20} color={colors.primary} />
            <Text style={styles.infoLabel}>Last Donation</Text>
            <Text style={styles.infoValue}>{USER.lastDonation}</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="account-edit" size={20} color={colors.primary} />
            <Text style={styles.settingText}>Edit Profile</Text>
            <Icon name="chevron-right" size={20} color={colors.textLight} style={styles.settingArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="bell" size={20} color={colors.primary} />
            <Text style={styles.settingText}>Notifications</Text>
            <Icon name="chevron-right" size={20} color={colors.textLight} style={styles.settingArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="shield-check" size={20} color={colors.primary} />
            <Text style={styles.settingText}>Privacy & Security</Text>
            <Icon name="chevron-right" size={20} color={colors.textLight} style={styles.settingArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="help-circle" size={20} color={colors.primary} />
            <Text style={styles.settingText}>Help & Support</Text>
            <Icon name="chevron-right" size={20} color={colors.textLight} style={styles.settingArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <Icon name="logout" size={20} color={colors.error} />
            <Text style={[styles.settingText, { color: colors.error }]}>Logout</Text>
            <Icon name="chevron-right" size={20} color={colors.textLight} style={styles.settingArrow} />
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>BloodLink v1.0.0</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    padding: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profileInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  bloodTypeContainer: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  bloodType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: colors.border,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.text,
    width: 100,
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 14,
    color: colors.textLight,
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  settingArrow: {
    marginLeft: 'auto',
  },
  versionContainer: {
    padding: 16,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: colors.textLight,
  },
});

export default ProfileScreen; 
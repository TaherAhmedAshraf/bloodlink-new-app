import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { ProfileScreenProps } from '../../navigation/types';

// Mock user data
const USER = {
  name: 'Abdur Rahman',
  phone: '01771122388',
  bloodType: 'O+',
  profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.content}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
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

        <Text style={styles.phoneNumber}>{USER.phone}</Text>

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
        </View>
      </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  bloodTypeContainer: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  bloodType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
  phoneNumber: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 24,
    marginLeft: 66, // Align with the name (profileImage width + marginLeft)
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
    fontSize: 16,
    color: colors.text,
    marginLeft: 16,
  },
});

export default ProfileScreen; 
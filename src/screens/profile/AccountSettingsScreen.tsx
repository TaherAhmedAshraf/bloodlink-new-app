import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import toast from '../../utils/toast';

type AccountSettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AccountSettings'
>;

interface AccountSettingsScreenProps {
  navigation: AccountSettingsScreenNavigationProp;
}

const AccountSettingsScreen: React.FC<AccountSettingsScreenProps> = ({ navigation }) => {
  const navigateToEditProfile = () => {
    toast.info('Edit Profile', 'Update your personal information');
    navigation.navigate('EditProfile');
  };

  const navigateToDonationUpdate = () => {
    toast.info('Donation Update', 'Update your donation information');
    navigation.navigate('DonationUpdate');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        {/* Settings Options */}
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={navigateToEditProfile}
        >
          <View style={styles.iconContainer}>
            <Icon name="account-edit-outline" size={24} color={colors.text} />
          </View>
          <Text style={styles.settingText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={navigateToDonationUpdate}
        >
          <View style={styles.iconContainer}>
            <Icon name="water" size={24} color={colors.text} />
          </View>
          <Text style={styles.settingText}>Donation Update</Text>
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
  content: {
    flex: 1,
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconContainer: {
    width: 24,
    marginRight: 16,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
  },
});

export default AccountSettingsScreen; 
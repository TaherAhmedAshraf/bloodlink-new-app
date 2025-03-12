import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

type EditProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditProfile'
>;

interface EditProfileScreenProps {
  navigation: EditProfileScreenNavigationProp;
}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('Abdur Rahman');
  const [mobileNumber, setMobileNumber] = useState('+8801711223355');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [address, setAddress] = useState('Sony Square, Mirpur 1, Dhaka');
  const [showBloodGroupDropdown, setShowBloodGroupDropdown] = useState(false);

  const handleSave = () => {
    // Save profile data
    console.log('Profile data saved');
    navigation.goBack();
  };

  const toggleBloodGroupDropdown = () => {
    setShowBloodGroupDropdown(!showBloodGroupDropdown);
  };

  const selectBloodGroup = (group: string) => {
    setBloodGroup(group);
    setShowBloodGroupDropdown(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
        </View>

        {/* Mobile Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={mobileNumber}
            onChangeText={setMobileNumber}
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
          />
        </View>

        {/* Blood Group */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Blood Group</Text>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={toggleBloodGroupDropdown}
          >
            <Text style={styles.dropdownButtonText}>{bloodGroup}</Text>
            <Icon 
              name={showBloodGroupDropdown ? "chevron-up" : "chevron-down"} 
              size={24} 
              color={colors.text} 
            />
          </TouchableOpacity>

          {showBloodGroupDropdown && (
            <View style={styles.dropdownContainer}>
              {bloodGroups.map((group) => (
                <TouchableOpacity
                  key={group}
                  style={[
                    styles.dropdownItem,
                    bloodGroup === group && styles.selectedDropdownItem
                  ]}
                  onPress={() => selectBloodGroup(group)}
                >
                  <Text 
                    style={[
                      styles.dropdownItemText,
                      bloodGroup === group && styles.selectedDropdownItemText
                    ]}
                  >
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
            multiline
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
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
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  dropdownContainer: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.background,
    zIndex: 1,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedDropdownItem: {
    backgroundColor: 'rgba(198, 40, 40, 0.1)',
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedDropdownItemText: {
    color: colors.primary,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileScreen; 
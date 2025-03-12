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
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

type DonationUpdateScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DonationUpdate'
>;

interface DonationUpdateScreenProps {
  navigation: DonationUpdateScreenNavigationProp;
}

const genders = ['Male', 'Female', 'Other'];

const DonationUpdateScreen: React.FC<DonationUpdateScreenProps> = ({ navigation }) => {
  const [lastDonated, setLastDonated] = useState('02/05/2024');
  const [currentHemoglobin, setCurrentHemoglobin] = useState('11');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('26');
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    // Save donation data
    console.log('Donation data saved');
    navigation.goBack();
  };

  const toggleGenderDropdown = () => {
    setShowGenderDropdown(!showGenderDropdown);
  };

  const selectGender = (selectedGender: string) => {
    setGender(selectedGender);
    setShowGenderDropdown(false);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Donation Update</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Last Donated */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Last Donated</Text>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={toggleDatePicker}
          >
            <Text style={styles.dateInputText}>{lastDonated}</Text>
            <Icon name="calendar" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Current Hemoglobin */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Current Hemoglobin</Text>
          <TextInput
            style={styles.input}
            value={currentHemoglobin}
            onChangeText={setCurrentHemoglobin}
            placeholder="Enter hemoglobin level"
            keyboardType="numeric"
          />
        </View>

        {/* Gender */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Gender</Text>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={toggleGenderDropdown}
          >
            <Text style={styles.dropdownButtonText}>{gender}</Text>
            <Icon 
              name={showGenderDropdown ? "chevron-up" : "chevron-down"} 
              size={24} 
              color={colors.text} 
            />
          </TouchableOpacity>

          {showGenderDropdown && (
            <View style={styles.dropdownContainer}>
              {genders.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.dropdownItem,
                    gender === item && styles.selectedDropdownItem
                  ]}
                  onPress={() => selectGender(item)}
                >
                  <Text 
                    style={[
                      styles.dropdownItemText,
                      gender === item && styles.selectedDropdownItemText
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Age */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="Enter your age"
            keyboardType="numeric"
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

      {/* Date Picker Modal (simplified) */}
      {showDatePicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDatePicker}
          onRequestClose={toggleDatePicker}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={toggleDatePicker}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Date</Text>
                <TouchableOpacity onPress={toggleDatePicker}>
                  <Icon name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              <View style={styles.datePickerPlaceholder}>
                <Text style={styles.datePickerText}>
                  Date picker would be implemented here
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
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
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateInputText: {
    fontSize: 16,
    color: colors.text,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  datePickerPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 20,
  },
  datePickerText: {
    fontSize: 16,
    color: colors.textLight,
  },
});

export default DonationUpdateScreen; 
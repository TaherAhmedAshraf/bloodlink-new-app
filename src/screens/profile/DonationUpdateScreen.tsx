import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import toast from '../../utils/toast';
import { userService, UserProfile } from '../../services';
import { format, parseISO } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

type DonationUpdateScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DonationUpdate'
>;

interface DonationUpdateScreenProps {
  navigation: DonationUpdateScreenNavigationProp;
}

const genders = ['Male', 'Female', 'Other'];

const DonationUpdateScreen: React.FC<DonationUpdateScreenProps> = ({ navigation }) => {
  const [lastDonated, setLastDonated] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentHemoglobin, setCurrentHemoglobin] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setFetchingProfile(true);
      const profile = await userService.getProfile();
      
      // Format date to display in MM/DD/YYYY
      if (profile.lastDonation) {
        try {
          const date = parseISO(profile.lastDonation);
          setLastDonated(format(date, 'MM/dd/yyyy'));
          setSelectedDate(date);
        } catch (e) {
          setLastDonated(profile.lastDonation);
          setSelectedDate(new Date());
        }
      }
      
      setCurrentHemoglobin(profile.hemoglobin?.toString() || '');
      setGender(profile.gender || '');
      setAge(profile.age?.toString() || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to Load Profile', 'Please try again later');
    } finally {
      setFetchingProfile(false);
    }
  };

  const handleSave = async () => {
    // Validate inputs
    if (!lastDonated.trim()) {
      toast.error('Last Donation Date Required', 'Please enter your last donation date');
      return;
    }
    
    if (!currentHemoglobin.trim()) {
      toast.error('Hemoglobin Required', 'Please enter your current hemoglobin level');
      return;
    }
    
    if (!gender) {
      toast.error('Gender Required', 'Please select your gender');
      return;
    }
    
    if (!age.trim()) {
      toast.error('Age Required', 'Please enter your age');
      return;
    }
    
    const hemoglobinValue = parseFloat(currentHemoglobin);
    if (isNaN(hemoglobinValue) || hemoglobinValue <= 0) {
      toast.error('Invalid Hemoglobin', 'Please enter a valid hemoglobin level');
      return;
    }
    
    const ageValue = parseInt(age, 10);
    if (isNaN(ageValue) || ageValue < 18 || ageValue > 65) {
      toast.error('Invalid Age', 'Age must be between 18 and 65');
      return;
    }
    
    // Save donation data
    try {
      setLoading(true);
      
      // Format the date as ISO string for the API
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      const response = await userService.updateDonationInfo({
        lastDonated: formattedDate,
        currentHemoglobin: hemoglobinValue,
        gender,
        age: ageValue
      });
      
      toast.success('Donation Info Updated', response.message || 'Your donation information has been updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating donation info:', error);
      toast.error('Update Failed', 'Failed to update donation information. Please try again.');
    } finally {
      setLoading(false);
    }
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
  
  const onDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (date) {
      setSelectedDate(date);
      setLastDonated(format(date, 'MM/dd/yyyy'));
    }
  };
  
  const confirmIOSDate = () => {
    setLastDonated(format(selectedDate, 'MM/dd/yyyy'));
    setShowDatePicker(false);
  };
  
  const cancelIOSDate = () => {
    setShowDatePicker(false);
  };

  if (fetchingProfile) {
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
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading donation information...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.dateInputText}>
              {lastDonated || 'Select date'}
            </Text>
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
            <Text style={styles.dropdownButtonText}>{gender || 'Select Gender'}</Text>
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
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.secondary} />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Date Picker Implementation */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
      
      {Platform.OS === 'ios' && showDatePicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDatePicker}
          onRequestClose={toggleDatePicker}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={cancelIOSDate}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={cancelIOSDate}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Date</Text>
                <TouchableOpacity onPress={confirmIOSDate}>
                  <Text style={styles.modalDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  style={styles.datePicker}
                />
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
  modalCancelText: {
    fontSize: 16,
    color: colors.textLight,
  },
  modalDoneText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  datePickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  datePicker: {
    width: '100%',
    height: 200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 10,
  },
});

export default DonationUpdateScreen; 
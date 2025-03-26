import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { CreateRequestScreenProps } from '../../navigation/types';
import { bloodRequestService, CreateBloodRequestRequest } from '../../services';
import toast from '../../utils/toast';
import AlertModal from '../../components/AlertModal';
import { useProfileCompletionContext } from '../../context/ProfileCompletionContext';
import zones from '../../constants/zones';

// Define blood types
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

// Define zones - replaced with import from constants
// const zones = [
//   'Mirpur',
//   'Dhanmondi',
//   'Gulshan',
//   'Uttara',
//   'Mohammadpur',
//   'Banani',
//   'Bashundhara',
//   'Khilgaon',
// ];

// Define genders
const genders = ['Male', 'Female', 'Other'];

// Define hours for 24-hour clock
const hours = Array.from({ length: 24 }, (_, i) => i);

// Define minutes
const minutes = ['00', '15', '30', '45'];

// Define AM/PM hours for display
const amHours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const pmHours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

// Define step types
type Step = 'primary' | 'donation' | 'others';

// Define picker types
type PickerType = 'zone' | 'date' | 'time' | 'gender' | null;

// Define time picker mode
type TimePickerMode = 'hour' | 'minute';

// Define time period
type TimePeriod = 'AM' | 'PM';

const CreateRequestScreen: React.FC<CreateRequestScreenProps> = ({ navigation }) => {
  // Current step state
  const [currentStep, setCurrentStep] = useState<Step>('primary');
  
  // Profile completion context
  const { isProfileComplete, loading: profileLoading, checkProfileCompletion } = useProfileCompletionContext();
  
  // Check if profile is complete
  useEffect(() => {
    checkProfileCompletion();
  }, []);

  // Redirect to EditProfile if profile is incomplete
  useEffect(() => {
    if (!profileLoading && !isProfileComplete) {
      toast.warning('Profile Incomplete', 'Please complete your profile before creating a blood request');
      
      // Navigate to EditProfile using the parent navigator
      const rootNavigation = navigation.getParent();
      if (rootNavigation) {
        rootNavigation.navigate('EditProfile');
      } else {
        // Fallback direct navigation if parent navigator is not available
        navigation.navigate('EditProfile');
      }
    }
  }, [isProfileComplete, profileLoading, navigation]);
  
  // Form data state
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [hemoglobinPoint, setHemoglobinPoint] = useState('');
  const [amountOfBlood, setAmountOfBlood] = useState('');
  const [patientProblem, setPatientProblem] = useState('');
  
  const [selectedZone, setSelectedZone] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const [patientGender, setPatientGender] = useState('');
  const [relationship, setRelationship] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<PickerType>(null);

  // Time picker state
  const [timePickerMode, setTimePickerMode] = useState<TimePickerMode>('hour');
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('AM');

  // API integration state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Confirmation modal state
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  // Handle step navigation
  const goToNextStep = () => {
    if (currentStep === 'primary') {
      setCurrentStep('donation');
    } else if (currentStep === 'donation') {
      setCurrentStep('others');
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === 'donation') {
      setCurrentStep('primary');
    } else if (currentStep === 'others') {
      setCurrentStep('donation');
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    if (!selectedBloodType || !hemoglobinPoint || !amountOfBlood || !patientProblem ||
        !selectedZone || !hospitalName || !mobileNumber || !selectedDate || !selectedTime) {
      setError('Please fill in all required fields');
      toast.error('Missing Information', 'Please fill in all required fields');
      return;
    }

    // Show confirmation modal
    setConfirmModalVisible(true);
  };

  const confirmSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const request: CreateBloodRequestRequest = {
        bloodType: selectedBloodType,
        hospital: hospitalName,
        location: selectedZone,
        hemoglobinPoint,
        patientProblem,
        bagNeeded: amountOfBlood,
        zone: selectedZone,
        date: selectedDate,
        time: selectedTime,
        additionalInfo: additionalInfo || '',
      };

      const response = await bloodRequestService.createBloodRequest(request);
      
      toast.success('Request Created', 'Your blood request has been created successfully');
      setConfirmModalVisible(false);
      navigation.navigate('Home');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      toast.error('Request Failed', 'Failed to create blood request. Please try again.');
    } finally {
      setIsLoading(false);
      setConfirmModalVisible(false);
    }
  };

  // Open picker modal
  const openPicker = (pickerType: PickerType) => {
    setCurrentPicker(pickerType);
    
    if (pickerType === 'time') {
      // Reset time picker state
      setTimePickerMode('hour');
      setSelectedHour(null);
      setSelectedMinute(null);
    }
    
    setModalVisible(true);
  };

  // Handle picker selection
  const handlePickerSelect = (value: string) => {
    switch (currentPicker) {
      case 'zone':
        setSelectedZone(value);
        break;
      case 'date':
        setSelectedDate(value);
        break;
      case 'gender':
        setPatientGender(value);
        break;
    }
    setModalVisible(false);
  };

  // Handle time selection
  const handleHourSelect = (hour: number, period: TimePeriod) => {
    // Convert to 24-hour format internally
    let hour24 = hour;
    if (period === 'PM' && hour !== 12) {
      hour24 = hour + 12;
    } else if (period === 'AM' && hour === 12) {
      hour24 = 0;
    }
    
    setSelectedHour(hour24);
    setTimePeriod(period);
    setTimePickerMode('minute');
  };

  const handleMinuteSelect = (minute: string) => {
    if (selectedHour !== null) {
      // Format for display (12-hour format with AM/PM)
      let displayHour = selectedHour;
      if (displayHour > 12) {
        displayHour -= 12;
      } else if (displayHour === 0) {
        displayHour = 12;
      }
      
      setSelectedTime(`${displayHour}:${minute} ${timePeriod}`);
      setModalVisible(false);
    }
  };

  // Generate dates for the next 30 days in "1 January 2025" format
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      
      dates.push(formattedDate);
    }
    
    console.log('Generated dates:', dates);
    return dates;
  };

  // Render time picker
  const renderTimePicker = () => {
    if (timePickerMode === 'hour') {
      return (
        <View style={styles.clockContainer}>
          <Text style={styles.clockTitle}>Select Hour</Text>
          
          <View style={styles.periodSelector}>
            <TouchableOpacity 
              style={[
                styles.periodButton,
                timePeriod === 'AM' && styles.selectedPeriodButton
              ]}
              onPress={() => setTimePeriod('AM')}
            >
              <Text style={[
                styles.periodText,
                timePeriod === 'AM' && styles.selectedPeriodText
              ]}>AM</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.periodButton,
                timePeriod === 'PM' && styles.selectedPeriodButton
              ]}
              onPress={() => setTimePeriod('PM')}
            >
              <Text style={[
                styles.periodText,
                timePeriod === 'PM' && styles.selectedPeriodText
              ]}>PM</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.clockFace}>
            <View style={styles.clockCenter} />
            <View style={styles.clockInnerCircle} />
            
            {/* Display 12-hour clock based on selected period */}
            {(timePeriod === 'AM' ? amHours : pmHours).map((hour, index) => {
              // Calculate position on the clock face
              const angle = (index / 12) * 2 * Math.PI - Math.PI / 2;
              const radius = 80;
              const left = radius * Math.cos(angle) + 100;
              const top = radius * Math.sin(angle) + 100;
              
              // Convert to 24-hour format for comparison
              let hour24 = hour;
              if (timePeriod === 'PM' && hour !== 12) {
                hour24 = hour + 12;
              } else if (timePeriod === 'AM' && hour === 12) {
                hour24 = 0;
              }
              
              return (
                <TouchableOpacity
                  key={hour}
                  style={[
                    styles.hourMarker,
                    { left, top },
                    selectedHour === hour24 && styles.selectedTimeMarker,
                  ]}
                  onPress={() => handleHourSelect(hour, timePeriod)}
                >
                  <Text 
                    style={[
                      styles.hourText,
                      selectedHour === hour24 && styles.selectedTimeText,
                    ]}
                  >
                    {hour}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.clockContainer}>
          <Text style={styles.clockTitle}>
            Select Minutes for {selectedHour !== null ? (
              selectedHour > 12 ? 
                `${selectedHour - 12}:00 ${timePeriod}` : 
                selectedHour === 0 ? 
                  `12:00 ${timePeriod}` : 
                  `${selectedHour}:00 ${timePeriod}`
            ) : ''}
          </Text>
          
          <View style={styles.clockFace}>
            <View style={styles.clockCenter} />
            {minutes.map((minute, index) => {
              // Calculate position on the clock face
              const angle = (index / minutes.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 80;
              const left = radius * Math.cos(angle) + 100;
              const top = radius * Math.sin(angle) + 100;
              
              return (
                <TouchableOpacity
                  key={minute}
                  style={[
                    styles.minuteMarker,
                    { left, top },
                    selectedMinute === minute && styles.selectedTimeMarker,
                  ]}
                  onPress={() => handleMinuteSelect(minute)}
                >
                  <Text 
                    style={[
                      styles.minuteText,
                      selectedMinute === minute && styles.selectedTimeText,
                    ]}
                  >
                    {minute}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity 
            style={styles.backToHourButton}
            onPress={() => setTimePickerMode('hour')}
          >
            <Text style={styles.backToHourText}>Back to Hour</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  // Render picker modal
  const renderPickerModal = () => {
    let data: (string | { label: string, value: string })[] = [];
    let title = '';
    let selectedValue = '';

    switch (currentPicker) {
      case 'zone':
        data = zones;
        title = 'Select Zone';
        selectedValue = selectedZone;
        break;
      case 'date':
        data = generateDates();
        title = 'Select Date';
        selectedValue = selectedDate;
        break;
      case 'gender':
        data = genders;
        title = 'Select Gender';
        selectedValue = patientGender;
        break;
    }

    if (currentPicker === 'time') {
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Time</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Icon name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              {renderTimePicker()}
            </View>
          </View>
        </Modal>
      );
    }

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            {currentPicker === 'zone' && (
              <ScrollView style={styles.pickerScrollContainer}>
                <View style={styles.pickerOptionsContainer}>
                  {data.map((item) => (
                    <TouchableOpacity
                      key={typeof item === 'string' ? item : item.value}
                      style={[
                        styles.pickerListItem,
                        (typeof item === 'string' ? selectedValue === item : selectedValue === item.value) && 
                        styles.selectedPickerListItem
                      ]}
                      onPress={() => handlePickerSelect(typeof item === 'string' ? item : item.value)}
                    >
                      <Text
                        style={[
                          styles.pickerListItemText,
                          (typeof item === 'string' ? selectedValue === item : selectedValue === item.value) && 
                          styles.selectedPickerListItemText
                        ]}
                      >
                        {typeof item === 'string' ? item : item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}

            {currentPicker === 'date' && (
              <ScrollView style={styles.pickerScrollContainer}>
                <View style={styles.pickerOptionsContainer}>
                  {data.map((item) => (
                    <TouchableOpacity
                      key={typeof item === 'string' ? item : item.value}
                      style={[
                        styles.pickerListItem,
                        (typeof item === 'string' ? selectedValue === item : selectedValue === item.value) && 
                        styles.selectedPickerListItem
                      ]}
                      onPress={() => handlePickerSelect(typeof item === 'string' ? item : item.value)}
                    >
                      <Text
                        style={[
                          styles.pickerListItemText,
                          (typeof item === 'string' ? selectedValue === item : selectedValue === item.value) && 
                          styles.selectedPickerListItemText
                        ]}
                      >
                        {typeof item === 'string' ? item : item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}

            {currentPicker === 'gender' && (
              <ScrollView style={styles.pickerScrollContainer}>
                <View style={styles.pickerOptionsContainer}>
                  {data.map((item) => (
                    <TouchableOpacity
                      key={typeof item === 'string' ? item : item.value}
                      style={[
                        styles.pickerListItem,
                        (typeof item === 'string' ? selectedValue === item : selectedValue === item.value) && 
                        styles.selectedPickerListItem
                      ]}
                      onPress={() => handlePickerSelect(typeof item === 'string' ? item : item.value)}
                    >
                      <Text
                        style={[
                          styles.pickerListItemText,
                          (typeof item === 'string' ? selectedValue === item : selectedValue === item.value) && 
                          styles.selectedPickerListItemText
                        ]}
                      >
                        {typeof item === 'string' ? item : item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  // Render step indicator
  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicatorContainer}>
        <Text style={styles.stepText}>
          Steps {currentStep === 'primary' ? '1' : currentStep === 'donation' ? '2' : '3'} of 3
        </Text>
        <View style={styles.stepProgressContainer}>
          <View style={[styles.stepProgress, styles.stepProgressActive]} />
          <View 
            style={[
              styles.stepProgress, 
              (currentStep === 'donation' || currentStep === 'others') ? styles.stepProgressActive : {}
            ]} 
          />
          <View 
            style={[
              styles.stepProgress, 
              currentStep === 'others' ? styles.stepProgressActive : {}
            ]} 
          />
        </View>
      </View>
    );
  };

  // Render primary information step
  const renderPrimaryInformation = () => {
    return (
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Primary Information</Text>
        
        <Text style={styles.label}>Select Blood Group</Text>
        <View style={styles.bloodTypeContainer}>
          {bloodTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.bloodTypeButton,
                selectedBloodType === type && styles.selectedBloodType,
              ]}
              onPress={() => setSelectedBloodType(type)}
            >
              <Text
                style={[
                  styles.bloodTypeText,
                  selectedBloodType === type && styles.selectedBloodTypeText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Hemoglobin Point</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 13.5"
          value={hemoglobinPoint}
          onChangeText={setHemoglobinPoint}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Amount of Blood</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 1 bag"
          value={amountOfBlood}
          onChangeText={setAmountOfBlood}
        />

        <Text style={styles.label}>Patient Problem</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g Kidney dialysis"
          value={patientProblem}
          onChangeText={setPatientProblem}
        />

        <TouchableOpacity style={styles.continueButton} onPress={goToNextStep}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render donation information step
  const renderDonationInformation = () => {
    return (
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Donation Information</Text>
        
        <Text style={styles.label}>Select Zone *</Text>
        <TouchableOpacity 
          style={styles.dropdownInput}
          onPress={() => openPicker('zone')}
        >
          <Text style={[
            styles.dropdownPlaceholder,
            selectedZone ? styles.dropdownValue : {}
          ]}>
            {selectedZone || 'e.g Lab Aid Hospital'}
          </Text>
          <Icon name="chevron-down" size={24} color={colors.textLight} />
        </TouchableOpacity>

        <Text style={styles.label}>Hospital Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g Lab Aid Hospital"
          value={hospitalName}
          onChangeText={setHospitalName}
        />

        <Text style={styles.label}>Mobile Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g 01811777555666"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Select Date</Text>
        <TouchableOpacity 
          style={styles.dropdownInput}
          onPress={() => openPicker('date')}
        >
          <Text style={[
            styles.dropdownPlaceholder,
            selectedDate ? styles.dropdownValue : {}
          ]}>
            {selectedDate || 'Select'}
          </Text>
          <Icon name="chevron-down" size={24} color={colors.textLight} />
        </TouchableOpacity>

        <Text style={styles.label}>Select Time</Text>
        <TouchableOpacity 
          style={styles.dropdownInput}
          onPress={() => openPicker('time')}
        >
          <Text style={[
            styles.dropdownPlaceholder,
            selectedTime ? styles.dropdownValue : {}
          ]}>
            {selectedTime || 'Select'}
          </Text>
          <Icon name="chevron-down" size={24} color={colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueButton} onPress={goToNextStep}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render others information step
  const renderOthersInformation = () => {
    return (
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Others Information</Text>
        
        <Text style={styles.label}>Patient Gender</Text>
        <TouchableOpacity 
          style={styles.dropdownInput}
          onPress={() => openPicker('gender')}
        >
          <Text style={[
            styles.dropdownPlaceholder,
            patientGender ? styles.dropdownValue : {}
          ]}>
            {patientGender || 'Select'}
          </Text>
          <Icon name="chevron-down" size={24} color={colors.textLight} />
        </TouchableOpacity>

        <Text style={styles.label}>Your Relationship With Patient</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g Father"
          value={relationship}
          onChangeText={setRelationship}
        />

        <Text style={styles.label}>Anything Specific</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Message"
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={currentStep === 'primary' ? () => navigation.goBack() : goToPreviousStep} 
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Blood Request</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {currentStep === 'primary' && renderPrimaryInformation()}
          {currentStep === 'donation' && renderDonationInformation()}
          {currentStep === 'others' && renderOthersInformation()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Picker Modal */}
      {renderPickerModal()}

      {/* Loading and Error Messages */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{error || 'Submitting request...'}</Text>
        </View>
      )}

      {/* Confirmation Modal */}
      <AlertModal
        visible={confirmModalVisible}
        type="confirm"
        title="Confirm Submission"
        message="Are you sure you want to submit this blood request? This will be visible to potential donors."
        onClose={() => setConfirmModalVisible(false)}
        onConfirm={confirmSubmit}
        confirmText="Submit"
        cancelText="Cancel"
        loading={isLoading}
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
  stepIndicatorContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  stepProgressContainer: {
    flexDirection: 'row',
    height: 4,
  },
  stepProgress: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    marginHorizontal: 2,
  },
  stepProgressActive: {
    backgroundColor: colors.primary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  formSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: colors.secondary,
  },
  dropdownInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: colors.textLight,
  },
  dropdownValue: {
    color: colors.text,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  bloodTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bloodTypeButton: {
    width: '22%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedBloodType: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  bloodTypeText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedBloodTypeText: {
    color: colors.secondary,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  continueButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  pickerOptionsContainer: {
    marginTop: 0,
    paddingBottom: 20,
  },
  pickerScrollContainer: {
    maxHeight: 350,
  },
  pickerListItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedPickerListItem: {
    backgroundColor: 'rgba(198, 40, 40, 0.1)',
  },
  pickerListItemText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedPickerListItemText: {
    color: colors.primary,
    fontWeight: '500',
  },
  selectedPickerOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pickerOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedPickerOptionText: {
    color: colors.secondary,
    fontWeight: '600',
  },
  clockContainer: {
    padding: 16,
    alignItems: 'center',
  },
  clockTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: colors.background,
  },
  selectedPeriodButton: {
    backgroundColor: colors.primary,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedPeriodText: {
    color: colors.secondary,
  },
  clockFace: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    marginBottom: 20,
  },
  clockInnerCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    top: '50%',
    left: '50%',
    marginLeft: -75,
    marginTop: -75,
  },
  clockCenter: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    top: '50%',
    left: '50%',
    marginLeft: -4,
    marginTop: -4,
  },
  hourMarker: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -15,
    marginTop: -15,
  },
  minuteMarker: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -15,
    marginTop: -15,
  },
  selectedTimeMarker: {
    backgroundColor: colors.primary,
  },
  hourText: {
    fontSize: 14,
    color: colors.text,
  },
  minuteText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedTimeText: {
    color: colors.secondary,
    fontWeight: '600',
  },
  backToHourButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  backToHourText: {
    color: colors.text,
    fontSize: 14,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
});

export default CreateRequestScreen; 
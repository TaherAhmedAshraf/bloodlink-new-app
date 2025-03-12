import React, { useState } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { CreateRequestScreenProps } from '../../navigation/types';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const CreateRequestScreen: React.FC<CreateRequestScreenProps> = ({ navigation }) => {
  const [hospital, setHospital] = useState('');
  const [location, setLocation] = useState('');
  const [patientName, setPatientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    // Validate form
    if (!hospital || !location || !patientName || !contactNumber || !selectedBloodType) {
      // Show error
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Navigate back to home screen
      navigation.navigate('Home');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Blood Request</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Hospital Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter hospital name"
              value={hospital}
              onChangeText={setHospital}
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter hospital location"
              value={location}
              onChangeText={setLocation}
            />

            <Text style={styles.label}>Patient Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter patient name"
              value={patientName}
              onChangeText={setPatientName}
            />

            <Text style={styles.label}>Contact Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter contact number"
              keyboardType="phone-pad"
              value={contactNumber}
              onChangeText={setContactNumber}
            />

            <Text style={styles.label}>Blood Type</Text>
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

            <Text style={styles.label}>Additional Information</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter additional information"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
            />

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.submitButtonText}>Creating...</Text>
              ) : (
                <Text style={styles.submitButtonText}>Create Request</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
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
    fontSize: 16,
    backgroundColor: colors.secondary,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  bloodTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  bloodTypeButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
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
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  submitButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateRequestScreen; 
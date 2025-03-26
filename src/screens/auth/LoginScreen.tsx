import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Button from '../../components/Button';
import colors from '../../theme/colors';
import { LoginScreenProps } from '../../navigation/types';
import { authService } from '../../services';
import toast from '../../utils/toast';

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) {
      toast.error('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      // Format phone number with country code if not already included
      const formattedPhoneNumber = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+880${phoneNumber}`;
      
      // Call the API to send OTP
      const response = await authService.sendOtp(formattedPhoneNumber);
      
      // Navigate to OTP screen with phone number and request ID
      navigation.navigate('OTPScreen', { 
        phoneNumber: formattedPhoneNumber,
        requestId: response.requestId
      });
    } catch (error) {
      console.error('Failed to send OTP:', error);
      toast.error('Failed to Send OTP', 'Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Hello,</Text>
          <Text style={styles.subHeaderText}>Sign In</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Mobile</Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+880</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={10}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Send OTP"
            onPress={handleSendOTP}
            loading={loading}
            style={[styles.button]}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    width: '100%',
    height:'40%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  subHeaderText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.secondary,
    marginTop: 8,
  },
  formContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  countryCode: {
    backgroundColor: colors.background,
    paddingLeft: 12,
    paddingVertical: 14,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  button: {
    marginTop: 20,
  },
  buttonContainer: {
    alignSelf: 'center', 
    backgroundColor:colors.background, 
    padding: 20, 
    width: '100%' 
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
    color: colors.textLight,
  },
  signupLink: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default LoginScreen; 
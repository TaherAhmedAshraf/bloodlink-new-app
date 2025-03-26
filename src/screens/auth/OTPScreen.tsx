import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Button from '../../components/Button';
import colors from '../../theme/colors';
import { OTPScreenProps } from '../../navigation/types';
import { authService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import toast from '../../utils/toast';

const OTPScreen: React.FC<OTPScreenProps> = ({ navigation, route }) => {
  const { phoneNumber, requestId } = route.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const { login } = useAuth();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 4) {
      toast.error('Please enter a valid 4-digit OTP');
      return;
    }

    try {
      setLoading(true);
      // Call the API to verify OTP
      const response = await authService.verifyOtp(phoneNumber, otpValue, requestId);
      
      // Use the login function from AuthContext
      if (response.token) {
        await login(response.token);
        // Navigate to Main screen on successful verification
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      // Call the API to resend OTP
      const response = await authService.sendOtp(phoneNumber);
      
      // Instead of modifying route.params, navigate to the same screen with new params
      if (response.requestId) {
        navigation.replace('OTPScreen', {
          phoneNumber,
          requestId: response.requestId
        });
      }
      
      // Reset timer
      setTimer(30);
      
      toast.success('OTP has been resent to your phone number');
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      toast.error('Failed to resend OTP. Please try again.');
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
          <Text style={styles.headerText}>Enter your</Text>
          <Text style={styles.subHeaderText}>OTP Here!</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.otpContainer}>
            {[0, 1, 2, 3].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={otp[index]}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
          </View>

          <Button
            title="Sign In"
            onPress={handleVerifyOTP}
            loading={loading}
            style={styles.button}
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            {timer > 0 ? (
              <Text style={styles.timerText}>{`Resend in ${timer}s`}</Text>
            ) : (
              <TouchableOpacity onPress={handleResendOTP}>
                <Text style={styles.resendLink}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>
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
    height:'40%',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  subHeaderText: {
    fontSize: 28,
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 16,
    color: colors.textLight,
  },
  resendLink: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 16,
    color: colors.textLight,
    fontWeight: '500',
  },
});

export default OTPScreen; 
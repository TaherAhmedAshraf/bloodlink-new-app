/**
 * BloodLink App
 * A blood donation app connecting donors with those in need
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './src/navigation/types';
import 'react-native-gesture-handler';

// Import screens
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/onboarding/OnboardingScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import OTPScreen from './src/screens/auth/OTPScreen';
import TabNavigator from './src/navigation/TabNavigator';
import RequestDetailScreen from './src/screens/home/RequestDetailScreen';
import ChatHistoryScreen from './src/screens/home/ChatHistoryScreen';
import BloodBankDetailScreen from './src/screens/home/bloodbank/BloodBankDetailScreen';
import NotificationScreen from './src/screens/home/NotificationScreen';
import AccountSettingsScreen from './src/screens/profile/AccountSettingsScreen';
import EditProfileScreen from './src/screens/profile/EditProfileScreen';
import DonationUpdateScreen from './src/screens/profile/DonationUpdateScreen';
import HistoryScreen from './src/screens/profile/HistoryScreen';

// Create stack navigator
const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="OTPScreen" component={OTPScreen} />
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
          <Stack.Screen name="ChatHistory" component={ChatHistoryScreen} />
          <Stack.Screen name="BloodBankDetail" component={BloodBankDetailScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="DonationUpdate" component={DonationUpdateScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;

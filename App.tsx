/**
 * BloodLink App
 * A blood donation app connecting donors with those in need
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from './src/navigation/types';
import 'react-native-gesture-handler';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { SessionExpiredHandler } from './src/context/SessionExpiredHandler';
import { ProfileCompletionProvider } from './src/context/ProfileCompletionContext';
import colors from './src/theme/colors';
import Toast from 'react-native-toast-message';
import { navigationRef } from './src/navigation/navigationRef';
import { setupPushNotifications } from './src/utils/notificationHandler';
import NotificationPermissionHandler from './src/components/NotificationPermissionHandler';
import SplashScreenWrapper from './src/components/SplashScreen';

// Import screens
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/onboarding/OnboardingScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import OTPScreen from './src/screens/auth/OTPScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import RequestDetailScreen from './src/screens/home/RequestDetailScreen';
import CreateRequestScreen from './src/screens/home/CreateRequestScreen';
import ChatScreen from './src/screens/home/ChatScreen';
import ChatHistoryScreen from './src/screens/home/ChatHistoryScreen';
import BloodBankScreen from './src/screens/home/bloodbank/index';
import ProfileScreen from './src/screens/home/ProfileScreen';
import NotificationScreen from './src/screens/notification/NotificationScreen';
import AccountSettingsScreen from './src/screens/profile/AccountSettingsScreen';
import EditProfileScreen from './src/screens/profile/EditProfileScreen';
import DonationUpdateScreen from './src/screens/profile/DonationUpdateScreen';
import HistoryScreen from './src/screens/profile/HistoryScreen';
import OngoingRequestDetailScreen from './src/screens/home/OngoingRequestDetailScreen';
import BloodBankDetailScreen from './src/screens/home/bloodbank/BloodBankDetailScreen';
// Import notification screens
import { NotificationSettingsScreen } from './src/screens/notification';
import NotificationTestScreen from './src/screens/notification/NotificationTestScreen';

// Create stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Toast configuration
const toastConfig = {
  success: ({ text1, text2, ...rest }: any) => (
    <View
      style={{
        height: 60,
        width: '90%',
        backgroundColor: colors.success,
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Icon name="check-circle" size={24} color="white" />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>
          {text1}
        </Text>
        {text2 && (
          <Text style={{ fontSize: 12, color: 'white', marginTop: 2 }}>
            {text2}
          </Text>
        )}
      </View>
    </View>
  ),
  error: ({ text1, text2, ...rest }: any) => (
    <View
      style={{
        height: 60,
        width: '90%',
        backgroundColor: colors.error,
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Icon name="alert-circle" size={24} color="white" />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>
          {text1}
        </Text>
        {text2 && (
          <Text style={{ fontSize: 12, color: 'white', marginTop: 2 }}>
            {text2}
          </Text>
        )}
      </View>
    </View>
  ),
  info: ({ text1, text2, ...rest }: any) => (
    <View
      style={{
        height: 60,
        width: '90%',
        backgroundColor: colors.info,
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Icon name="information" size={24} color="white" />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>
          {text1}
        </Text>
        {text2 && (
          <Text style={{ fontSize: 12, color: 'white', marginTop: 2 }}>
            {text2}
          </Text>
        )}
      </View>
    </View>
  ),
  warning: ({ text1, text2, ...rest }: any) => (
    <View
      style={{
        height: 60,
        width: '90%',
        backgroundColor: colors.warning,
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Icon name="alert" size={24} color="white" />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>
          {text1}
        </Text>
        {text2 && (
          <Text style={{ fontSize: 12, color: 'white', marginTop: 2 }}>
            {text2}
          </Text>
        )}
      </View>
    </View>
  ),
};

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home-variant' : 'home-variant-outline';
          } else if (route.name === 'AI Chat') {
            iconName = focused ? 'robot-happy' : 'robot-happy-outline';
          } else if (route.name === 'Blood Banks') {
            iconName = focused ? 'bank-plus' : 'bank-plus';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'water-plus' : 'water-plus-outline';
          }

          return <Icon name={iconName || 'help'} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Create" component={CreateRequestScreen} />
      <Tab.Screen 
        name="AI Chat" 
        component={ChatScreen as any}
      />
      <Tab.Screen name="Blood Banks" component={BloodBankScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main app content with notifications
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [showPermissionPrompt, setShowPermissionPrompt] = useState<boolean>(false);
  const [notificationsInitialized, setNotificationsInitialized] = useState<boolean>(false);

  // Initialize push notifications
  useEffect(() => {
    // Set up notifications when the app starts and user is authenticated
    let cleanup: (() => void) | undefined;
    
    if (isAuthenticated && !notificationsInitialized) {
      setShowPermissionPrompt(true);
    }
    
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [isAuthenticated, notificationsInitialized]);

  const handlePermissionGranted = async () => {
    try {
      const cleanup = await setupPushNotifications();
      setNotificationsInitialized(true);
      return cleanup;
    } catch (error) {
      console.error('Failed to set up notifications:', error);
      return undefined;
    }
  };

  return (
    <>
      <SessionExpiredHandler>
        <ProfileCompletionProvider>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OTPScreen" component={OTPScreen} />
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
            <Stack.Screen name="CreateRequestStep1" component={CreateRequestScreen} />
            <Stack.Screen name="Notification" component={NotificationScreen} />
            <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
            <Stack.Screen name="NotificationTest" component={NotificationTestScreen} />
            <Stack.Screen name="ChatHistory" component={ChatHistoryScreen} />
            <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="DonationUpdate" component={DonationUpdateScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="OngoingRequestDetail" component={OngoingRequestDetailScreen} />
            <Stack.Screen name="BloodBankDetail" component={BloodBankDetailScreen} />
          </Stack.Navigator>
        </ProfileCompletionProvider>
      </SessionExpiredHandler>
      
      {showPermissionPrompt && isAuthenticated && (
        <NotificationPermissionHandler 
          onPermissionGranted={handlePermissionGranted}
        />
      )}
    </>
  );
};

function App(): React.JSX.Element {
  // Setup push notifications on app start
  useEffect(() => {
    setupPushNotifications();
  }, []);

  return (
    <SplashScreenWrapper>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer ref={navigationRef}>
            <AppContent />
          </NavigationContainer>
        </AuthProvider>
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </SplashScreenWrapper>
  );
}

export default App;

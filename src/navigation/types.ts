import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Define the blood request type
export interface BloodRequest {
  id: string;
  hospital: string;
  location: string;
  bloodType: string;
  date: string;
  time: string;
  daysAgo: number;
}

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  OTPScreen: { phoneNumber: string };
  Main: undefined;
  Register: undefined;
  RequestDetail: { request: BloodRequest };
  ChatHistory: undefined;
  CreateRequestStep1: undefined;
  CreateRequestStep2: undefined;
  CreateRequestStep3: undefined;
  BloodBankDetail: { 
    bloodBank: {
      id: string;
      name: string;
      location: string;
      distance: string;
      hours?: string;
      bloodNeeded?: string;
    } 
  };
  Notification: undefined;
  AccountSettings: undefined;
  EditProfile: undefined;
  DonationUpdate: undefined;
  History: undefined;
};

export type TabParamList = {
  Home: undefined;
  Create: undefined;
  'AI Chat': undefined;
  'Blood Banks': undefined;
  Profile: undefined;
};

export type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;
export type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;
export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
export type OTPScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OTPScreen'>;
export type OTPScreenRouteProp = RouteProp<RootStackParamList, 'OTPScreen'>;

export type HomeScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Home'>;
export type CreateRequestScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Create'>;
export type ChatScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'AI Chat'>;
export type BloodBankScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Blood Banks'>;
export type ProfileScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Profile'>;

export interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}

export interface OnboardingScreenProps {
  navigation: OnboardingScreenNavigationProp;
}

export interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export interface OTPScreenProps {
  navigation: OTPScreenNavigationProp;
  route: OTPScreenRouteProp;
}

export interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export interface CreateRequestScreenProps {
  navigation: CreateRequestScreenNavigationProp;
}

export interface ChatScreenProps {
  navigation: ChatScreenNavigationProp;
}

export interface BloodBankScreenProps {
  navigation: BloodBankScreenNavigationProp;
}

export interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
} 
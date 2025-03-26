import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

interface SplashScreenWrapperProps {
  children: React.ReactNode;
}

const SplashScreenWrapper: React.FC<SplashScreenWrapperProps> = ({ children }) => {
  // Hide the splash screen after the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hide();
    }, 1500); // Hide after 1.5 seconds - adjust as needed

    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
};

export default SplashScreenWrapper; 
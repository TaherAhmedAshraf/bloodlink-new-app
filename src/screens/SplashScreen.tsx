import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../components/Logo';
import colors from '../theme/colors';
import { SplashScreenProps } from '../navigation/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if user is already logged in
        const token = await AsyncStorage.getItem('auth_token');
        
        // Wait for 1.5 seconds to show splash screen
        // await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (token) {
          // User is logged in, navigate directly to Main screen
          navigation.replace('Main');
        } else {
          // User is not logged in, navigate to Onboarding
          navigation.replace('Onboarding');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // If there's an error, navigate to Onboarding as fallback
        navigation.replace('Onboarding');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <View style={styles.logoContainer}>
      <Image 
        source={require('../assets/images/logo.png')} 
        resizeMode="contain"
        style={styles.logo}
      />
      </View>
      <View style={styles.quoteContainer}>
        <Icon name="format-quote-close-outline" size={30} color="#FFF" />
        <Text style={styles.quote}>
          Life's truest joy lies in giving the gift of life. Donate blood!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:colors.background,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  quoteContainer: {
    alignItems: 'center',
    height: 200,
    flexDirection:'column',
    justifyContent:'center',
    marginHorizontal:20,
  },
  quote: {
    fontSize: 16,
    color: "#FFF",
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
  logo: {
    width: "65%",
  },
});

export default SplashScreen; 
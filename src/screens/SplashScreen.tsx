import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Logo from '../components/Logo';
import colors from '../theme/colors';
import { SplashScreenProps } from '../navigation/types';

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    // Navigate to Onboarding after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <View style={styles.logoContainer}>
        <Logo size="large" />
      </View>
      <View style={styles.quoteContainer}>
        <Text style={styles.quote}>
          "Life's truest joy lies in giving the gift of life. Donate blood!"
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    padding: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default SplashScreen; 
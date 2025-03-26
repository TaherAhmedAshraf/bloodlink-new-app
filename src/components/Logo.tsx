import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../theme/colors';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  const logoSize = size === 'small' ? 60 : size === 'medium' ? 100 : 150;
  
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/logo.png')} 
        resizeMode="contain"
        style={[styles.logo, { width: logoSize, height: logoSize }]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    resizeMode: 'contain',
    marginBottom: 10,
  },
  text: {
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default Logo; 
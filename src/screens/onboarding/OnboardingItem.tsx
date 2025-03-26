import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ImageSourcePropType } from 'react-native';
import colors from '../../theme/colors';

const { width } = Dimensions.get('window');

interface OnboardingItemProps {
  item: {
    id: string;
    title: string;
    description: string;
    image: ImageSourcePropType;
  };
}

const OnboardingItem: React.FC<OnboardingItemProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
      </View>
      <View style={styles.divider} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: 'contain',
  },
  divider: {
    width: 40,
    height: 4,
    backgroundColor: colors.primary,
    marginVertical: 20,
    borderRadius: 2,
  },
  contentContainer: {
    flex: 0.4,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default OnboardingItem; 
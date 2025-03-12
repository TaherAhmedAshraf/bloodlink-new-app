import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, StatusBar, Image, Text } from 'react-native';
import Button from '../../components/Button';
import colors from '../../theme/colors';
import { images } from '../../assets/images';
import { OnboardingScreenProps } from '../../navigation/types';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

const { width } = Dimensions.get('window');

// Define the OnboardingItem component inline to avoid import issues
const OnboardingItem = ({ item }: { 
  item: { 
    id: string; 
    title: string; 
    description: string; 
    image: any; 
  } 
}) => {
  return (
    <View style={itemStyles.container}>
      <View style={itemStyles.imageContainer}>
        <Image source={item.image} style={itemStyles.image} />
      </View>
      <View style={itemStyles.divider} />
      <View style={itemStyles.contentContainer}>
        <Text style={itemStyles.title}>{item.title}</Text>
        <Text style={itemStyles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

// Styles for the OnboardingItem component
const itemStyles = StyleSheet.create({
  container: {
    width: width,
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
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    },
});

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<FlatList>(null);

  const onboardingData = [
    {
      id: '1',
      title: 'Save Lives with Just a Tap',
      description: 'Request blood, donate to those in need, and be a hero in your community. Every drop counts!',
      image: require('../../assets/images/onboarding1.png'),
    },
    {
      id: '2',
      title: 'Your Blood Donation Guide',
      description: 'Got questions about blood donation? Our AI chatbot is here to provide instant answers and guidance.',
      image: require('../../assets/images/onboarding2.png'),
    },
    {
      id: '3',
      title: 'Real-Time Alerts & Updates',
      description: 'Receive instant notifications when someone needs blood near you or when your request is accepted.',
      image: require('../../assets/images/onboarding3.png'),
    },
  ];

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = (index: number) => {
    if (slidesRef.current) {
      slidesRef.current.scrollToIndex({ index });
    }
  };

  const nextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      scrollTo(currentIndex + 1);
    } else {
      // Navigate to Login screen
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <FlatList
        data={onboardingData}
        renderItem={({ item }) => <OnboardingItem item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />
      <View style={styles.bottomContainer}>
        <View style={styles.indicatorContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentIndex === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
        <View style={styles.buttonContainer}>
        <AntDesignIcon name="left" size={24} color={colors.primary} onPress={() => {
          if (currentIndex > 0) {
            scrollTo(currentIndex - 1);
          }
        }}/>
        <Button
          title={currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          onPress={nextSlide}
          style={styles.button}
        />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: colors.primary,
    width: 20,
  },
  button: {
    width: 130,
  },
  buttonContainer: {
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row',
    marginLeft: 40,
  },
});

export default OnboardingScreen; 
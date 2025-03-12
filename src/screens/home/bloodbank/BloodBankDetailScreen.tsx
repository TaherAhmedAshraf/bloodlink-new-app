import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import colors from '../../../theme/colors';

type BloodBankDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BloodBankDetail'
>;

type BloodBankDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'BloodBankDetail'
>;

interface BloodBankDetailScreenProps {
  navigation: BloodBankDetailScreenNavigationProp;
  route: BloodBankDetailScreenRouteProp;
}

const BloodBankDetailScreen: React.FC<BloodBankDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { bloodBank } = route.params;
  const location = bloodBank.location.split(',');
  const area = location[0]?.trim() || '';
  const city = location[1]?.trim() || '';

  const handleCall = () => {
    // Implement call functionality
    console.log('Calling blood bank:', bloodBank.name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{bloodBank.bloodNeeded || 'Blood Bank Details'}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Blood Bank Name */}
        <Text style={styles.bloodBankName}>{bloodBank.name}</Text>
        
        {/* Location */}
        <View style={styles.infoRow}>
          <Icon name="map-marker" size={20} color={colors.textLight} />
          <Text style={styles.infoText}>{area}, {city}</Text>
          <Text style={styles.distanceText}> • {bloodBank.distance}</Text>
        </View>
        
        {/* Hours */}
        <View style={styles.infoRow}>
          <Icon name="clock-outline" size={20} color={colors.textLight} />
          <Text style={styles.infoText}>{bloodBank.hours || 'Hours not available'}</Text>
        </View>
        
        {/* Location Map */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapContainer}>
            <Image 
              source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=Dhaka,Bangladesh&zoom=14&size=600x300&maptype=roadmap&key=YOUR_API_KEY' }} 
              style={styles.mapImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </ScrollView>
      
      {/* Call Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Icon name="phone" size={20} color={colors.secondary} />
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  bloodBankName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.textLight,
    marginLeft: 8,
  },
  distanceText: {
    fontSize: 16,
    color: colors.info,
    fontWeight: '500',
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  callButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default BloodBankDetailScreen; 
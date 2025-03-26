import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { bloodBankService, BloodBankDetail } from '../../../services';
import colors from '../../../theme/colors';
import { toast } from '../../../utils/toast';

// Mock user location (Dhaka city center coordinates)
const MOCK_USER_LOCATION = {
  lat: 23.8103,
  lng: 90.4125
};

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailedInfo, setDetailedInfo] = useState<BloodBankDetail | null>(null);

  useEffect(() => {
    fetchBloodBankDetails();
  }, []);

  const fetchBloodBankDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bloodBankService.getBloodBankDetail(
        bloodBank.id,
        MOCK_USER_LOCATION.lat,
        MOCK_USER_LOCATION.lng
      );
      
      setDetailedInfo(response);
    } catch (err) {
      console.error('Failed to fetch blood bank details:', err);
      setError('Could not load blood bank details. Please try again.');
      toast.error('Error', 'Failed to load blood bank details');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    const phoneNumber = detailedInfo?.phone || bloodBank.phone;
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      toast.error('Error', 'Phone number not available');
    }
  };

  if (loading) {
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
          <Text style={styles.headerTitle}>Blood Bank Details</Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading blood bank details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
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
          <Text style={styles.headerTitle}>Blood Bank Details</Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={60} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchBloodBankDetails}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const bankData = detailedInfo || bloodBank;
  const location = bankData.location.split(',');
  const area = location[0]?.trim() || '';
  const city = location[1]?.trim() || '';

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
        <Text style={styles.headerTitle}>Blood Bank</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Blood Bank Name */}
        <Text style={styles.bloodBankName}>{bankData.name}</Text>
        
        {/* Location */}
        <View style={styles.infoRow}>
          <Icon name="map-marker" size={20} color={colors.textLight} />
          <Text style={styles.infoText}>{area} {city && `, ${city}`}</Text>
          <Text style={styles.distanceText}> • {bankData.distance}</Text>
        </View>
        
        {/* Hours */}
        <View style={styles.infoRow}>
          <Icon name="clock-outline" size={20} color={colors.textLight} />
          <Text style={styles.infoText}>{detailedInfo?.hours || 'Hours not available'}</Text>
        </View>
        
        {/* Location Map */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Location</Text>
          {detailedInfo?.coordinates ? (
            <View style={styles.mapContainer}>
              <Image 
                source={{ 
                  uri: `https://maps.googleapis.com/maps/api/staticmap?center=${detailedInfo.coordinates.latitude},${detailedInfo.coordinates.longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${detailedInfo.coordinates.latitude},${detailedInfo.coordinates.longitude}&key=YOUR_API_KEY` 
                }} 
                style={styles.mapImage}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={styles.mapContainer}>
              <Image 
                source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=Dhaka,Bangladesh&zoom=14&size=600x300&maptype=roadmap&key=YOUR_API_KEY' }} 
                style={styles.mapImage}
                resizeMode="cover"
              />
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
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
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { bloodRequestService, BloodRequestDetail } from '../../services';
import toast from '../../utils/toast';
import AlertModal from '../../components/AlertModal';
import DonationUpdateModal from '../../components/DonationUpdateModal';
import useDonationCheck from '../../hooks/useDonationCheck';

type RequestDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RequestDetail'
>;

type RequestDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'RequestDetail'
>;

interface RequestDetailScreenProps {
  navigation: RequestDetailScreenNavigationProp;
  route: RequestDetailScreenRouteProp;
}

const RequestDetailScreen: React.FC<RequestDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { request } = route.params;
  const { isDonationInfoComplete, loading: donationCheckLoading, checkDonationInfo } = useDonationCheck();
  const [requestData, setRequestData] = useState<BloodRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [donationUpdateModalVisible, setDonationUpdateModalVisible] = useState(false);

  useEffect(() => {
    fetchRequestDetails();
    checkDonationInfo();
  }, []);

  // Listen for navigation focus events to recheck donation info
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkDonationInfo();
    });

    return unsubscribe;
  }, [navigation, checkDonationInfo]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch blood request details from API
      const response = await bloodRequestService.getBloodRequestDetail(request.id);
      setRequestData(response);
    } catch (error) {
      console.error('Failed to fetch request details:', error);
      setError('Failed to load request details. Please try again.');
      
      // Fallback to the request data passed in route params
      setRequestData({
        id: request.id,
        bloodType: request.bloodType,
        hospital: request.hospital,
        location: request.location,
        zone: request.zone || '',
        date: request.date,
        time: request.time,
        status: 'pending',
        viewCount: request.viewCount || 0,
        daysAgo: request.daysAgo,
        hemoglobinPoint: 'N/A',
        patientProblem: 'N/A',
        bagNeeded: 'N/A',
        additionalInfo: '',
        createdAt: new Date().toISOString(),
        requester: {
          id: '',
          name: '',
          phoneNumber: '',
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!requestData) return;
    
    // Check if donation info is complete before proceeding
    if (!isDonationInfoComplete) {
      setDonationUpdateModalVisible(true);
      return;
    }
    
    // Show confirmation modal
    setAcceptModalVisible(true);
  };

  const confirmAccept = async () => {
    if (!requestData) return;
    
    try {
      setAcceptLoading(true);
      // Call API to accept blood request
      const response = await bloodRequestService.acceptBloodRequest(requestData.id);
      
      toast.success('Request Accepted', 'You have successfully accepted this blood request.');
      setAcceptModalVisible(false);
      navigation.goBack();
    } catch (error: any) {
      console.error('Failed to accept request:', error);
      toast.error('Failed to Accept', error.response?.data?.message || 'Please try again later.');
    } finally {
      setAcceptLoading(false);
      setAcceptModalVisible(false);
    }
  };

  const handleCall = () => {
    if (!requestData?.requester?.phoneNumber) {
      toast.error('Phone number not available');
      return;
    }
    
    // Open phone dialer with the requester's phone number
    Linking.openURL(`tel:${requestData.requester.phoneNumber}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Blood Request Details</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading request details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !requestData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Blood Request Details</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchRequestDetails}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!requestData) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{requestData.bloodType} Blood Needed</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Viewers Info */}
        <View style={styles.viewersContainer}>
          <Icon name="information-outline" size={20} color={colors.info} />
          <Text style={styles.viewersText}>
            This request is seeing by {requestData.viewCount} More People
          </Text>
        </View>

        {/* Blood Type and Hospital Info */}
        <View style={styles.bloodInfoContainer}>
          <View style={styles.bloodTypeCircle}>
            <Text style={styles.bloodTypeText}>{requestData.bloodType}</Text>
          </View>
          <View style={styles.hospitalContainer}>
            <Text style={styles.bloodTypeTitle}>{requestData.bloodType} Blood Needed</Text>
            <Text style={styles.hospitalName}>{requestData.hospital}, {requestData.location}</Text>
          </View>
        </View>

        {/* Request Details */}
        <View style={styles.detailsContainer}>
          <DetailRow label="Hemoglobin Point:" value={requestData.hemoglobinPoint} valueColor={colors.error} />
          <DetailRow label="Patient Problem:" value={requestData.patientProblem} valueColor={colors.error} />
          <DetailRow label="Bag Needed:" value={requestData.bagNeeded} valueColor={colors.primary}/>
          <DetailRow label="Zone:" value={requestData.zone} valueColor={colors.primary}/>
          <DetailRow label="Date:" value={requestData.date} valueColor={colors.primary}/>
          <DetailRow label="Time:" value={requestData.time} valueColor={colors.primary}/>
          
          {requestData.additionalInfo && (
            <View style={styles.additionalInfoContainer}>
              <Text style={styles.additionalInfoLabel}>Anything Specific:</Text>
              <Text style={styles.additionalInfoText}>{requestData.additionalInfo}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.acceptButton, acceptLoading && styles.buttonDisabled]} 
          onPress={handleAccept}
          disabled={acceptLoading || requestData.status === 'accepted' || donationCheckLoading}
        >
          {acceptLoading || donationCheckLoading ? (
            <ActivityIndicator color={colors.secondary} size="small" />
          ) : requestData.status === 'accepted' ? (
            <Text style={styles.buttonText}>Already Accepted</Text>
          ) : (
            <Text style={styles.buttonText}>Accept Request</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.callButton} 
          onPress={handleCall}
          disabled={!requestData.requester?.phoneNumber}
        >
          <Icon name="phone" size={20} color={colors.primary} style={{marginRight: 5}} />
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
      </View>

      {/* Accept Confirmation Modal */}
      <AlertModal
        visible={acceptModalVisible}
        type="confirm"
        title="Accept Blood Request"
        message="Are you sure you want to accept this blood request? You will be responsible for donating blood to the requester."
        onClose={() => setAcceptModalVisible(false)}
        onConfirm={confirmAccept}
        confirmText="Accept"
        cancelText="Cancel"
        loading={acceptLoading}
      />

      {/* Donation Update Required Modal */}
      <DonationUpdateModal 
        visible={donationUpdateModalVisible} 
        onClose={() => setDonationUpdateModalVisible(false)}
      />
    </SafeAreaView>
  );
};

// Helper component for detail rows
const DetailRow = ({ 
  label, 
  value, 
  valueColor = colors.text 
}: { 
  label: string; 
  value: string; 
  valueColor?: string;
}) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, { color: valueColor }]}>{value}</Text>
  </View>
);

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
  },
  viewersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  viewersText: {
    marginLeft: 8,
    color: colors.info,
    fontSize: 14,
  },
  bloodInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
  },
  bloodTypeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodTypeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  hospitalContainer: {
    marginLeft: 16,
  },
  bloodTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  hospitalName: {
    fontSize: 14,
    color: colors.textLight,
  },
  detailsContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailLabel: {
    width: 140,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  additionalInfoContainer: {
    marginTop: 8,
  },
  additionalInfoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  additionalInfoText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  actionContainer: {
    flexDirection: 'column',
    padding: 16,
    gap: 10,
    // justifyContent: 'space-between',
    height: 160,
  },
  acceptButton: {
    flex: 2,
    backgroundColor: '#00695C',
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  callButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: colors.secondary,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  callButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
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
    marginTop: 16,
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
});

export default RequestDetailScreen; 
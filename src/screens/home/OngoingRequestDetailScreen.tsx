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
  Alert,
  Linking,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { bloodRequestService, OngoingBloodRequest } from '../../services';
import AlertModal from '../../components/AlertModal';
import toast from '../../utils/toast';

type OngoingRequestDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'OngoingRequestDetail'
>;

type OngoingRequestDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'OngoingRequestDetail'
>;

interface OngoingRequestDetailScreenProps {
  navigation: OngoingRequestDetailScreenNavigationProp;
  route: OngoingRequestDetailScreenRouteProp;
}

const OngoingRequestDetailScreen: React.FC<OngoingRequestDetailScreenProps> = ({
  navigation,
  route,
}) => {
  // Handle both cases: receiving a full request object or just a requestId
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Extract parameters - handle both formats
  const requestParam = route.params?.request;
  const requestId = route.params?.requestId || requestParam?.id;
  
  // Create initial request state
  const [requestData, setRequestData] = useState<OngoingBloodRequest | null>(
    requestParam ? {
      id: requestParam.id || '',
      hospital: requestParam.hospital || '',
      location: requestParam.location || '',
      bloodType: requestParam.bloodType || '',
      date: requestParam.date || '',
      time: requestParam.time || '',
      status: requestParam.status || 'pending',
      role: requestParam.role || 'requester',
      viewCount: requestParam.viewCount || 0,
      requesterInfo: requestParam.requesterInfo || undefined,
      donorInfo: requestParam.donorInfo || undefined
    } : null
  );
  
  // State for actions
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [isChangingDonor, setIsChangingDonor] = useState(false);
  
  // Modal visibility states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showChangeDonorModal, setShowChangeDonorModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  // Reason inputs
  const [cancelReason, setCancelReason] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [changeDonorReason, setChangeDonorReason] = useState('');

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString; // Return original string if parsing fails
    }
  };
  
  // Fetch request details if only requestId is provided
  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!requestData && requestId) {
        try {
          setLoading(true);
          setError(null);
          const response = await bloodRequestService.getOngoingRequestDetail(requestId);
          
          if (response) {
            setRequestData(response);
          } else {
            setError('Failed to load request details');
            toast.error('Error', 'Failed to load request details');
            navigation.goBack();
          }
        } catch (error: any) {
          console.error('Error fetching request details:', error);
          setError(error?.message || 'Failed to load request details');
          toast.error('Error', 'Failed to load request details');
          navigation.goBack();
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchRequestDetails();
  }, [requestId, navigation, requestData]);
  
  // Handle case when data is still loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ongoing Request</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading request details...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Use the fetched request data
  const request = requestData;
  
  // If error or request not found
  if (!request) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {error || 'Request not found. Please try again.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Debug logs with safe property access
  console.log("Request details:", JSON.stringify(request, null, 2));
  console.log("Is requester:", request.role === 'requester');
  console.log("Has donor:", !!request.donorInfo);
  console.log("Status:", request.status);

  const handleCall = () => {
    // Safely access phone numbers with optional chaining
    const phoneNumber = request.role === 'donor' 
      ? request.requesterInfo?.phoneNumber 
      : request.donorInfo?.phoneNumber;
    
    if (phoneNumber) {
      const formattedPhoneNumber = `tel:${phoneNumber}`;
      Linking.canOpenURL(formattedPhoneNumber)
        .then(supported => {
          if (supported) {
            return Linking.openURL(formattedPhoneNumber);
          } else {
            toast.error('Cannot open phone app', 'Please dial the number manually.');
          }
        })
        .catch(error => {
          toast.error('Error opening phone app', error.message);
        });
    } else {
      toast.error('No phone number available', 'Contact information is missing.');
    }
  };

  const shouldShowCompleteButton = () => {
    // Only show complete button if the request is accepted and not completed
    return request.status === 'accepted' && 
           (request.role === 'donor' || (request.role === 'requester' && request.donorInfo));
  };

  const shouldShowCancelButton = () => {
    // Check if donorInfo exists and if it has a valid name and phone number
    const hasDonor = !!request.donorInfo && 
                    (!!request.donorInfo.name || !!request.donorInfo.phoneNumber);
    
    // Show cancel button if user is requester and no donor is found yet
    return request.role === 'requester' && 
           !hasDonor && 
           request.status !== 'completed' && 
           request.status !== 'cancelled';
  };

  const shouldShowReportButton = () => {
    // Show report button if user is requester and donor is found
    return request.role === 'requester' && 
           !!request.donorInfo && 
           request.status === 'accepted';
  };
  
  // Handle Button Actions
  const handleCompletionRequest = () => {
    setShowCompletionModal(true);
  };
  
  const handleComplete = async () => {
    if (!request.id) {
      toast.error('Error', 'Request ID is missing.');
      return;
    }
    
    try {
      setIsCompleting(true);
      const response = await bloodRequestService.completeBloodRequest(request.id);
      
      if (response.success) {
        toast.success('Request Completed', 'The blood request has been marked as completed.');
        navigation.goBack();
      } else {
        toast.error('Failed to complete request', response?.message || 'Failed to complete the request. Please try again.');
      }
    } catch (error:any) {
      console.error('Error completing request:', error);
      toast.error('Error', error?.response?.data?.message || 'Failed to complete the request. Please try again.');
    } finally {
      setIsCompleting(false);
      setShowCompletionModal(false);
    }
  };

  const confirmCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Error', 'Please provide a reason for cancellation.');
      return;
    }
    
    try {
      setIsCancelling(true);
      const response = await bloodRequestService.cancelBloodRequest(request.id, cancelReason);
      
      if (response.success) {
        toast.success('Request Cancelled', 'The blood request has been cancelled successfully.');
        setShowCancelModal(false);
        navigation.goBack();
      } else {
        toast.error('Failed to cancel request', response?.message || 'Failed to cancel the request. Please try again.');
      }
    } catch (error:any) {
      console.error('Error cancelling request:', error);
      toast.error('Error', error?.response?.data?.message || 'Failed to cancel the request. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const confirmReport = async () => {
    if (!reportReason.trim()) {
      toast.error('Error', 'Please provide a reason for reporting the donor.');
      return;
    }
    
    try {
      setIsReporting(true);
      const response = await bloodRequestService.reportDonor(request.id, reportReason);
      
      if (response.success) {
        toast.success('Donor Reported', 'The donor has been reported successfully.');
        setShowReportModal(false);
        setShowChangeDonorModal(true);
      } else {
        toast.error('Failed to report donor', response?.message || 'Failed to report the donor. Please try again.');
      }
    } catch (error:any) {
      console.error('Error reporting donor:', error);
      toast.error('Error', error?.response?.data?.message || 'Failed to report the donor. Please try again.');
    } finally {
      setIsReporting(false);
    }
  };

  const confirmChangeDonor = async () => {
    if (!changeDonorReason.trim()) {
      toast.error('Error', 'Please provide a reason for changing the donor.');
      return;
    }
    
    try {
      setIsChangingDonor(true);
      const response = await bloodRequestService.requestChangeDonor(request.id, changeDonorReason);
      
      if (response.success) {
        toast.success('Change Requested', 'The request for a different donor has been submitted successfully.');
        setShowChangeDonorModal(false);
        navigation.goBack();
      } else {
        toast.error('Failed to request donor change', response?.message || 'Failed to request a donor change. Please try again.');
      }
    } catch (error:any) {
      console.error('Error requesting donor change:', error);
      toast.error('Error', error?.response?.data?.message || 'Failed to request a donor change. Please try again.');
    } finally {
      setIsChangingDonor(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'accepted':
        return colors.info;
      default:
        return colors.primary;
    }
  };

  const getContactName = () => {
    if (request.role === 'donor') {
      return request.requesterInfo?.name || 'Requester';
    } else {
      return request.donorInfo?.name || 'Donor';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{request.bloodType} Blood Needed</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Viewing Banner */}
        <View style={styles.viewingBanner}>
          <Icon name="eye" size={16} color={colors.primary} />
          <Text style={styles.viewingText}>
            {request.viewCount || 0} people are viewing this request
          </Text>
        </View>

        {/* Blood Type and Hospital Info */}
        <View style={styles.bloodInfoHeader}>
          <View style={styles.bloodTypeCircle}>
            <Text style={styles.bloodTypeText}>{request.bloodType}</Text>
          </View>
          
          <View style={styles.hospitalInfo}>
            <Text style={styles.bloodTypeTitle}>Needed at {request.hospital}</Text>
            <Text style={styles.hospitalName}>{request.location}</Text>
          </View>
        </View>

        {/* Request Details in field format */}
        <View style={styles.detailsContainer}>
          <InfoField 
            label="Status" 
            value={request.status} 
            valueColor={getStatusColor(request.status)} 
          />
          
          <InfoField 
            label="Blood Type" 
            value={request.bloodType} 
            valueColor={colors.primary} 
          />
          
          <InfoField 
            label="Hospital" 
            value={request.hospital} 
            valueColor={colors.text} 
          />
          
          <InfoField 
            label="Location" 
            value={request.location} 
            valueColor={colors.text} 
          />
          
          <InfoField 
            label="Date" 
            value={request.date} 
            valueColor={colors.text} 
          />
          
          <InfoField 
            label="Time" 
            value={request.time} 
            valueColor={colors.text} 
          />
          
          <InfoField 
            label="Your Role" 
            value={request.role === 'donor' ? 'Donor' : 'Requester'} 
            valueColor={colors.text} 
          />
          
          <InfoField 
            label="Created On" 
            value={formatDate(request.date)} 
            valueColor={colors.text} 
          />
          
          {/* Special instructions or notes */}
          <View style={styles.additionalInfo}>
            <Text style={styles.additionalInfoLabel}>Anything Specific:</Text>
            <Text style={styles.additionalInfoValue}>
              {request.status === 'accepted' 
                ? `You are the ${request.role} for this blood request. Please coordinate with the ${request.role === 'donor' ? 'requester' : 'donor'} to complete the donation process.`
                : 'No specific instructions provided.'}
            </Text>
          </View>
        </View>

        {/* Contact Information section */}
        {((request.role === 'donor' && request.requesterInfo) || 
          (request.role === 'requester' && request.donorInfo && request.donorInfo.phoneNumber)) && (
          <View style={styles.contactSection}>
            <Text style={styles.contactSectionTitle}>Contact Information</Text>
            
            {request.role === 'donor' && request.requesterInfo && (
              <View style={styles.contactDetails}>
                <Text style={styles.contactName}>
                  {request.requesterInfo.name} (Requester)
                </Text>
                <Text style={styles.contactPhone}>
                  {request.requesterInfo.phoneNumber}
                </Text>
              </View>
            )}
            
            {request.role === 'requester' && request.donorInfo && request.donorInfo.phoneNumber && (
              <View style={styles.contactDetails}>
                <Text style={styles.contactName}>
                  {request.donorInfo.name} (Donor)
                </Text>
                <Text style={styles.contactPhone}>
                  {request.donorInfo.phoneNumber}
                </Text>
              </View>
            )}
          </View>
        )}
        
        {request.role === 'requester' && !request.donorInfo && (
          <View style={styles.noDonorMessage}>
            <Text style={styles.noDonorText}>
              No donor has accepted this request yet. We'll notify you when someone accepts.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtonContainer}>
        {shouldShowCompleteButton() && (
          <TouchableOpacity
            style={[styles.primaryButton, isCompleting && styles.buttonDisabled]}
            onPress={handleCompletionRequest}
            disabled={isCompleting}
          >
            {isCompleting ? (
              <ActivityIndicator color={colors.secondary} size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>Mark as Complete</Text>
            )}
          </TouchableOpacity>
        )}
        
        {shouldShowCancelButton() && (
          <TouchableOpacity
            style={[styles.primaryButton, isCancelling && styles.buttonDisabled, { backgroundColor: colors.error }]}
            onPress={() => setShowCancelModal(true)}
            disabled={isCancelling}
          >
            <Text style={styles.primaryButtonText}>Cancel Request</Text>
          </TouchableOpacity>
        )}
        
        {shouldShowReportButton() && (
          <TouchableOpacity
            style={[styles.primaryButton, isReporting && styles.buttonDisabled, { backgroundColor: colors.warning }]}
            onPress={() => setShowReportModal(true)}
            disabled={isReporting}
          >
            <Text style={styles.primaryButtonText}>Report & Change Donor</Text>
          </TouchableOpacity>
        )}
        
        {((request.role === 'donor' && request.requesterInfo?.phoneNumber) || 
          (request.role === 'requester' && request.donorInfo?.phoneNumber)) && (
          <TouchableOpacity 
            style={styles.callButton} 
            onPress={handleCall}
          >
            <Text style={styles.callButtonText}>Call {getContactName()}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Confirmation Modal for Complete */}
      <AlertModal
        visible={showCompletionModal}
        type="confirm"
        title="Complete Request"
        message="Are you sure you want to mark this blood request as completed? This action cannot be undone."
        onClose={() => setShowCompletionModal(false)}
        onConfirm={handleComplete}
        confirmText="Complete"
        cancelText="Cancel"
        loading={isCompleting}
      />
      
      {/* Cancel Request Modal */}
      <Modal
        transparent
        visible={showCancelModal}
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCancelModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Cancel Request</Text>
                <Text style={styles.modalMessage}>
                  Are you sure you want to cancel this blood request? Please provide a reason:
                </Text>
                
                <TextInput
                  style={styles.reasonInput}
                  placeholder="Enter reason for cancellation"
                  placeholderTextColor={colors.textLight}
                  value={cancelReason}
                  onChangeText={setCancelReason}
                  multiline
                />
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    onPress={() => setShowCancelModal(false)}
                    style={styles.modalCancelButton}
                  >
                    <Text style={styles.modalCancelText}>Close</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={confirmCancel}
                    style={[styles.modalConfirmButton, isCancelling && styles.buttonDisabled]}
                    disabled={isCancelling}
                  >
                    {isCancelling ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.modalConfirmText}>Cancel Request</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Report Modal */}
      <Modal
        transparent
        visible={showReportModal}
        animationType="fade"
        onRequestClose={() => setShowReportModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowReportModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Report Donor</Text>
                <Text style={styles.modalMessage}>
                  Please provide a reason for reporting this donor:
                </Text>
                
                <TextInput
                  style={styles.reasonInput}
                  placeholder="Enter reason for reporting"
                  placeholderTextColor={colors.textLight}
                  value={reportReason}
                  onChangeText={setReportReason}
                  multiline
                />
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    onPress={() => setShowReportModal(false)}
                    style={styles.modalCancelButton}
                  >
                    <Text style={styles.modalCancelText}>Close</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={confirmReport}
                    style={[styles.modalConfirmButton, isReporting && styles.buttonDisabled]}
                    disabled={isReporting}
                  >
                    {isReporting ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.modalConfirmText}>Report</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Change Donor Modal */}
      <Modal
        transparent
        visible={showChangeDonorModal}
        animationType="fade"
        onRequestClose={() => setShowChangeDonorModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowChangeDonorModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Request Different Donor</Text>
                <Text style={styles.modalMessage}>
                  Please provide additional details about why you need a different donor:
                </Text>
                
                <TextInput
                  style={styles.reasonInput}
                  placeholder="Enter reason for changing donor"
                  placeholderTextColor={colors.textLight}
                  value={changeDonorReason}
                  onChangeText={setChangeDonorReason}
                  multiline
                />
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    onPress={() => setShowChangeDonorModal(false)}
                    style={styles.modalCancelButton}
                  >
                    <Text style={styles.modalCancelText}>Close</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={confirmChangeDonor}
                    style={[styles.modalConfirmButton, isChangingDonor && styles.buttonDisabled]}
                    disabled={isChangingDonor}
                  >
                    {isChangingDonor ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.modalConfirmText}>Request Change</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

interface InfoFieldProps {
  label: string;
  value: string;
  valueColor: string;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, valueColor }) => {
  return (
    <View style={styles.infoFieldContainer}>
      <Text style={styles.infoFieldLabel}>{label}</Text>
      <Text style={[styles.infoFieldValue, { color: valueColor }]}>{value}</Text>
    </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  viewingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#EBF3FF',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  viewingText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  bloodInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FEE9E9',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  bloodTypeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bloodTypeText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  hospitalInfo: {
    flex: 1,
  },
  bloodTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  hospitalName: {
    fontSize: 14,
    color: colors.textLight,
  },
  detailsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
  },
  infoFieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoFieldLabel: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  infoFieldValue: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'right',
  },
  additionalInfo: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
  },
  additionalInfoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  additionalInfoValue: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  contactSection: {
    marginTop: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 12,
  },
  contactSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  contactDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  contactPhone: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  noDonorMessage: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
  },
  noDonorText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  actionButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  callButton: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 15,
    alignItems: 'center',
  },
  callButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: colors.textLight,
    fontSize: 16,
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  modalCancelText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '500',
  },
  modalConfirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalConfirmText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default OngoingRequestDetailScreen; 
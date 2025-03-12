import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

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

  // Mock data for the example
  const requestData = {
    bloodType: 'A+',
    hospital: 'Lab Aid Hospital',
    location: 'Dhaka',
    hemoglobinPoint: 'N/A',
    patientProblem: 'Uterine tumor',
    bagNeeded: '2 Bag',
    zone: 'Kolabagan, Dhaka',
    date: '07/02/2025',
    time: '11:00 AM',
    additionalInfo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo conseq',
    viewCount: 10,
    ...request
  };

  const handleAccept = () => {
    // Handle accept request logic
    console.log('Request accepted');
  };

  const handleCall = () => {
    // Handle call logic
    console.log('Calling requester');
  };

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
          
          <View style={styles.additionalInfoContainer}>
            <Text style={styles.additionalInfoLabel}>Anything Specific:</Text>
            <Text style={styles.additionalInfoText}>{requestData.additionalInfo}</Text>
          </View>
        </View>
              {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
          <Text style={styles.buttonText}>Accept Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
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
  },
  acceptButton: {
    flex: 2,
    backgroundColor: '#00695C',
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.secondary,
    fontWeight: '600',
    fontSize: 16,
  },
  callButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default RequestDetailScreen; 
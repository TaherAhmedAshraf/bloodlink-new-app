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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blood Request Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Hospital Info */}
        <View style={styles.section}>
          <View style={styles.hospitalHeader}>
            <View style={[styles.bloodTypeContainer, { backgroundColor: getBloodTypeColor(request.bloodType) }]}>
              <Text style={styles.bloodType}>{request.bloodType}</Text>
            </View>
            <View style={styles.hospitalInfo}>
              <Text style={styles.hospitalName}>{request.hospital}</Text>
              <Text style={styles.location}>{request.location}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="calendar" size={18} color={colors.textLight} />
            <Text style={styles.detailText}>{request.date}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="clock-outline" size={18} color={colors.textLight} />
            <Text style={styles.detailText}>{request.time}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="account" size={18} color={colors.textLight} />
            <Text style={styles.detailText}>Patient: John Doe</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="phone" size={18} color={colors.textLight} />
            <Text style={styles.detailText}>Contact: +880 1712345678</Text>
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <Text style={styles.description}>
            Urgent blood needed for surgery. The patient is scheduled for surgery tomorrow morning.
            Please contact as soon as possible if you can donate.
          </Text>
        </View>

        {/* Donor Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Donor Requirements</Text>
          <View style={styles.requirementItem}>
            <Icon name="check-circle" size={18} color={colors.success} />
            <Text style={styles.requirementText}>Age between 18-60 years</Text>
          </View>
          <View style={styles.requirementItem}>
            <Icon name="check-circle" size={18} color={colors.success} />
            <Text style={styles.requirementText}>Weight more than 50kg</Text>
          </View>
          <View style={styles.requirementItem}>
            <Icon name="check-circle" size={18} color={colors.success} />
            <Text style={styles.requirementText}>No major illness in last 6 months</Text>
          </View>
          <View style={styles.requirementItem}>
            <Icon name="check-circle" size={18} color={colors.success} />
            <Text style={styles.requirementText}>No tattoo in last 12 months</Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.callButton}>
          <Icon name="phone" size={20} color={colors.secondary} />
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.donateButton}>
          <Icon name="hand-heart" size={20} color={colors.secondary} />
          <Text style={styles.buttonText}>Donate</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const getBloodTypeColor = (bloodType: string) => {
  switch (bloodType) {
    case 'A+':
      return '#FFEBEE';
    case 'AB+':
      return '#E8F5E9';
    case 'O-':
      return '#FFF8E1';
    default:
      return '#E3F2FD';
  }
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
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  hospitalHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  bloodTypeContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  hospitalInfo: {
    marginLeft: 12,
    flex: 1,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  location: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.info,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  donateButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: colors.secondary,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default RequestDetailScreen; 
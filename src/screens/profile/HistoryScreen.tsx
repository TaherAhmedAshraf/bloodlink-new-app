import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

type HistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'History'
>;

interface HistoryScreenProps {
  navigation: HistoryScreenNavigationProp;
}

type HistoryType = 'accepted' | 'requested';

interface HistoryItem {
  id: string;
  hospital: string;
  location: string;
  bloodType: string;
  viewCount?: number;
}

const ACCEPTED_REQUESTS: HistoryItem[] = [
  {
    id: '1',
    hospital: 'Lab Aid Hospital',
    location: 'Mirpur, Dhaka',
    bloodType: 'A+',
  },
];

const REQUESTED_BLOOD: HistoryItem[] = [
  {
    id: '1',
    hospital: 'Lab Aid Hospital',
    location: 'Mirpur, Dhaka',
    bloodType: 'A+',
    viewCount: 22,
  },
];

const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<HistoryType>('accepted');

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    return (
      <View style={styles.historyItem}>
        <View style={styles.bloodTypeCircle}>
          <Text style={styles.bloodTypeText}>{item.bloodType}</Text>
        </View>
        <View style={styles.historyItemContent}>
          <Text style={styles.hospitalName}>{item.hospital}</Text>
          <Text style={styles.location}>{item.location}</Text>
        </View>
        {activeTab === 'accepted' ? (
          <View style={styles.acceptedBadge}>
            <Text style={styles.acceptedText}>ACCEPTED</Text>
          </View>
        ) : (
          <View style={styles.viewCountContainer}>
            <Icon name="eye-outline" size={16} color={colors.info} />
            <Text style={styles.viewCountText}>{item.viewCount}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'accepted' && styles.activeTab
          ]}
          onPress={() => setActiveTab('accepted')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'accepted' && styles.activeTabText
            ]}
          >
            Accepted Blood Request
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'requested' && styles.activeTab
          ]}
          onPress={() => setActiveTab('requested')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'requested' && styles.activeTabText
            ]}
          >
            Requested Blood
          </Text>
        </TouchableOpacity>
      </View>

      {/* History List */}
      <FlatList
        data={activeTab === 'accepted' ? ACCEPTED_REQUESTS : REQUESTED_BLOOD}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  bloodTypeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodTypeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  historyItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  hospitalName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: colors.textLight,
  },
  acceptedBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  acceptedText: {
    fontSize: 10,
    color: '#388E3C',
    fontWeight: '600',
  },
  viewCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCountText: {
    fontSize: 12,
    color: colors.info,
    marginLeft: 4,
  },
});

export default HistoryScreen; 
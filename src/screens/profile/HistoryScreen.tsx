import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import toast from '../../utils/toast';
import { userService, HistoryItem } from '../../services';

type HistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'History'
>;

interface HistoryScreenProps {
  navigation: HistoryScreenNavigationProp;
}

type HistoryType = 'accepted' | 'requested';

const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<HistoryType>('accepted');
  const [acceptedRequests, setAcceptedRequests] = useState<HistoryItem[]>([]);
  const [requestedBlood, setRequestedBlood] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch history data on component mount
  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const historyData = await userService.getHistory();
      
      setAcceptedRequests(historyData.accepted);
      setRequestedBlood(historyData.requested);
    } catch (error) {
      console.error('Error fetching history:', error);
      setError('Failed to load history data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHistoryData();
  };

  const handleTabChange = (tab: HistoryType) => {
    setActiveTab(tab);
    if (tab === 'accepted') {
      toast.info('Showing Accepted Requests', 'Displaying blood requests you have accepted');
    } else {
      toast.info('Showing Your Requests', 'Displaying blood requests you have created');
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    return (
      <View style={styles.historyItem}>
        <View style={styles.bloodTypeCircle}>
          <Text style={styles.bloodTypeText}>{item.bloodType}</Text>
        </View>
        <View style={styles.historyItemContent}>
          <Text style={styles.hospitalName}>{item.hospital}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        {activeTab === 'accepted' ? (
          <View style={styles.acceptedBadge}>
            <Text style={styles.acceptedText}>ACCEPTED</Text>
          </View>
        ) : (
          <View style={styles.viewCountContainer}>
            <Icon name="eye-outline" size={16} color={colors.info} />
            <Text style={styles.viewCountText}>{item.viewCount || 0}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderEmptyList = () => {
    if (loading && !refreshing) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {error || `No ${activeTab === 'accepted' ? 'accepted' : 'requested'} blood requests found`}
        </Text>
        {error && (
          <TouchableOpacity style={styles.retryButton} onPress={fetchHistoryData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
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
          onPress={() => handleTabChange('accepted')}
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
          onPress={() => handleTabChange('requested')}
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
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={activeTab === 'accepted' ? acceptedRequests : requestedBlood}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={renderEmptyList}
        />
      )}
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
    flexGrow: 1,
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
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: colors.info,
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
    marginLeft: 4,
    fontSize: 12,
    color: colors.info,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 20,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 20,
    marginTop: 10,
  },
  retryButtonText: {
    color: colors.secondary,
    fontWeight: '500',
  },
});

export default HistoryScreen; 
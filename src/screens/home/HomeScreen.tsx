import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { HomeScreenProps } from '../../navigation/types';
import FilterModal from '../../components/FilterModal';
import { bloodRequestService, BloodRequest, OngoingBloodRequest } from '../../services';
import toast from '../../utils/toast';
import AlertModal from '../../components/AlertModal';
import { useProfileCompletionContext } from '../../context/ProfileCompletionContext';
import NotificationBadge from '../../components/NotificationBadge';
import SkeletonLoader from '../../components/SkeletonLoader';

// Mock data for blood requests
const BLOOD_REQUESTS: BloodRequest[] = [];

const BloodTypeIcon = ({ bloodType }: { bloodType: string }) => {
  const getBackgroundColor = () => {
    switch (bloodType) {
      case 'A+':
        return '#FFEBEE';
      case 'AB+':
        return '#E8F5E9';
      case 'O-':
        return '#FFF8E1';
      case 'B+':
        return '#E3F2FD';
      case 'B-':
        return '#E1F5FE';
      case 'O+':
        return '#FFF3E0';
      case 'A-':
        return '#EDE7F6';
      case 'AB-':
        return '#FBE9E7';
      default:
        return '#E3F2FD';
    }
  };

  const getTextColor = () => {
    switch (bloodType) {
      case 'A+':
        return colors.primary;
      case 'AB+':
        return colors.success;
      case 'O-':
        return colors.warning;
      case 'B+':
        return colors.info;
      case 'B-':
        return colors.info;
      case 'O+':
        return colors.info;
      case 'A-':
        return colors.info;
      case 'AB-':
        return colors.info;
      default:
        return colors.primary;
    }
  };

  return (
    <View style={[styles.bloodTypeContainer, { backgroundColor: getBackgroundColor() }]}>
      <Text style={[styles.bloodType, { color: getTextColor() }]}>{bloodType}</Text>
    </View>
  );
};

const RequestItem = ({ item, onPress }: { item: typeof BLOOD_REQUESTS[0]; onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.requestItem} onPress={onPress}>
      <BloodTypeIcon bloodType={item.bloodType} />
      <View style={styles.requestInfo}>
        <Text style={styles.hospitalName}>{item.hospital}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <View style={styles.dateTimeContainer}>
          <Icon name="calendar" size={14} color={colors.success} />
          <Text style={styles.dateTime}>{item.date}</Text>
          <Icon name="clock-outline" size={14} color={colors.success} style={styles.clockIcon} />
          <Text style={styles.dateTime}>{item.time}</Text>
        </View>
      </View>
      <View style={styles.daysContainer}>
        <Text style={styles.daysText}>{item.bagNeeded} Bags</Text>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('All Request');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BloodRequest[]>([]);
  const [ongoingRequests, setOngoingRequests] = useState<OngoingBloodRequest[]>([]);
  const [selectedFilters, setSelectedFilters] = useState({
    bloodGroup: '',
    zone: '',
  });
  const [loading, setLoading] = useState(false);
  const [ongoingLoading, setOngoingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ongoingError, setOngoingError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mainRefreshing, setMainRefreshing] = useState(false);
  const [clearFilterModalVisible, setClearFilterModalVisible] = useState(false);
  const { checkProfileCompletion, isProfileComplete, loading: profileLoading } = useProfileCompletionContext();

  // Fetch blood requests, ongoing requests and check profile completion on component mount
  useEffect(() => {
    fetchBloodRequests();
    fetchOngoingRequests();
    
    // Check if user profile is complete
    checkProfileCompletion();
  }, []);

  // Handle profile completion status
  useEffect(() => {
    if (!profileLoading && !isProfileComplete) {
      // If profile is incomplete, show a toast and navigate to EditProfile
      toast.warning('Profile Incomplete', 'Please complete your profile to unlock all features');
      
      // Navigate to EditProfile
      const rootNavigation = navigation.getParent();
      if (rootNavigation) {
        rootNavigation.navigate('EditProfile');
      }
    }
  }, [isProfileComplete, profileLoading]);

  // Fetch blood requests
  const fetchBloodRequests = async (refresh = false) => {
    try {
      if (refresh) {
        setPage(1);
        setHasMore(true);
      }

      if (!hasMore && !refresh) return;

      setLoading(true);
      setError(null);

      const currentPage = refresh ? 1 : page;
      const response = await bloodRequestService.getBloodRequests(
        selectedFilters.bloodGroup,
        selectedFilters.zone,
        currentPage
      );

      const newRequests = response.requests;
      
      if (refresh) {
        setBloodRequests(newRequests);
        setFilteredRequests(newRequests);
        toast.success('Refreshed', 'Blood requests updated successfully');
      } else {
        setBloodRequests(prev => [...prev, ...newRequests]);
        setFilteredRequests(prev => [...prev, ...newRequests]);
      }

      // Check if there are more pages
      setHasMore(currentPage < response.pagination.pages);
      setPage(currentPage + 1);
      
      return response; // Return the response for Promise handling
    } catch (error) {
      console.error('Failed to fetch blood requests:', error);
      setError('Failed to load blood requests. Please try again.');
      
      // Use mock data if API fails during development
      if (bloodRequests.length === 0) {
        setBloodRequests(BLOOD_REQUESTS as unknown as BloodRequest[]);
        setFilteredRequests(BLOOD_REQUESTS as unknown as BloodRequest[]);
      }
      
      if (refresh) {
        toast.error('Refresh Failed', 'Could not update blood requests');
      }
      
      throw error; // Rethrow for Promise handling
    } finally {
      setLoading(false);
    }
  };

  // Fetch ongoing blood requests
  const fetchOngoingRequests = async () => {
    try {
      setOngoingLoading(true);
      setOngoingError(null);

      const response = await bloodRequestService.getOngoingRequests();
      setOngoingRequests(response.ongoingRequests);
      
      if (refreshing) {
        toast.success('Refreshed', 'Ongoing requests updated successfully');
      }
      
      return response; // Return the response for Promise handling
    } catch (error) {
      console.error('Failed to fetch ongoing requests:', error);
      setOngoingError('Failed to load ongoing requests');
      
      // Use empty array if API fails
      setOngoingRequests([]);
      
      if (refreshing) {
        toast.error('Refresh Failed', 'Could not update ongoing requests');
      }
      
      throw error; // Rethrow for Promise handling
    } finally {
      setOngoingLoading(false);
      setRefreshing(false);
    }
  };

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleApplyFilter = (bloodGroup: string, zone: string) => {
    setSelectedFilters({ bloodGroup, zone });
    setFilterModalVisible(false);
    
    // Reset pagination
    // setPage(1);
    // setHasMore(true);
    
    // Fetch filtered requests
    // fetchBloodRequests(true);
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchBloodRequests(true);
  }, [selectedFilters]);

  const handleRequestPress = (item: BloodRequest) => {
    // Use getRootNavigation to navigate to screens outside the tab navigator
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.navigate('RequestDetail', { request: item });
    }
  };

  const handleClearFilter = () => {
    if (selectedFilters.bloodGroup || selectedFilters.zone) {
      setClearFilterModalVisible(true);
    }
  };

  const confirmClearFilter = () => {
    setSelectedFilters({ bloodGroup: '', zone: '' });
    
    // Reset pagination
    setPage(1);
    setHasMore(true);
    
    // Fetch all requests
    fetchBloodRequests(true);
    
    // Close modal
    setClearFilterModalVisible(false);
    
    // Show toast
    toast.info('Filters Cleared', 'Showing all blood requests');
  };

  const handleRefresh = () => {
    fetchBloodRequests(true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchBloodRequests();
    }
  };

  const handleOngoingRequestPress = (item: OngoingBloodRequest) => {
    // Navigate to OngoingRequestDetail screen
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.navigate('OngoingRequestDetail', { request: item });
    }
  };

  // Handle pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchOngoingRequests();
  };

  // Handle main scroll view refresh
  const onMainRefresh = () => {
    setMainRefreshing(true);
    Promise.all([
      fetchBloodRequests(true),
      fetchOngoingRequests()
    ]).then(() => {
      toast.success('All Data Refreshed', 'Your feed has been updated');
    }).catch(() => {
      // Individual error toasts are already shown in the respective fetch functions
    }).finally(() => {
      setMainRefreshing(false);
    });
  };

  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <SkeletonLoader type="list" />
    );
  };

  // Render ongoing request item
  const renderOngoingRequestItem = (item: OngoingBloodRequest) => {
    return (
      <TouchableOpacity 
        style={styles.currentHospital}
        onPress={() => handleOngoingRequestPress(item)}
      >
        <BloodTypeIcon bloodType={item.bloodType} />
        <View style={styles.hospitalInfo}>
          <Text style={styles.hospitalName}>{item.hospital}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <View style={styles.statusRow}>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: item.status === 'completed' ? colors.success + '20' : item.status === 'accepted' ? colors.success + '20' : colors.info + '20' }
            ]}>
              <Text style={[
                styles.statusBadgeText, 
                { color: item.status === 'completed' ? colors.primary : item.status === 'accepted' ? colors.success : colors.info }
              ]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
            <Text style={styles.roleText}>You are the {item.role}</Text>
          </View>
        </View>
        <View style={styles.notificationCount}>
          <View style={styles.viewsContainer}>
            <Icon name="eye-outline" size={20} color={colors.info} />
            <Text style={styles.viewsText}>{item.viewCount || 0}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
           {/* Header */}
           <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        </View>
        <View style={styles.headerRight}>
          <NotificationBadge onPress={() => {
            const rootNavigation = navigation.getParent();
            if (rootNavigation) {
              rootNavigation.navigate('Notification');
            }
          }} />
        </View>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={mainRefreshing}
            onRefresh={onMainRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
      {/* Current Hospital */}
      <View style={styles.myRequestedBloodContainer}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.requestedBloodTitle}>Your Active Requests</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={fetchOngoingRequests}
          >
            <Icon name="refresh" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {ongoingLoading && !refreshing ? (
          <SkeletonLoader type="ongoing" />
        ) : ongoingError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{ongoingError}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchOngoingRequests}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : ongoingRequests.length === 0 ? (
          <View style={styles.emptyOngoingContainer}>
            <Text style={styles.emptyOngoingText}>No ongoing requests</Text>
          </View>
        ) : (
          <ScrollView 
            contentContainerStyle={styles.ongoingScrollContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
          >
            {ongoingRequests.map((item) => (
              <View key={item.id} style={styles.ongoingItemContainer}>
                {renderOngoingRequestItem(item)}
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <View style={styles.tabTitleContainer}>
          <Text style={styles.tabTitle}>
            {selectedFilters.zone 
              ? `Requests in ${selectedFilters.zone}` 
              : 'All Requests'}
          </Text>
          
          {/* Selected Blood Group Tab */}
          {selectedFilters.bloodGroup && (
            <View style={styles.selectedBloodGroupTab}>
              <Text style={styles.active}>{selectedFilters.bloodGroup}</Text>
              <TouchableOpacity 
                style={styles.clearFilterButton}
                onPress={handleClearFilter}
              >
                <Icon name="close" size={16} color={colors.secondary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
          <Icon name="filter-variant" size={20} color={colors.primary} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Request List */}
      <FlatList
        data={loading && page === 1 ? [] : filteredRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RequestItem 
            item={item} 
            onPress={() => handleRequestPress(item)} 
          />
        )}
        contentContainerStyle={styles.listContainer}
        refreshing={false}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <>
            {loading && page === 1 ? (
              <SkeletonLoader type="request" count={3} />
            ) : (
              <>
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {error || 'No blood requests found'}
                </Text>
                {error && (
                  <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={handleRefresh}
                  >
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                )}
                </View>
              </>
            )}
          </>
        }
      />
      </ScrollView>
      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilter={handleApplyFilter}
        initialBloodGroup={selectedFilters.bloodGroup}
        initialZone={selectedFilters.zone}
      />

      {/* Clear Filter Confirmation Modal */}
      <AlertModal
        visible={clearFilterModalVisible}
        type="confirm"
        title="Clear Filters"
        message="Are you sure you want to clear all filters? This will show all blood requests."
        onClose={() => setClearFilterModalVisible(false)}
        onConfirm={confirmClearFilter}
        confirmText="Clear"
        cancelText="Cancel"
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    width: 40,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  myRequestedBloodContainer: {
    padding: 16,
  },
  requestedBloodTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  currentHospital: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth:.5,
    borderColor:colors.border,
    borderRadius:8,
    padding:16,
  },
  hospitalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  active:{
    color:colors.primary,
    fontWeight:'600',
    fontSize:12,
    padding:4,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  location: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
  },
  notificationCount: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsText: {
    fontSize: 15,
    color: colors.info,
    marginLeft: 4,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tabTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  selectedBloodGroupTab: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 20,
    padding: 2,
    backgroundColor: 'rgba(198, 40, 40, 0.1)',
  },
  clearFilterButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
  listContainer: {
    gap:8,
    padding:16,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: .5,
    borderColor: colors.border,
    borderRadius:8,
    padding:16,
  },
  bloodTypeContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  requestInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateTime: {
    fontSize: 12,
    color: colors.success,
    marginLeft: 4,
  },
  clockIcon: {
    marginLeft: 8,
  },
  daysContainer: {
    backgroundColor: "#F6EAEA",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  daysText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
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
    marginBottom: 10,
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
  loaderContainer: {
    padding: 16,
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 25,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    marginBottom: 10,
  },
  emptyOngoingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyOngoingText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  ongoingScrollContainer: {
    // padding: 16,
    gap:10
  },
  ongoingItemContainer: {
    marginRight: 0,
    gap:10
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  roleText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 8,
  },
  refreshButton: {
    padding: 4,
  },
});

export default HomeScreen; 
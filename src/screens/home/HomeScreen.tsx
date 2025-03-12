import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { HomeScreenProps } from '../../navigation/types';
import FilterModal from '../../components/FilterModal';

// Mock data for blood requests
const BLOOD_REQUESTS = [
  {
    id: '1',
    hospital: 'Lab Aid Hospital',
    location: 'Mirpur, Dhaka',
    bloodType: 'A+',
    date: '10/05/2023',
    time: '11:00 AM',
    daysAgo: 3,
  },
  {
    id: '2',
    hospital: 'Lab Aid Hospital',
    location: 'Mirpur, Dhaka',
    bloodType: 'AB+',
    date: '10/05/2023',
    time: '11:00 AM',
    daysAgo: 3,
  },
  {
    id: '3',
    hospital: 'Lab Aid Hospital',
    location: 'Mirpur, Dhaka',
    bloodType: 'O-',
    date: '10/05/2023',
    time: '11:00 AM',
    daysAgo: 3,
  },
  {
    id: '4',
    hospital: 'Lab Aid Hospital',
    location: 'Mirpur, Dhaka',
    bloodType: 'A+',
    date: '10/05/2023',
    time: '11:00 AM',
    daysAgo: 3,
  },
];

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
        <Text style={styles.daysText}>{item.daysAgo} Day</Text>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('All Request');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState(BLOOD_REQUESTS);
  const [selectedFilters, setSelectedFilters] = useState({
    bloodGroup: '',
    zone: '',
  });

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleApplyFilter = (bloodGroup: string, zone: string) => {
    setSelectedFilters({ bloodGroup, zone });
    
    // Apply filters
    let filtered = [...BLOOD_REQUESTS];
    
    if (bloodGroup) {
      filtered = filtered.filter(request => request.bloodType === bloodGroup);
    }
    
    if (zone) {
      filtered = filtered.filter(request => request.location.includes(zone));
    }
    
    setFilteredRequests(filtered);
  };

  const handleRequestPress = (item: typeof BLOOD_REQUESTS[0]) => {
    // Use getRootNavigation to navigate to screens outside the tab navigator
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.navigate('RequestDetail', { request: item });
    }
  };

  const handleClearFilter = () => {
    setSelectedFilters({ bloodGroup: '', zone: '' });
    setFilteredRequests(BLOOD_REQUESTS);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity>
            <Icon name="menu" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Icon name="bell-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Current Hospital */}
      <View style={styles.myRequestedBloodContainer}>
      <Text style={styles.requestedBloodTitle}>Your Requested Blood</Text>
      <View style={styles.currentHospital}>
        <BloodTypeIcon bloodType="A+" />
        <View style={styles.hospitalInfo}>
          <Text style={styles.hospitalName}>Lab Aid Hospital</Text>
          <Text style={styles.location}>Mirpur, Dhaka</Text>
        </View>
        <View style={styles.notificationCount}>
          <Icon name="eye-outline" size={20} color={colors.info} />
          <Text style={styles.notificationText}>22</Text>
        </View>
      </View>
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
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RequestItem 
            item={item} 
            onPress={() => handleRequestPress(item)} 
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No blood requests found</Text>
            {(selectedFilters.bloodGroup || selectedFilters.zone) && (
              <TouchableOpacity 
                style={styles.clearAllButton}
                onPress={handleClearFilter}
              >
                <Text style={styles.clearAllText}>Clear Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilter={handleApplyFilter}
        initialBloodGroup={selectedFilters.bloodGroup}
        initialZone={selectedFilters.zone}
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
    paddingBottom: 16,
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
    gap:4,
  },
  notificationText: {
    color: colors.info,
    fontSize: 16,
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
  clearAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 20,
    marginTop: 10,
  },
  clearAllText: {
    color: colors.secondary,
    fontWeight: '500',
  },
});

export default HomeScreen; 
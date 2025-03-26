import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../theme/colors';
import { BloodBankScreenProps } from '../../../navigation/types';
import { bloodBankService, BloodBank } from '../../../services';
import { toast } from '../../../utils/toast';
import zones from '../../../constants/zones';


// Filter options
const FILTER_OPTIONS = ['All', 'Nearby', 'Open Now', 'Highest Rated'];

// Zone options - replaced with import
// const ZONES = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Sylhet', 'Barisal', 'Rangpur'];

// District options - simplified to only include Dhaka
const DISTRICTS = ['Dhaka'];

// Mock user location (Dhaka city center coordinates)
const MOCK_USER_LOCATION = {
  lat: 23.8103,
  lng: 90.4125
};

const BloodBankItem = ({ item, onPress }: { item: BloodBank, onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.bloodBankItem} onPress={onPress}>
      <View style={styles.bloodBankInfo}>
        <Text style={styles.bloodBankName}>{item.name}</Text>
        <Text style={styles.bloodBankLocation}>{item.location} • <Text style={{color: colors.info}}>{item.distance}</Text></Text>
      </View>
      <Icon name="chevron-right" size={24} color={colors.textLight} />
    </TouchableOpacity>
  );
};

const FilterModal = ({ 
  visible, 
  onClose, 
  onApply 
}: { 
  visible: boolean, 
  onClose: () => void, 
  onApply: (zone: string, district: string) => void 
}) => {
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhaka'); // Default to Dhaka
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);

  const handleApply = () => {
    onApply(selectedZone, selectedDistrict);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Blood Banks</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          {/* Zone Selector */}
          <Text style={styles.sectionTitle}>Select Zone</Text>
          <TouchableOpacity 
            style={styles.selectorButton}
            onPress={() => {
              setShowZoneDropdown(!showZoneDropdown);
            }}
          >
            <Text style={selectedZone ? styles.selectedText : styles.placeholderText}>
              {selectedZone ? zones.find(z => z.value === selectedZone)?.label || selectedZone : 'Select Zone'}
            </Text>
            <Icon name="chevron-down" size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          {showZoneDropdown && (
            <ScrollView style={styles.dropdownScrollContainer} nestedScrollEnabled={true}>
              <View style={styles.dropdownContainer}>
                {zones.map((zone) => (
                  <TouchableOpacity 
                    key={zone.value} 
                    style={[
                      styles.dropdownItem,
                      selectedZone === zone.value && styles.selectedDropdownItem
                    ]}
                    onPress={() => {
                      setSelectedZone(zone.value);
                      setShowZoneDropdown(false);
                    }}
                  >
                    <Text 
                      style={[
                        styles.dropdownItemText,
                        selectedZone === zone.value && styles.selectedDropdownItemText
                      ]}
                    >
                      {zone.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {/* District Selector - simplified to only show Dhaka */}
          <Text style={styles.sectionTitle}>District</Text>
          <View style={styles.selectorButton}>
            <Text style={styles.selectedText}>Dhaka</Text>
          </View>

          {/* Apply Button */}
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>Apply Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const BloodBankScreen: React.FC<BloodBankScreenProps> = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [filteredBanks, setFilteredBanks] = useState<BloodBank[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch blood banks on component mount
  useEffect(() => {
    fetchBloodBanks();
  }, []);

  // Fetch blood banks
  const fetchBloodBanks = async (refresh = false) => {
    try {
      if (refresh) {
        setPage(1);
        setHasMore(true);
      }

      if (!hasMore && !refresh) return;

      setLoading(true);
      setError(null);

      const currentPage = refresh ? 1 : page;
      
      try {
        // Use mock location (Dhaka city center)
        const response = await bloodBankService.getBloodBanks(
          selectedZone,
          selectedDistrict,
          currentPage,
          10,
          MOCK_USER_LOCATION.lat,
          MOCK_USER_LOCATION.lng
        );

        const newBanks = response.bloodBanks;
        
        if (refresh) {
          setBloodBanks(newBanks);
          setFilteredBanks(newBanks);
        } else {
          setBloodBanks(prev => [...prev, ...newBanks]);
          setFilteredBanks(prev => [...prev, ...newBanks]);
        }

        // Check if there are more pages
        setHasMore(currentPage < response.pagination.pages);
        setPage(currentPage + 1);
      } catch (error) {

        throw error;
      }
    } catch (error) {
      console.error('Failed to fetch blood banks:', error);
      setError('Failed to load blood banks. Please try again.');

    } finally {
      setLoading(false);
    }
  };

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleApplyFilter = (zone: string, district: string) => {
    setSelectedZone(zone);
    setSelectedDistrict(district);
    setFilterModalVisible(false);
    
    // Reset pagination
    setPage(1);
    setHasMore(true);
    
    // Fetch filtered blood banks
    fetchBloodBanks(true);
  };

  const handleBankPress = (item: BloodBank) => {
    // Navigate to blood bank detail screen using the parent navigation
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.navigate('BloodBankDetail', { 
        bloodBank: item
      });
    }
  };

  const handleRefresh = () => {
    fetchBloodBanks(true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchBloodBanks();
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
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
        <Text style={styles.headerTitle}>Blood Banks</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Filter Area */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>All</Text>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={handleFilterPress}
        >
          <Icon name="filter-variant" size={20} color={colors.primary} />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Blood Bank List */}
      <FlatList
        data={filteredBanks.length > 0 ? filteredBanks : []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BloodBankItem 
            item={item} 
            onPress={() => handleBankPress(item)} 
          />
        )}
        contentContainerStyle={styles.listContainer}
        refreshing={loading && page === 1}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {error || 'No blood banks found'}
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
        }
      />

      {/* Filter Modal */}
      <FilterModal 
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilter}
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
    paddingVertical: 14,
    borderBottomWidth: 0,
  },
  backButton: {
    padding: 4,
    width: 32,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  headerRight: {
    width: 32,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 4,
  },
  listContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginHorizontal: 20,
    marginVertical: 10,
    gap: 8,
  },
  bloodBankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    backgroundColor: colors.background,
    borderRadius: 10, 
  },
  bloodBankInfo: {
    flex: 1,
  },
  bloodBankName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  bloodBankLocation: {
    fontSize: 14,
    color: colors.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
  },
  retryButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  selectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: colors.background,
  },
  placeholderText: {
    color: colors.textLight,
    fontSize: 16,
  },
  selectedText: {
    color: colors.text,
    fontSize: 16,
  },
  dropdownScrollContainer: {
    maxHeight: 250,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginTop: -16,
    marginBottom: 16,
    backgroundColor: colors.background,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedDropdownItem: {
    backgroundColor: 'rgba(198, 40, 40, 0.1)',
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedDropdownItemText: {
    color: colors.primary,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  loaderContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BloodBankScreen; 
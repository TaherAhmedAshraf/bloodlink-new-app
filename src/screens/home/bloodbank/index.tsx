import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../theme/colors';
import { BloodBankScreenProps } from '../../../navigation/types';

// Mock data for blood banks
const BLOOD_BANKS = [
  {
    id: '1',
    name: 'Badhan Blood Bank',
    location: 'Gulshan, Dhaka',
    distance: '2.1 km',
  },
  {
    id: '2',
    name: 'Bangladesh Thalassemia Foundation',
    location: 'Dhanmondi, Dhaka',
    distance: '4.5 km',
  },
  {
    id: '3',
    name: 'Sandhani Blood Bank',
    location: 'Mirpur, Dhaka',
    distance: '3.2 km',
  },
  {
    id: '4',
    name: 'Red Crescent Blood Bank',
    location: 'Mohammadpur, Dhaka',
    distance: '5.8 km',
  },
  {
    id: '5',
    name: 'Quantum Blood Bank',
    location: 'Uttara, Dhaka',
    distance: '7.3 km',
  },
];

// Filter options
const FILTER_OPTIONS = ['All', 'Nearby', 'Open Now', 'Highest Rated'];

// Zone options
const ZONES = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Sylhet', 'Barisal', 'Rangpur'];

// District options
const DISTRICTS = ['Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Narsingdi'];

const BloodBankItem = ({ item, onPress }: { item: typeof BLOOD_BANKS[0], onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.bloodBankItem} onPress={onPress}>
      <View style={styles.bloodBankInfo}>
        <Text style={styles.bloodBankName}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Text style={styles.location}>{item.location.split(',')[0]}</Text>
        </View>
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
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);

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
          {/* Zone Selector */}
          <TouchableOpacity 
            style={styles.selectorButton}
            onPress={() => {
              setShowZoneDropdown(!showZoneDropdown);
              setShowDistrictDropdown(false);
            }}
          >
            <Text style={selectedZone ? styles.selectedText : styles.placeholderText}>
              {selectedZone || 'Select Zone'}
            </Text>
            <Icon name="chevron-down" size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          {showZoneDropdown && (
            <View style={styles.dropdownContainer}>
              {ZONES.map((zone) => (
                <TouchableOpacity 
                  key={zone} 
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedZone(zone);
                    setShowZoneDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{zone}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* District Selector */}
          <TouchableOpacity 
            style={styles.selectorButton}
            onPress={() => {
              setShowDistrictDropdown(!showDistrictDropdown);
              setShowZoneDropdown(false);
            }}
          >
            <Text style={selectedDistrict ? styles.selectedText : styles.placeholderText}>
              {selectedDistrict || 'Select District'}
            </Text>
            <Icon name="chevron-down" size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          {showDistrictDropdown && (
            <View style={styles.dropdownContainer}>
              {DISTRICTS.map((district) => (
                <TouchableOpacity 
                  key={district} 
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedDistrict(district);
                    setShowDistrictDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{district}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Apply Button */}
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>Use</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const BloodBankScreen: React.FC<BloodBankScreenProps> = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [filteredBanks, setFilteredBanks] = useState(BLOOD_BANKS);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleApplyFilter = (zone: string, district: string) => {
    setSelectedZone(zone);
    setSelectedDistrict(district);
    
    // Apply filtering logic based on zone and district
    let filtered = [...BLOOD_BANKS];
    
    if (zone) {
      filtered = filtered.filter(bank => 
        bank.location.includes(zone)
      );
    }
    
    if (district) {
      filtered = filtered.filter(bank => 
        bank.location.includes(district)
      );
    }
    
    setFilteredBanks(filtered);
  };

  const handleBankPress = (item: typeof BLOOD_BANKS[0]) => {
    // Navigate to blood bank detail screen using the parent navigation
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.navigate('BloodBankDetail', { 
        bloodBank: {
          ...item,
          hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-3PM',
          bloodNeeded: 'A+ Blood Needed'
        } 
      });
    }
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

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterTab, selectedFilter === 'All' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('All')}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={handleFilterPress}
        >
          <Icon name="filter-variant" size={20} color={colors.primary} />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Blood Banks List */}
      <FlatList
        data={filteredBanks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BloodBankItem 
            item={item} 
            onPress={() => handleBankPress(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No blood banks found</Text>
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterTab: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  activeFilterTab: {
    borderBottomWidth: 0,
    borderBottomColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 4,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },
  bloodBankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 0.5,
    borderColor: colors.border,
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: colors.textLight,
  },
  dotSeparator: {
    fontSize: 14,
    color: colors.textLight,
    marginHorizontal: 4,
  },
  distance: {
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
  dropdownContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginTop: -16,
    marginBottom: 16,
    backgroundColor: colors.background,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.text,
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  applyButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BloodBankScreen; 
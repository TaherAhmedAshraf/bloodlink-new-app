import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../theme/colors';
import { BloodBankScreenProps } from '../../../navigation/types';

// Mock data for blood banks
const BLOOD_BANKS = [
  {
    id: '1',
    name: 'Lab Aid Blood Bank',
    location: 'Mirpur, Dhaka',
    phone: '+880 1712345678',
    distance: '2.5 km',
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Red Crescent Blood Bank',
    location: 'Mohammadpur, Dhaka',
    phone: '+880 1712345679',
    distance: '3.8 km',
    rating: 4.2,
  },
  {
    id: '3',
    name: 'Sandhani Blood Bank',
    location: 'Dhanmondi, Dhaka',
    phone: '+880 1712345680',
    distance: '5.1 km',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Quantum Blood Bank',
    location: 'Uttara, Dhaka',
    phone: '+880 1712345681',
    distance: '7.3 km',
    rating: 4.0,
  },
  {
    id: '5',
    name: 'Popular Blood Bank',
    location: 'Gulshan, Dhaka',
    phone: '+880 1712345682',
    distance: '8.5 km',
    rating: 4.3,
  },
];

const BloodBankItem = ({ item }: { item: typeof BLOOD_BANKS[0] }) => {
  return (
    <View style={styles.bloodBankItem}>
      <View style={styles.bloodBankInfo}>
        <Text style={styles.bloodBankName}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Icon name="map-marker" size={16} color={colors.textLight} />
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Icon name="phone" size={14} color={colors.textLight} />
            <Text style={styles.detailText}>{item.phone}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="map-marker-distance" size={14} color={colors.textLight} />
            <Text style={styles.detailText}>{item.distance}</Text>
          </View>
        </View>
      </View>
      <View style={styles.ratingContainer}>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Icon name="star" size={12} color="#FFD700" />
        </View>
        <TouchableOpacity style={styles.callButton}>
          <Icon name="phone" size={20} color={colors.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BloodBankScreen: React.FC<BloodBankScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBanks, setFilteredBanks] = useState(BLOOD_BANKS);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredBanks(BLOOD_BANKS);
    } else {
      const filtered = BLOOD_BANKS.filter(
        (bank) =>
          bank.name.toLowerCase().includes(text.toLowerCase()) ||
          bank.location.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredBanks(filtered);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Blood Banks</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search blood banks..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Icon name="close" size={20} color={colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Blood Banks List */}
      <FlatList
        data={filteredBanks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BloodBankItem item={item} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No blood banks found</Text>
          </View>
        }
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
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  bloodBankItem: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: colors.secondary,
  },
  bloodBankInfo: {
    flex: 1,
  },
  bloodBankName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  ratingContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 2,
  },
  callButton: {
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default BloodBankScreen; 
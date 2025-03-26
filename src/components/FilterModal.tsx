import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../theme/colors';
import Button from './Button';
import zones from '../constants/zones';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilter: (bloodGroup: string, zone: string) => void;
  initialBloodGroup?: string;
  initialZone?: string;
}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
// const zones = ['Mirpur', 'Dhanmondi', 'Gulshan', 'Uttara', 'Mohammadpur', 'Banani'];

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilter,
  initialBloodGroup = '',
  initialZone = '',
}) => {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>(initialBloodGroup);
  const [selectedZone, setSelectedZone] = useState<string>(initialZone);
  const [zoneDropdownOpen, setZoneDropdownOpen] = useState<boolean>(false);

  // Update state when props change
  useEffect(() => {
    if (visible) {
      setSelectedBloodGroup(initialBloodGroup);
      setSelectedZone(initialZone);
    }
  }, [visible, initialBloodGroup, initialZone]);

  const handleBloodGroupSelect = (bloodGroup: string) => {
    setSelectedBloodGroup(bloodGroup === selectedBloodGroup ? '' : bloodGroup);
  };

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone);
    setZoneDropdownOpen(false);
  };

  const handleApplyFilter = () => {
    onApplyFilter(selectedBloodGroup, selectedZone);
    onClose();
  };

  const handleClearAll = () => {
    setSelectedBloodGroup('');
    setSelectedZone('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              {/* Header with Clear All */}
              {(selectedBloodGroup || selectedZone) && (
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={handleClearAll}>
                    <Text style={styles.clearAllText}>Clear All</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Zone Selector */}
              <View style={styles.selectorContainer}>
                <TouchableOpacity 
                  style={styles.zoneSelector} 
                  onPress={() => setZoneDropdownOpen(!zoneDropdownOpen)}
                >
                  <Text style={styles.zoneSelectorText}>
                    {selectedZone || 'Select Zone'}
                  </Text>
                  <Icon 
                    name={zoneDropdownOpen ? 'chevron-up' : 'chevron-down'} 
                    size={24} 
                    color={colors.text} 
                  />
                </TouchableOpacity>
                
                {zoneDropdownOpen && (
                  <ScrollView style={styles.dropdownContainer}>
                    {zones.map((zone) => (
                      <TouchableOpacity
                        key={zone.value}
                        style={[
                          styles.dropdownItem,
                          selectedZone === zone.value && styles.selectedDropdownItem
                        ]}
                        onPress={() => handleZoneSelect(zone.value)}
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
                  </ScrollView>
                )}
              </View>

              {/* Blood Group Selector */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Select Blood Group</Text>
                <View style={styles.bloodGroupContainer}>
                  {bloodGroups.map((bloodGroup) => (
                    <TouchableOpacity
                      key={bloodGroup}
                      style={[
                        styles.bloodGroupItem,
                        selectedBloodGroup === bloodGroup && styles.selectedBloodGroup,
                      ]}
                      onPress={() => handleBloodGroupSelect(bloodGroup)}
                    >
                      <Text
                        style={[
                          styles.bloodGroupText,
                          selectedBloodGroup === bloodGroup && styles.selectedBloodGroupText,
                        ]}
                      >
                        {bloodGroup}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Apply Button */}
              <Button
                title="Use"
                onPress={handleApplyFilter}
                style={styles.applyButton}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  clearAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  selectorContainer: {
    marginBottom: 20,
  },
  zoneSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.background,
  },
  zoneSelectorText: {
    fontSize: 16,
    color: colors.text,
  },
  dropdownContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: colors.background,
  },
  dropdownItem: {
    padding: 12,
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
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  bloodGroupContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bloodGroupItem: {
    width: '22%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 100,
    marginBottom: 15,
    backgroundColor: colors.background,
  },
  selectedBloodGroup: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  bloodGroupText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  selectedBloodGroupText: {
    color: colors.secondary,
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
});

export default FilterModal; 
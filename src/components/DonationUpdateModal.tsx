import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../theme/colors';
import { navigate } from '../navigation/navigationRef';

interface DonationUpdateModalProps {
  visible: boolean;
  onClose?: () => void;
}

const DonationUpdateModal: React.FC<DonationUpdateModalProps> = ({
  visible,
  onClose
}) => {
  const handleUpdateDonation = () => {
    if (onClose) {
      onClose();
    }
    
    // Navigate to donation update screen
    setTimeout(() => {
      navigate('DonationUpdate');
    }, 300);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Icon name="alert-circle-outline" size={60} color={colors.warning} />
              <Text style={styles.title}>Donation Information Required</Text>
              <Text style={styles.message}>
                Before accepting a blood request, you need to update your donation information including your last donation date and current hemoglobin level.
              </Text>

              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateDonation}
              >
                <Text style={styles.updateButtonText}>Update Donation Info</Text>
              </TouchableOpacity>

              {onClose && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width - 40,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  updateButton: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  updateButtonText: {
    color: colors.secondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.textLight,
    fontSize: 16,
  },
});

export default DonationUpdateModal; 
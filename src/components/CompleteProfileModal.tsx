import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../theme/colors';
import { navigationRef } from '../navigation/navigationRef';

interface CompleteProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onCompleteProfile: () => void;
}

const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  visible,
  onClose,
  onCompleteProfile,
}) => {
  const handleCompleteProfile = () => {
    // Close the modal
    onClose();
    
    // Navigate to edit profile using the navigationRef
    // This bypasses the need for the useNavigation hook
    setTimeout(() => {
      if (navigationRef.current) {
        navigationRef.current.navigate('EditProfile');
      }
      
      // Also call the passed in callback as a fallback
      onCompleteProfile();
    }, 100);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.modalContainer}>
              <View style={styles.iconContainer}>
                <Icon name="account-alert" size={50} color={colors.warning} />
              </View>
              
              <Text style={styles.title}>Complete Your Profile</Text>
              
              <Text style={styles.message}>
                To continue using BloodLink, you need to complete your profile with mandatory information like name, blood group, and address.
              </Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={handleCompleteProfile}
                >
                  <Text style={styles.completeButtonText}>Complete Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  completeButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CompleteProfileModal; 
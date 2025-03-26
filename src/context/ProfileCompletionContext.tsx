import React, { createContext, ReactNode, useContext } from 'react';
import useProfileCompletion from '../hooks/useProfileCompletion';
import CompleteProfileModal from '../components/CompleteProfileModal';

type ProfileCompletionContextType = {
  isProfileComplete: boolean;
  loading: boolean;
  checkProfileCompletion: () => Promise<void>;
  showModal?: boolean;
  setShowModal?: (show: boolean) => void;
};

const ProfileCompletionContext = createContext<ProfileCompletionContextType>({
  isProfileComplete: true,
  loading: false,
  checkProfileCompletion: async () => {},
});

export const useProfileCompletionContext = () => useContext(ProfileCompletionContext);

interface ProfileCompletionProviderProps {
  children: ReactNode;
}

export const ProfileCompletionProvider: React.FC<ProfileCompletionProviderProps> = ({ children }) => {
  const { 
    isProfileComplete, 
    loading, 
    showModal, 
    setShowModal, 
    checkProfileCompletion 
  } = useProfileCompletion();

  const handleNavigateToEditProfile = () => {
    // Close the modal first
    setShowModal(false);
    
    // Wait for next tick before attempting navigation
    setTimeout(() => {
      // The actual navigation will be handled in the components that use this context
      // We'll just trigger a profile check which will show incomplete status
      checkProfileCompletion();
    }, 100);
  };

  return (
    <ProfileCompletionContext.Provider
      value={{
        isProfileComplete,
        loading,
        checkProfileCompletion,
        showModal,
        setShowModal,
      }}
    >
      {children}
      
      <CompleteProfileModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onCompleteProfile={handleNavigateToEditProfile}
      />
    </ProfileCompletionContext.Provider>
  );
};

export default ProfileCompletionProvider; 
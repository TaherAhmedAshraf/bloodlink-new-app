import { useState, useEffect } from 'react';
import { userService, UserProfile } from '../services';
import { useAuth } from '../context/AuthContext';
import { navigationRef } from '../navigation/navigationRef';

export const useProfileCompletion = () => {
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      checkProfileCompletion();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const checkProfileCompletion = async () => {
    try {
      setLoading(true);
      const profile = await userService.getProfile();
      setUserProfile(profile);
      
      // Check if mandatory fields are present
      const isComplete = !!(
        profile.name &&
        profile.bloodType &&
        profile.address
      );
      
      setIsProfileComplete(isComplete);
      
      // Show modal if profile is incomplete, but only if not already on EditProfile page
      if (!isComplete) {
        // Check current route to avoid showing modal on EditProfile page
        const currentRoute = navigationRef.current?.getCurrentRoute()?.name;
        const shouldShowModal = currentRoute !== 'EditProfile';
        
        if (shouldShowModal) {
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error('Error checking profile completion:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    isProfileComplete,
    userProfile,
    loading,
    showModal,
    setShowModal,
    checkProfileCompletion
  };
};

export default useProfileCompletion; 
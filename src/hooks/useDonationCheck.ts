import { useState, useEffect } from 'react';
import { userService, UserProfile } from '../services';
import { useAuth } from '../context/AuthContext';

export const useDonationCheck = () => {
  const [isDonationInfoComplete, setIsDonationInfoComplete] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      checkDonationInfo();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const checkDonationInfo = async () => {
    try {
      setLoading(true);
      const profile = await userService.getProfile();
      setUserProfile(profile);
      
      // Check if donation info fields are present
      const isComplete = !!(
        profile.lastDonation &&
        profile.hemoglobin &&
        profile.gender &&
        profile.age
      );
      
      setIsDonationInfoComplete(isComplete);
    } catch (error) {
      console.error('Error checking donation information:', error);
      setIsDonationInfoComplete(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    isDonationInfoComplete,
    userProfile,
    loading,
    checkDonationInfo
  };
};

export default useDonationCheck; 
import React, { useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useAuth } from './AuthContext';

// Create a global event for session expiration
const SESSION_EXPIRED_EVENT = 'bloodlink:session_expired';

// Function to trigger session expired event
export const triggerSessionExpired = () => {
  DeviceEventEmitter.emit(SESSION_EXPIRED_EVENT);
};

// Component to handle session expiration
export const SessionExpiredHandler: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { logout } = useAuth();

  useEffect(() => {
    // Handle session expired events
    const handleSessionExpired = () => {
      // Logout without showing the toast since apiClient already showed it
      logout(false);
    };

    // Add event listener
    const subscription = DeviceEventEmitter.addListener(
      SESSION_EXPIRED_EVENT,
      handleSessionExpired
    );

    // Cleanup
    return () => {
      subscription.remove();
    };
  }, [logout]);

  return <>{children}</>;
};

export default SessionExpiredHandler; 
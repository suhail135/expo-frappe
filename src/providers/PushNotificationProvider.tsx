import React, { createContext, useContext } from 'react';
import { usePushNotifications, PushNotificationState } from '../hooks/usePushNotifications';
import { useAuth } from '../auth';

const PushNotificationContext = createContext<PushNotificationState | undefined>(undefined);

export function PushNotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pushNotifications = usePushNotifications(isAuthenticated);

  return (
    <PushNotificationContext.Provider value={pushNotifications}>
      {children}
    </PushNotificationContext.Provider>
  );
}

export function usePushNotificationContext() {
  const context = useContext(PushNotificationContext);
  if (context === undefined) {
    throw new Error('usePushNotificationContext must be used within a PushNotificationProvider');
  }
  return context;
}

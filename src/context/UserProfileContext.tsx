import React, { createContext, useContext, useState, ReactNode } from 'react';

// Create a context
const UserProfileContext = createContext<any | undefined>(undefined);

// Provider component
export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<any>(null);

  return (
    <UserProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

// Custom hook for using the UserProfileContext
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

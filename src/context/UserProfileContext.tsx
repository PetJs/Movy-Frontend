import React, { createContext, useContext, useState, ReactNode } from 'react';


// //interface UserProfile {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   pfp: string; // Profile picture URL
// }
// // Create a context
const UserProfileContext = createContext<any | undefined>(undefined);

// Provider component
export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  return (
    <UserProfileContext.Provider value={{ user, setUser }}>
      {children}
    </UserProfileContext.Provider>
  );
};


export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

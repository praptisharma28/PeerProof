import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Listing } from '../types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  listings: Listing[];
  setListings: (listings: Listing[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        listings,
        setListings,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
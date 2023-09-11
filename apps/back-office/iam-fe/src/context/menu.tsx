'use client';

import { MenuItem } from '@megp/core-fe/models/shell';
import { createContext, useContext, useState, ReactNode } from 'react';

// Define the context interface
interface MenuContextType {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

// Create the context
const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Create a custom hook for accessing the context
export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}

// Create the MenuProvider component
interface MenuProviderProps {
  children: ReactNode;
}

export function MenuProvider({ children }: MenuProviderProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // You can initialize menuItems with data based on user roles and permissions here

  return (
    <MenuContext.Provider value={{ menuItems, setMenuItems }}>
      {children}
    </MenuContext.Provider>
  );
}

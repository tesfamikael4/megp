'use client';

import { Menu } from '@/config/menu';
import { Notifications } from '@mantine/notifications';
import { ShellContext } from '@megp/core-fe';
import { ReactNode } from 'react';

interface ShellProviderProps {
  children: ReactNode;
}

export function ShellProvider({ children }: ShellProviderProps) {
  const value = {
    menuItems: Menu,
    currentApplication: 'vendor',
  };
  return (
    <>
      <Notifications />
      <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
    </>
  );
}

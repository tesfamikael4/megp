'use client';

import { Menu } from '@/config/menu';
import { ShellContext } from '@megp/core-fe';
import { ReactNode } from 'react';

interface ShellProviderProps {
  children: ReactNode;
}

export function ShellProvider({ children }: ShellProviderProps) {
  const value = {
    menuItems: Menu,
    currentApplication: 'procurement-requisition',
  };
  return (
    <>
      <ShellContext.Provider value={value}> {children}</ShellContext.Provider>
    </>
  );
}

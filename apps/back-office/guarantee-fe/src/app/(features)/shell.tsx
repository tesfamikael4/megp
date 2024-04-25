'use client';

import { Menu } from '@/config/menu';
import { ShellContext } from '@megp/core-fe';
import { ReactNode } from 'react';
import Protected from './protected';

interface ShellProviderProps {
  children: ReactNode;
}

export function ShellProvider({ children }: ShellProviderProps) {
  const value = {
    menuItems: Menu,
    currentApplication: 'guarantee',
  };
  return (
    <>
      <Protected>
        <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
      </Protected>
    </>
  );
}

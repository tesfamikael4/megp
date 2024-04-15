'use client';

import { Config } from '@/models/config';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Create the context
export const ConfigContext = createContext<Config | undefined>(undefined);

type ConfigProviderProps = {
  children: React.ReactNode;
  config: Config;
};

// Create a context provider component
export const ConfigProvider = ({
  children,
  config,
}: ConfigProviderProps): React.ReactNode => {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};

// Custom hook to access the API URL
export const useConfig = () => {
  const config = useContext(ConfigContext);
  if (config === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return config;
};

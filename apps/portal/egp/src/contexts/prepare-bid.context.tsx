'use client';

import { createContext, useContext } from 'react';

interface PrepareBidContextType {
  tenderId: string;
  password: string;
  documentType: string;
  envelopType: string;
}
export const PrepareBidContext = createContext<PrepareBidContextType | null>(
  null,
);

function PrepareBidProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: PrepareBidContextType | null;
}): JSX.Element {
  return (
    <PrepareBidContext.Provider value={value}>
      {children}
    </PrepareBidContext.Provider>
  );
}

const usePrepareBid = () => {
  const context = useContext(PrepareBidContext);
  if (!context) {
    throw new Error('usePrepareBid must be used within an PrepareBidProvider');
  }
  return context;
};

export { PrepareBidProvider, usePrepareBid };

'use client';
import { useReadQuery } from '@/app/(features)/rfx/_api/rfx/rfx.api';
import { useParams } from 'next/navigation';
import { createContext } from 'react';

export const StatusContext = createContext({
  status: '',
  loading: false,
});

export const StatusProvider = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams();
  const { data, isLoading: isGettingDetail } = useReadQuery(id?.toString());

  return (
    <StatusContext.Provider
      value={{ status: data?.status, loading: isGettingDetail }}
    >
      {children}
    </StatusContext.Provider>
  );
};

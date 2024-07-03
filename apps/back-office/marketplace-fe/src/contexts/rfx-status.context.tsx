'use client';
import { useReadQuery } from '@/app/(features)/rfx/_api/rfx/rfx.api';
import { useParams } from 'next/navigation';
import { createContext } from 'react';
import { RFQ } from '@/models/tender/rfq.model';

type StatusContextType = {
  data?: RFQ;
  status: string;
  loading: boolean;
};

export const StatusContext = createContext<StatusContextType>({
  data: undefined,
  status: '',
  loading: false,
});

export const StatusProvider = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams();
  const { data, isLoading: isGettingDetail } = useReadQuery(id?.toString());

  return (
    <StatusContext.Provider
      value={{ data: data, status: data?.status, loading: isGettingDetail }}
    >
      {children}
    </StatusContext.Provider>
  );
};

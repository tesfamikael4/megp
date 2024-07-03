'use client';
import { useGetRfxQuery } from '../../procurement-notice/_api/rfx.api';
import { useParams } from 'next/navigation';
import { createContext } from 'react';

export const StatusContext = createContext({
  rfx: { isOpen: false, activeRound: { round: 0 } },
  loading: false,
});

export const StatusProvider = ({ children }: { children: React.ReactNode }) => {
  const { rfxId } = useParams();
  const { data, isLoading: isGettingDetail } = useGetRfxQuery({
    id: rfxId?.toString(),
  });

  return (
    <StatusContext.Provider value={{ rfx: data, loading: isGettingDetail }}>
      {children}
    </StatusContext.Provider>
  );
};

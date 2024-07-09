'use client';
import { useReadQuery } from '@/app/(features)/rfx/_api/rfx/rfx.api';
import { useParams } from 'next/navigation';
import { createContext } from 'react';
import { RFQ } from '@/models/tender/rfq.model';
import { useGetCurrentWorkflowInstanceQuery } from '@/store/api/rfx-approval/workflow.api';

type StatusContextType = {
  data?: RFQ;
  currentStep?: any;
  status: string;
  loading: boolean;
};

export const StatusContext = createContext<StatusContextType>({
  data: undefined,
  currentStep: undefined,
  status: '',
  loading: false,
});

export const StatusProvider = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams();
  const { data, isLoading: isGettingDetail } = useReadQuery(id?.toString());
  const { data: currentStep } = useGetCurrentWorkflowInstanceQuery({
    itemId: id?.toString(),
    key: 'RFQEvaluationApproval',
  });

  return (
    <StatusContext.Provider
      value={{
        data: data,
        status: data?.status,
        loading: isGettingDetail,
        currentStep: currentStep,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
};

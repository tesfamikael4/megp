'use client';
import React, { Suspense, useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../_components/notification';
import { useGetVendorQuery } from '../../_api/query';
import { PreferentialTreatmentForm } from '../_components/preferential/formShell';
import { useGetDraftApplicationQuery } from '@/store/api/preferential-treatment/preferential-treatment.api';

function Page() {
  const router = useRouter();
  const { data, isError, isLoading } = useGetVendorQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  if (isLoading) {
    return <LoadingOverlay visible />;
  }
  if (isError) {
    NotificationService.requestErrorNotification('Error on fetching data');
    router.push(`basic`);
  }
  if (!data) {
    router.push(`basic`);
  }
  if (data) {
    return (
      <PreferentialTreatmentForm
        vendorInfo={data.initial}
        initialValues={data}
      />
    );
  }
}

export default Page;

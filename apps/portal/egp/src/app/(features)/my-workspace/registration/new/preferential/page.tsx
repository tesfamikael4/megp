'use client';
import React, { Suspense, useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../_components/notification';
import { useGetVendorQuery } from '../../_api/query';
import { PreferentialTreatmentForm } from '../_components/preferential/formShell';

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
  if (data?.basic.countryOfRegistration !== 'Malawi') router.push(`payment`);
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

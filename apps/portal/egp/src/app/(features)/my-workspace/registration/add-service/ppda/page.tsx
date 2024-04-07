'use client';
import React, { Suspense, useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { NotificationService } from '../../../_components/notification';
import {
  useGetMyDraftServicesQuery,
  useGetVendorInfoQuery,
  useGetVendorQuery,
} from '../../_api/query';
import { AreasOfBusinessInterestForm } from './_components/formShell';

function Page() {
  const searchParams = useSearchParams();

  const router = useRouter();
  const {
    data: vendor,
    isLoading,
    isSuccess,
    isError,
  } = useGetVendorQuery({}, { refetchOnMountOrArgChange: true });
  const { data: myDraftServices } = useGetMyDraftServicesQuery({});
  useEffect(() => {
    if (isError) {
      NotificationService.requestErrorNotification('Error on fetching data');
      // router.push(`basic`);
    }
    return () => {};
  }, [router]);

  return (
    <Suspense>
      <section className="w-full relative">
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        {vendor && isSuccess ? (
          <AreasOfBusinessInterestForm
            vendorInfo={vendor.initial}
            initialValues={{ areasOfBusinessInterest: myDraftServices }}
          />
        ) : (
          <></>
        )}
      </section>
    </Suspense>
  );
}

export default Page;

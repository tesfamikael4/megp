'use client';
import React, { useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useGetVendorQuery } from '../../../_api/query';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { BasicInformation } from './basicInformation';

export default function BasicInformationPage() {
  const requestInfo = useGetVendorQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (requestInfo.error) {
      NotificationService.requestErrorNotification('Error on fetching data');
    }

    return () => {};
  }, [requestInfo.data, requestInfo.error]);

  return (
    <section className="w-full relative">
      <LoadingOverlay
        visible={requestInfo.isLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {requestInfo.data && requestInfo.isSuccess ? (
        <BasicInformation
          defaultValues={{
            name: requestInfo.data.basic.name ?? '',
            businessType: requestInfo.data.basic.businessType ?? '',
            origin: requestInfo.data.basic.origin ?? '',
            tinNumber: requestInfo.data.basic.tinNumber ?? '',
            tinIssuedDate: requestInfo.data.basic.tinIssuedDate ?? '',
          }}
        />
      ) : (
        <BasicInformation
          defaultValues={{
            name: '',
            businessType: '',
            origin: '',
            tinNumber: '',
            tinIssuedDate: '',
          }}
        />
      )}
    </section>
  );
}

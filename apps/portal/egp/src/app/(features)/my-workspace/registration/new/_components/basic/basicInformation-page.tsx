'use client';
import React, { useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useGetVendorQuery } from '../../../_api/query';
import { BasicInformation } from './basicInformation';

export default function BasicInformationPage() {
  const { data, error, isLoading, isSuccess } = useGetVendorQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  return (
    <section className="w-full relative">
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {data && isSuccess ? (
        <BasicInformation
          defaultValues={{
            name: data.basic.name ?? '',
            origin: data.basic.origin ?? '',
            tinNumber: data.basic.tinNumber ?? '',
            tinIssuedDate: data.basic.tinIssuedDate ?? '',
            registrationNumber: data.basic.registrationNumber ?? '',
            registrationIssuedDate: data.basic.registrationIssuedDate ?? '',
          }}
        />
      ) : (
        <BasicInformation
          defaultValues={{
            name: '',
            origin: '',
            tinNumber: '',
            tinIssuedDate: '',
            registrationNumber: '',
            registrationIssuedDate: '',
          }}
        />
      )}
    </section>
  );
}

'use client';
import React, { useEffect } from 'react';
import { Box, LoadingOverlay, MultiSelect } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../_components/notification';
import {
  useGetForRenewalVendorQuery,
  useGetVendorQuery,
} from '../../_api/query';
import { validateApprovedVendorServiceSchema } from '@/shared/schema/venderRenewalSchema';
import ServicesCard from '../_components/ppda/servicesCard';

function Page() {
  const router = useRouter();
  const requestInfo = useGetForRenewalVendorQuery({});

  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification('Error on fetching data');
      router.push(`basic`);
    }

    return () => {};
  }, [requestInfo, router]);

  if (requestInfo.isLoading) {
    return (
      <Box pos="relative" className="w-full min-h-screen">
        <LoadingOverlay
          visible={true}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
      </Box>
    );
  }
  if (requestInfo.isError) {
    return <></>;
  }

  if (
    requestInfo.data &&
    validateApprovedVendorServiceSchema(requestInfo.data).success
  ) {
    return (
      <section className="w-full min-h-screen">
        <ServicesCard servicesData={requestInfo.data} />
      </section>
    );
  }

  return <></>;
}

export default Page;

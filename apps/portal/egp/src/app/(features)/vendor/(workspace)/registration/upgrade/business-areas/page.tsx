'use client';
import React, { useEffect } from 'react';
import { Box, LoadingOverlay, MultiSelect } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../../_components/notification';

import { validateApprovedVendorServiceSchema } from '@/shared/schema/venderRenewalSchema';
import ServicesCard from '../_components/business-areas/service-card';
import { useGetMyApprovedServicesQuery } from '@/store/api/vendor-upgrade/api';

function Page() {
  const router = useRouter();
  const requestInfo = useGetMyApprovedServicesQuery({});

  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification('Error on fetching data');
      router.push(`business-areas`);
    }

    return () => {};
  }, [requestInfo, router]);

  console.log(
    validateApprovedVendorServiceSchema(requestInfo.data).errors,
    requestInfo.data,
  );
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
}

export default Page;

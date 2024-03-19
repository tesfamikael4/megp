'use client';
import React, { useEffect } from 'react';
import { Box, Flex, LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../../_components/notification';
import { validateApprovedVendorServiceSchema } from '@/shared/schema/venderRenewalSchema';
import ServicesCard from '../_components/ppda/servicesCard';
import { IconFile } from '@tabler/icons-react';
import { useGetMyApprovedServicesQuery } from '@/store/api/vendor-upgrade/api';

function Page() {
  const router = useRouter();
  const requestInfo = useGetMyApprovedServicesQuery({});

  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification('Error on fetching data');
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
    return (
      <Flex className="w-full h-full items-center justify-center flex-col">
        <IconFile size={30} />
        No Data Found
      </Flex>
    );
  }

  if (requestInfo.data) {
    return (
      <section className="w-full min-h-screen">
        <ServicesCard servicesData={requestInfo.data} />
      </section>
    );
  }

  return <></>;
}

export default Page;

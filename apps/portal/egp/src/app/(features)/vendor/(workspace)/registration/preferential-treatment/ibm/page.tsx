'use client';
import React, { Suspense, useEffect } from 'react';
import { Box, Divider, Flex, LoadingOverlay, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../../_components/notification';
import { useGetVendorQuery } from '../../_api/query';
import { PreferentialTreatmentForm } from './preferential/formShell';

function Page() {
  const router = useRouter();
  const requestInfo = useGetVendorQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification('Error on fetching data');
      router.push(`basic`);
    }
    return () => {};
  }, [requestInfo, router]);

  return (
    <Suspense>
      <Box className="p-4 bg-[#f7f7f7]">
        <Box className=" w-full p-6 min-h-screen bg-white">
          <Flex direction={'column'} className="w-full py-2 mb-3 ">
            <Text fw={700} fz="xl" c={'#1D8E3F'}>
              Eligibility for Preferential Treatment
            </Text>
            <Text c={'dimmed'} size={'14px'} mt={2}>
              Welcome to My Payments! Here you can manage your payment
              information and view your transaction history.
            </Text>
          </Flex>
          <Divider />
          <section className="w-full relative">
            <LoadingOverlay
              visible={requestInfo.isLoading}
              overlayProps={{ radius: 'sm', blur: 2 }}
            />

            <PreferentialTreatmentForm
              initialValues={{
                preferential: requestInfo?.data?.preferential ?? [],
              }}
            />
          </section>
        </Box>
      </Box>
    </Suspense>
  );
}

export default Page;

'use client';
import React, { Suspense, useEffect } from 'react';
import { Box, Divider, Flex, LoadingOverlay, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../_components/notification';
import {
  useGetApproveVendorInfoQuery,
  useGetApprovedVendorInfoQuery,
  useGetVendorQuery,
} from '../_api/query';
import { PreferentialTreatmentForm } from './preferential/formShell';

function Page() {
  const router = useRouter();
  const { data, isError, isFetching } = useGetApproveVendorInfoQuery({});

  useEffect(() => {
    if (isError) {
      NotificationService.requestErrorNotification('Error on fetching data');
      router.push(`/my-workspace/service`);
    }
    return () => {};
  }, [isError]);

  if (isFetching)
    <LoadingOverlay
      visible={isFetching}
      overlayProps={{ radius: 'sm', blur: 2 }}
    />;
  else if (data?.basic.countryOfRegistration !== 'Malawi')
    router.push(`/my-workspace/service`);
  else
    return (
      <Suspense>
        <Box className="">
          <Box className=" w-full p-4 min-h-screen bg-white">
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
              <PreferentialTreatmentForm
                initialValues={{
                  preferential: [],
                }}
                countryOfRegistration={
                  data?.basic?.countryOfRegistration as string
                }
              />
            </section>
          </Box>
        </Box>
      </Suspense>
    );
}

export default Page;

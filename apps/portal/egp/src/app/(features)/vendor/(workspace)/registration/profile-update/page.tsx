'use client';
import { Flex, LoadingOverlay, Text } from '@mantine/core';
import { IconFile, IconUserCircle } from '@tabler/icons-react';
import { useGetApproveVendorInfoQuery } from './_api/query';
import RegistrationForm from '../_components/detail/formShell';
import { getInitialValues } from '../_utils';
import CardLayout from '../_components/card-layout/card-layout';

export default function Page() {
  const requestInfo = useGetApproveVendorInfoQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  return (
    <section className="w-full relative flex flex-col p-6">
      <CardLayout
        withBorder
        className="w-full"
        header={
          <Flex className="w-full items-center justify-center">
            <IconUserCircle size={28} stroke={1.6} />
            <Text fw={700} fz="xl">
              Vendor Profile
            </Text>
          </Flex>
        }
      >
        <LoadingOverlay
          visible={requestInfo.isLoading}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        {requestInfo.data && requestInfo.isSuccess ? (
          <RegistrationForm
            vendorInfo={requestInfo.data.initial}
            initialValues={getInitialValues(requestInfo.data)}
            disabled={false}
            lockElements={{}}
            isProfileUpdate={true}
          />
        ) : (
          <Flex className="w-full h-full items-center justify-center flex-col">
            <IconFile size={30} />
            No Data Found
          </Flex>
        )}
      </CardLayout>
    </section>
  );
}

'use client';
import { Flex, LoadingOverlay } from '@mantine/core';
import styles from './layout.module.scss';
import PageTitle from '../_components/page-title/title';
import StyledStepper from './_components/stepper/stepper';
import { useGetVendorInfoQuery, useGetVendorQuery } from '../_api/query';
import { useRouter } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError, error } = useGetVendorInfoQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const {
    data: vendor,
    isLoading: vendorLoading,
    isError: isVendorError,
    error: vendorError,
  } = useGetVendorQuery({});
  const router = useRouter();

  if (vendorLoading)
    return (
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
    );
  else if (!data && vendor && vendor.status === 'Approved')
    return (
      <Flex className={styles.main} gap={16}>
        <Flex className="w-full flex-col border border-l-0 bg-white">
          <Flex className="w-full border-b p-3 flex justify-between">
            <PageTitle />
          </Flex>
          <Flex className="py-2 px-3 w-full">{children}</Flex>
        </Flex>
        <Flex className={styles.nav}>
          <StyledStepper />
        </Flex>
      </Flex>
    );
  else router.push('/my-workspace/service');
}

'use client';
import { useEffect } from 'react';
import { useGetVendorInfoQuery } from '../../../_api/query';
import PageTitle from '../../../_components/page-title/title';
import StyledStepper from '../stepper/stepper';
import styles from './layout.module.scss';
import { Box, Flex, LoadingOverlay } from '@mantine/core';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { useRouter } from 'next/navigation';

export default function LayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const requestInfo = useGetVendorInfoQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const validRoutes = ['basic', 'detail', 'ppda', 'payment', 'doc', 'review'];

  useEffect(() => {
    if (requestInfo.isSuccess && requestInfo.data) {
      console.log('level' + validRoutes.includes(requestInfo.data.level));
      if (requestInfo.data.level === 'Completed') {
        router.push('/vendor/registration/track-applications');
      } else if (requestInfo.data.level === 'Submit') {
        router.push('/vendor/registration/track-applications');
      } else if (validRoutes.includes(requestInfo.data.level)) {
        console.log(validRoutes.includes(requestInfo.data.level));

        router.push(`/vendor/registration/new/${requestInfo.data.level}`);
      }
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestInfo.isSuccess, requestInfo.data]);
  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification(
        'Error on fetching vendor information',
      );
      router.prefetch('/vendor/dashboard');
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestInfo.isError]);

  if (requestInfo.isLoading) {
    return (
      <Box pos="relative" className="w-full h-full">
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
      </Box>
    );
  }
  // if (requestInfo.isError) {
  //   return null;
  // }
  return (
    <Flex className={styles.main}>
      <Flex className={styles.nav}>
        <StyledStepper initialStep={requestInfo.data?.level ?? 'basic'} />
      </Flex>
      <Flex className="w-full flex-col">
        <Flex className="w-full border-b p-3">
          <PageTitle />
        </Flex>
        <Flex className="py-2 px-3 w-full">{children}</Flex>
      </Flex>
    </Flex>
  );
}
// vender-work-space-v1

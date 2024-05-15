'use client';

import { Box, Button, Flex, LoadingOverlay } from '@mantine/core';
import {
  PrivilegeContextProvider,
  validRoutes,
} from './_context/privilege-context';
import styles from './layout.module.scss';
import StyledStepper from './_components/stepper/stepper';
import PageTitle from '../_components/page-title/title';
import { useLazyCancelRegistrationQuery } from '@/store/api/vendor_registration/api';
import { usePathname, useRouter } from 'next/navigation';
import { NotificationService } from '../../_components/notification';
import { useGetVendorQuery } from '../_api/query';
import { VendorLevel } from '@/models/vendorRegistration';
import { DeleteButton } from '@/app/(features)/_components/delete-button';

function validRoutesCheck(status, initial) {
  const indexOf = validRoutes.indexOf(status);
  const initialIndex = validRoutes.indexOf(initial);

  if (indexOf === -1 || initialIndex === -1) return false;
  return indexOf > initialIndex;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [cancelRegistration, { isLoading }] = useLazyCancelRegistrationQuery();
  const router = useRouter();
  const pathName = usePathname();

  const vendorInfo = useGetVendorQuery({}, { refetchOnMountOrArgChange: true });
  const onCancel = () => {
    try {
      cancelRegistration({})
        .unwrap()
        .then(() => {
          router.push('/my-workspace/service');
          router.refresh();
          NotificationService.successNotification('Registration Canceled!');
        });
    } catch (exception) {
      console.log(exception);
    }
  };

  const pathname = usePathname();

  if (vendorInfo.isLoading) {
    return (
      <LoadingOverlay
        visible={vendorInfo?.isLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
    );
  }
  if (vendorInfo.isError) {
    return router.push('/my-workspace/dashboard');
  }
  // if (!vendorInfo.data && !validRoutesCheck(vendorInfo.data?.initial?.status, pathname.split('/')[4] as VendorLevel)) {
  //   return router.push('/vendor/registration/new/basic');
  // }
  if (
    vendorInfo.data?.status === 'Approved' ||
    vendorInfo?.data?.status === 'Completed'
  ) {
    return router.push('/my-workspace/service');
  }
  return (
    <PrivilegeContextProvider data={vendorInfo.data} {...vendorInfo}>
      <Flex className={styles.main} gap={16}>
        <Flex className="w-[70%] flex-col border border-l-0 bg-white">
          <Flex className="border-b p-3 flex justify-between">
            <PageTitle />
            {pathname !== '/my-workspace/registration/new/basic' &&
              vendorInfo?.data?.status !== 'Adjustment' && (
                <DeleteButton
                  onDelete={onCancel}
                  buttonName="Cancel"
                  title={`Cancel Vendor Registration`}
                  message={`Are you sure you want to cancel this vendor registration? If you do you will not be able to recover it.`}
                />
              )}
          </Flex>
          <Flex className="py-2 px-3 w-full">{children}</Flex>
        </Flex>
        <Flex className={styles.nav}>
          <StyledStepper data={vendorInfo.data as any} />
        </Flex>
      </Flex>
    </PrivilegeContextProvider>
  );
}

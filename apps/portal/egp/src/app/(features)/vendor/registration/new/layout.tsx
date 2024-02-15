'use client';

import { Button, Flex } from '@mantine/core';
import { PrivilegeContextProvider } from './_context/privilege-context';
import styles from './layout.module.scss';
import StyledStepper from './_components/stepper/stepper';
import PageTitle from '../_components/page-title/title';
import { useLazyCancelRegistrationQuery } from '@/store/api/vendor_registration/api';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../_components/notification';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [cancelRegistration] = useLazyCancelRegistrationQuery();
  const router = useRouter();
  return (
    <PrivilegeContextProvider>
      <Flex className={styles.main} gap={24}>
        <Flex className="w-full flex-col border border-l-0 bg-white">
          <Flex className="w-full border-b p-3 flex justify-between">
            <PageTitle />
            <Button
              bg={'#FA5252'}
              onClick={() => {
                try {
                  cancelRegistration({})
                    .unwrap()
                    .then(() => {
                      router.push('/vendor/service');
                      router.refresh();
                      NotificationService.successNotification(
                        'Registration Canceled!',
                      );
                    });
                } catch (exception) {
                  console.log(exception);
                }
              }}
            >
              Cancel
            </Button>
          </Flex>
          <Flex className="py-2 px-3 w-full">{children}</Flex>
        </Flex>
        <Flex className={styles.nav}>
          <StyledStepper />
        </Flex>
      </Flex>
    </PrivilegeContextProvider>
  );
}

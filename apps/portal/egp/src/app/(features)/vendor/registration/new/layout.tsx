import { Button, Flex } from '@mantine/core';
import { PrivilegeContextProvider } from './_context/privilege-context';
import styles from './layout.module.scss';
import StyledStepper from './_components/stepper/stepper';
import PageTitle from '../_components/page-title/title';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PrivilegeContextProvider>
      <Flex className={styles.main} gap={24}>
        <Flex className="w-full flex-col border border-l-0 bg-white">
          <Flex className="w-full border-b p-3 flex justify-between">
            <PageTitle />
            <Button bg={'#FA5252'}>Cancel</Button>
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

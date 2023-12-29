import { Flex } from '@mantine/core';
import styles from './layout.module.scss';
import PageTitle from '../_components/page-title/title';
import { PrivilegeContextProvider } from '../renewal/_context/privilege-context';
import StyledStepper from './_components/stepper/stepper';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex className={styles.main}>
      <Flex className={styles.nav}>
        <StyledStepper />
      </Flex>
      <Flex className="w-full flex-col border border-l-0">
        <Flex className="w-full border-b p-3">
          <PageTitle />
        </Flex>
        <Flex className="py-2 px-3 w-full">{children}</Flex>
      </Flex>
    </Flex>
  );
}

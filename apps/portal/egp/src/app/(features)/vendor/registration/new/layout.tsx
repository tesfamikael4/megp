import { Flex } from '@mantine/core';
import StyledStepper from './_components/stepper';
import styles from './layout.module.scss';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex className={styles.main}>
      <Flex className={styles.nav}>
        <StyledStepper />
      </Flex>
      <Flex className="p-4 w-full">
        <Flex>{children}</Flex>
      </Flex>
    </Flex>
  );
}
//

'use client';

import styles from './layout.module.scss';
import { Flex } from '@mantine/core';
import Image from 'next/image';
import SuperToken from './supertoken';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className={styles.bod} suppressHydrationWarning={true}>
      {children}
      <Flex className={styles.footer_wrapper}>
        <p className={styles.footer_text}>
          Copyright &copy; 2023, Procurement and Disposal of Assets Authority.
          All Rights Reserved.
        </p>
        <Flex className={styles.footer}>
          <p className={styles.footer_text}>Powered by: </p>
          <Image
            src="/perago.png"
            width={80}
            height={30}
            alt="logo"
            className={styles.image}
          />
        </Flex>
      </Flex>
    </section>
  );
}

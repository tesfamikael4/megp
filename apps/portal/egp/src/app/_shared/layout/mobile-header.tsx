'use client';

import { useDisclosure } from '@mantine/hooks';
import { Burger, Box, Drawer } from '@mantine/core';
import Link from 'next/link';
import styles from './page.module.scss';
import Image from 'next/image';
import { doesTokenExist } from '@/app/auth/checkToken';
import { clearToken } from '@/app/auth/clearToken';
import { useRouter } from 'next/navigation';

export const MobileHeader = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const router = useRouter();
  const label = opened ? 'Close navigation' : 'Open navigation';
  return (
    <Box className="block md:hidden">
      <Burger opened={opened} onClick={toggle} aria-label={label} />
      <Drawer.Root opened={opened} onClose={toggle}>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header className="border-b">
            <Drawer.Title>
              <Image src="/ppda.png" alt="logo" width="50" height="15" />
            </Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            <ul className={styles.navLinks} onClick={toggle}>
              <li className={styles.navLink}>
                <Link href="/">Home</Link>
              </li>
              <li className={styles.navLink}>
                <Link href="/egp/bids/all">Tenders</Link>
              </li>
              <li className={styles.navLink}>
                <Link href="/egp/cms">Procurement Information</Link>
              </li>
              <li className={styles.navLink}>
                <Link href="/vendor/dashboard">Registration Service</Link>
              </li>
              <li className={styles.navLink}>
                <Link href="/egp/vendors">Vendor List</Link>
              </li>
              <li className={styles.navLink}>
                <Link href="/egp/resources">Resources</Link>
              </li>
              <li className={styles.navLink}>
                <Link href="/egp/cms/help">Help Center</Link>
              </li>
              <li className={styles.navLink}>
                <Link href="/egp/cms/faq">FAQs</Link>
              </li>
              {doesTokenExist() && (
                <li
                  onClick={() => {
                    clearToken();
                    router.refresh();
                  }}
                  className={styles.navLink}
                >
                  Logout
                </li>
              )}
              {!doesTokenExist() && (
                <>
                  <li className={styles.navLink}>
                    <Link href="/auth/login" passHref>
                      Sign In
                    </Link>
                  </li>
                  <li className={styles.navLink}>
                    <Link href="/auth/signup" passHref>
                      Create Account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </Box>
  );
};

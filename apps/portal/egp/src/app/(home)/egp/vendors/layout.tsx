'use client';

import { navLinks } from './_shared/config';
import { AppShell, Button, Card, Flex, Text } from '@mantine/core';
import style from './layout.module.scss';
import { Navbar } from './_shared/components/navbar/Navbar';
import { Notifications } from '@mantine/notifications';
import { useDisplayNameFinder } from './_shared/lib/url/helper';
import { useEffect } from 'react';
import { doesTokenExist } from '@/app/auth/checkToken';
import { redirect, usePathname } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
interface Props {
  children: React.ReactNode;
}

export default function VendorLayout({ children }: Props) {
  const [opened] = useDisclosure();
  const path = usePathname();

  useEffect(() => {
    if (doesTokenExist()) {
      redirect('/auth/login');
    }
    return () => {};
  }, []);

  return (
    <AppShell
      header={{ height: 0 }}
      navbar={{
        width: '16rem',
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      classNames={{
        root: style.appShellroot,
      }}
    >
      <AppShell.Navbar className={style.appShellNavBar}>
        <Navbar data={navLinks} />
      </AppShell.Navbar>

      <AppShell.Main className={style.appShellmain}>
        <Notifications />
        <Card>
          <Card.Section>
            <Flex className="flex-row items-center justify-between border-b-2 py-3 px-6">
              <Text size={'xl'} className={style.appShellChildrenCardHeader}>
                {useDisplayNameFinder(navLinks)}
              </Text>
              {}
              <Button
                onClick={() =>
                  document.getElementById('res-big-form-submit')?.click()
                }
              >
                Submit
              </Button>
            </Flex>
          </Card.Section>
          <Card.Section>{children}</Card.Section>
        </Card>
      </AppShell.Main>
    </AppShell>
  );
}

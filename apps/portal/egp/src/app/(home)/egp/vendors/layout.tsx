'use client';

import { navLinks } from './_shared/config';
import { AppShell, Card, Text } from '@mantine/core';
import style from './layout.module.scss';
import { Navbar } from './_shared/components/navbar/Navbar';
import { Notifications } from '@mantine/notifications';
import { useDisplayNameFinder } from './_shared/lib/url/helper';

interface Props {
  children: React.ReactNode;
}

export default function VendorLayout({ children }: Props) {
  return (
    <AppShell
      classNames={{
        root: style.appShellroot,
        main: style.appShellmain,
      }}
      navbar={<Navbar data={navLinks} />}
      navbarOffsetBreakpoint="md"
      header={<></>}
    >
      <Notifications />
      <Card>
        <Card.Section withBorder inheritPadding py="sm">
          <Text size={'xl'} className={style.appShellChildrenCardHeader}>
            {useDisplayNameFinder(navLinks)}
          </Text>
        </Card.Section>
        <Card.Section withBorder inheritPadding py="sm">
          {children}
        </Card.Section>
      </Card>
    </AppShell>
  );
}

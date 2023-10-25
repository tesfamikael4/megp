'use client';
import React from 'react';
import styles from './header.module.scss';
import Link from 'next/link';
import Image from 'next/image';

import {
  Menu,
  Group,
  Center,
  Burger,
  Container,
  Drawer,
  Box,
  Button,
  Collapse,
  Divider,
  ScrollArea,
  UnstyledButton,
  rem,
  Flex,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { theme } from '@/utilities/theme';
const links = [
  { link: '/home', label: 'Home' },

  { link: '/tenders', label: 'Tender' },

  {
    link: '#more',
    label: 'More',
    links: [
      { link: '/faq', label: 'FAQ' },
      { link: '/resources', label: 'Resources' },
      { link: '/about-us', label: 'About E-gp' },
    ],
  },
];
function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <a
              href={link.link}
              className={styles.link}
              onClick={(event) => event.preventDefault()}
            >
              <Center>
                <span className={styles.linkLabel}>{link.label}</span>
                <IconChevronDown size="0.9rem" stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <a
        key={link.label}
        href={link.link}
        className={styles.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </a>
    );
  });

  return (
    <header className={styles.header}>
      <div className="container mx-auto">
        <div className={styles.inner}>
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            size="sm"
            hiddenFrom="sm"
            mr="lg"
          />
          <Image src="/ppda.png" alt="logo" width="50" height="15" />
          <Flex justify="space-between" w="100%" ml="xl">
            <Group gap={5} visibleFrom="sm">
              {items}
            </Group>
            <Group visibleFrom="sm">
              <Button component={Link} href="/auth/login">
                Sign in
              </Button>
              <Button component={Link} variant="outline" href="/auth/signup">
                Create Account
              </Button>
            </Group>
          </Flex>
        </div>
      </div>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          {items}

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </header>
  );
}

export default Header;

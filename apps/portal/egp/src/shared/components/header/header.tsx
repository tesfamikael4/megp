'use client';
import styles from './header.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
  Menu,
  Group,
  Center,
  Burger,
  Drawer,
  Button,
  Divider,
  ScrollArea,
  rem,
  Flex,
  Text,
  Container,
  Avatar,
  ActionIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBellRinging,
  IconChevronDown,
  IconLogout,
  IconUserCircle,
} from '@tabler/icons-react';
import { useAuth } from '@megp/auth';
import { usePathname, useRouter } from 'next/navigation';
import { IconSearch } from '@tabler/icons-react';
import LogoIcon from './logo-icon';

function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const [userInfo, setUserInfo] = useState<any>(undefined);
  const [userInfoLoading, setIsUserInfoLoading] = useState(false);
  const { getUserInfo, isAuthenticated, logOut, user } = useAuth();
  const router = useRouter();
  const currentPath = usePathname();

  const workspace = isAuthenticated
    ? [{ link: '/vendor/dashboard', label: 'Workspace' }]
    : [];

  const links: {
    link: string;
    label: string;
    links?: { link: string; label: string }[];
  }[] = [
    { link: '/', label: 'Home' },

    { link: '/vendor/tender', label: 'Procurement Notices' },
    { link: '/vendor/plans', label: 'Plans' },
    { link: '/vendor/contracts', label: 'Contracts' },
    { link: '/vendor/data', label: 'Data' },

    {
      link: '#more',
      label: 'More',
      links: [
        { link: '/resources', label: 'Vendor Registration' },
        { link: '/about-us', label: 'Registered Vendors' },
        { link: '/about-us', label: 'Procurement Information' },
        { link: '/faq', label: 'FAQ' },
        { link: '/resources', label: 'Resources' },
        { link: '/about-us', label: 'About E-gp' },
      ],
    },
    ...workspace,
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        try {
          setIsUserInfoLoading(true);
          const userInfo = await getUserInfo();
          if (!userInfo) {
            return;
          }
          setUserInfo(userInfo);
        } catch (err) {
        } finally {
          setIsUserInfoLoading(false);
        }
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link} onClick={() => router.push(item.link)}>
        {item.label}
      </Menu.Item>
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
            <a href={link.link} onClick={(event) => event.preventDefault()}>
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
        className={`${styles.link} ${currentPath === link.link && styles.activeLink}`}
        onClick={() => link.link && router.push(link.link)}
      >
        {link.label}
      </a>
    );
  });

  return (
    <header className={styles.header}>
      <Container size={'xl'}>
        <div className={styles.inner}>
          <Flex justify="space-between" w="100%" h={'100%'}>
            <Flex align={'center'} gap={'xs'} h={'100%'}>
              <LogoIcon />
            </Flex>
            <Group gap="xl" visibleFrom="md" h={'100%'} py={10}>
              {items}
            </Group>
            {user && (
              <Group visibleFrom="md">
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Flex
                      align={'center'}
                      justify={'center'}
                      columnGap={'xs'}
                      className="cursor-pointer"
                    >
                      <Avatar size={'sm'} radius="xl" />
                      Hi, {user.firstName + ' ' + user.lastName}
                      <IconChevronDown size={16} stroke={1.6} />
                      <IconBellRinging size={16} stroke={1.6} />
                    </Flex>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconUserCircle />}
                      onClick={() => router.push('/my/my-profile')}
                    >
                      Account
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconLogout />}
                      onClick={() => {
                        logOut();
                        window.location.reload();
                      }}
                    >
                      Log out
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            )}
            {!user && (
              <Group visibleFrom="md">
                <Button component={Link} variant="outline" href="/auth/login">
                  Login
                </Button>
                <Button component={Link} href="/auth/signup">
                  Sign Up
                </Button>
              </Group>
            )}
          </Flex>
          <ActionIcon hiddenFrom="md" bg={'transparent'} c={'green'}>
            <IconSearch />
          </ActionIcon>
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            size="sm"
            hiddenFrom="md"
          />
        </div>
      </Container>

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

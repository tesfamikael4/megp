'use client';

import {
  AppShell,
  Avatar,
  Box,
  Burger,
  Button,
  Flex,
  Group,
  Menu,
  ScrollArea,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure, useNetwork } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import {
  IconHelpCircle,
  IconLogout,
  IconMenu2,
  IconMessages,
  IconSettings,
  IconUserCircle,
} from '@tabler/icons-react';
import Image from 'next/image';
import { useContext } from 'react';
import { Applications, CurrentApplication } from '../../config/applications';
import { ShellContext } from '../../context/shell.context';
import { LinksGroup } from './navbar-link-group';
import Perago from './perago.png';
import Logo from './ppda.svg';
import styles from './shell.module.scss';

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps): React.ReactNode {
  const shellContext = useContext(ShellContext);

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const currentApplication = CurrentApplication(
    shellContext.currentApplication,
  ).name;

  const applications = Applications.filter(
    ({ name }) => name !== currentApplication,
  ).map((item) => (
    <Menu.Item
      component="a"
      href={`/${item.key}`}
      key={item.key}
      leftSection={<item.icon size={14} />}
    >
      {item.name}
    </Menu.Item>
  ));

  const links = shellContext.menuItems.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  const networkStatus = useNetwork();

  return (
    <ModalsProvider>
      <Notifications />
      <AppShell
        header={{ height: '40px' }}
        layout="alt"
        navbar={{
          width: 250,
          breakpoint: 'sm',
          collapsed: {
            mobile: !mobileOpened,
            desktop: !desktopOpened,
          },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group align="center" h="100%" justify="space-between" px="sm">
            <Group align="center" gap={12} h="100%">
              <Burger
                hiddenFrom="sm"
                onClick={toggleMobile}
                opened={mobileOpened}
                size="sm"
              />
              <Button
                leftSection={<IconMenu2 size={16} />}
                onClick={toggleDesktop}
                pr={0}
                variant="white"
                visibleFrom="sm"
              />

              {/* <Breadcrumbs>
              <Anchor href="/launcher/">Home</Anchor>
              {items}
            </Breadcrumbs> */}
              <Title c="primary" fz={16}>
                Organization Name
              </Title>
            </Group>

            <Menu arrowPosition="center" shadow="md" width={200} withArrow>
              <Menu.Target>
                <Button variant="subtle">
                  <Box className="flex gap-2 items-center">
                    <Avatar color="primary" radius="xl" size="sm" />

                    <Flex className="flex-col justify-start text-left">
                      <Text lh={1}>Abebe Mengesha</Text>
                    </Flex>
                  </Box>
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item leftSection={<IconUserCircle size={14} />}>
                  Account
                </Menu.Item>
                <Menu.Item leftSection={<IconSettings size={14} />}>
                  Settings
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item leftSection={<IconMessages size={14} />}>
                  FAQ
                </Menu.Item>
                <Menu.Item leftSection={<IconHelpCircle size={14} />}>
                  Help
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item leftSection={<IconLogout size={14} />}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar className={styles.side}>
          <AppShell.Section>
            <Box className={styles.header}>
              <Box className="flex-grow">
                <Menu shadow="md" width={250}>
                  <Menu.Target>
                    <div className="flex items-center gap-1 cursor-pointer">
                      <svg
                        height="18"
                        version="1.1"
                        viewBox="0 0 32 32"
                        width="18"
                        xmlSpace="preserve"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                      >
                        <g>
                          <path
                            d="M14,3H4C3.4,3,3,3.4,3,4v10c0,0.6,0.4,1,1,1h10c0.6,0,1-0.4,1-1V4C15,3.4,14.6,3,14,3z"
                            fill="#f1f1ff"
                          />
                          <path
                            d="M14,17H4c-0.6,0-1,0.4-1,1v10c0,0.6,0.4,1,1,1h10c0.6,0,1-0.4,1-1V18C15,17.4,14.6,17,14,17z"
                            fill="#f1f1ff"
                          />
                          <path
                            d="M28,3H18c-0.6,0-1,0.4-1,1v10c0,0.6,0.4,1,1,1h10c0.6,0,1-0.4,1-1V4C29,3.4,28.6,3,28,3z"
                            fill="#f1f1ff"
                          />
                          <path
                            d="M28,17H18c-0.6,0-1,0.4-1,1v10c0,0.6,0.4,1,1,1h10c0.6,0,1-0.4,1-1V18C29,17.4,28.6,17,28,17z"
                            fill="#f1f1ff"
                          />
                        </g>
                      </svg>
                      <Logo style={{ width: '30px' }} />
                      <Text fw={500} fz="md">
                        | {currentApplication}
                      </Text>
                    </div>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Applications</Menu.Label>
                    {applications}
                  </Menu.Dropdown>
                </Menu>
                <Burger
                  color="white"
                  hiddenFrom="sm"
                  onClick={toggleMobile}
                  opened={mobileOpened}
                  size="sm"
                />
              </Box>
            </Box>
          </AppShell.Section>
          <AppShell.Section component={ScrollArea} grow>
            {links}
          </AppShell.Section>
          <AppShell.Section>
            <div className=" text-xs  border-t p-2">
              <div className="flex justify-between items-center">
                <Text color={networkStatus.online ? 'teal' : 'red'} size="sm">
                  {networkStatus.online ? 'Online' : 'Offline'}
                </Text>
                <div className="text-center">V.20231231.778</div>{' '}
              </div>
              <div className="flex gap-2 justify-between items-center">
                <div> &copy; 2023 PPDA </div>
                <div className="flex gap-2 justify-between items-center">
                  <span>Powered by</span>
                  <Image
                    alt="Perago"
                    height={40}
                    src={Perago}
                    width={60}
                  />{' '}
                </div>
              </div>
            </div>
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </ModalsProvider>
  );
}

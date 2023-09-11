'use client';

import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Menu,
  Navbar,
  ScrollArea,
  Text,
} from '@mantine/core';
import { useNetwork, useToggle } from '@mantine/hooks';
import {
  IconAdjustments,
  IconAdjustmentsCog,
  IconBasketCog,
  IconBuildingStore,
  IconCalendarEvent,
  IconCalendarStats,
  IconFileAnalytics,
  IconFileSpreadsheet,
  IconGauge,
  IconHelpCircle,
  IconLock,
  IconLogout,
  IconMenu2,
  IconMessages,
  IconNotes,
  IconPresentationAnalytics,
  IconSettings,
  IconUserCircle,
  IconUsersGroup,
} from '@tabler/icons-react';
import Image from 'next/image';
import { LinksGroup } from './navbar-link-group';
import Perago from './perago.png';
import Logo from './ppda.svg';
import styles from './shell.module.scss';

const mockdata = [
  { label: 'Dashboard', icon: IconGauge },
  {
    label: 'Market news',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Overview', link: '/' },
      { label: 'Forecasts', link: '/' },
      { label: 'Outlook', link: '/' },
      { label: 'Real time', link: '/' },
    ],
  },
  {
    label: 'Releases',
    icon: IconCalendarStats,
    links: [
      { label: 'Upcoming releases', link: '/' },
      { label: 'Previous releases', link: '/' },
      { label: 'Releases schedule', link: '/' },
    ],
  },
  { label: 'Analytics', icon: IconPresentationAnalytics },
  { label: 'Contracts', icon: IconFileAnalytics },
  { label: 'Settings', icon: IconAdjustments },
  {
    label: 'Security',
    icon: IconLock,
    links: [
      { label: 'Enable 2FA', link: '/' },
      { label: 'Change password', link: '/' },
      { label: 'Recovery codes', link: '/' },
    ],
  },
];
const items = [
  { title: 'Administration', href: '#' },
  { title: 'User', href: '#' },
  { title: 'use-id', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));
export default function Shell({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  const [sideBar, toggle] = useToggle();
  const networkStatus = useNetwork();

  return (
    <div className={styles.container}>
      {!sideBar ? (
        <div className={styles.side}>
          <div className={styles.header}>
            <Menu shadow="md" width={255}>
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
                    | Vender Management
                  </Text>
                </div>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Applications</Menu.Label>

                <Menu.Item icon={<IconBuildingStore size={14} />}>
                  Vender Management
                </Menu.Item>

                <Menu.Item icon={<IconCalendarEvent size={14} />}>
                  Planning
                </Menu.Item>
                <Menu.Item icon={<IconBasketCog size={14} />}>
                  Tendering
                </Menu.Item>
                <Menu.Item icon={<IconFileSpreadsheet size={14} />}>
                  Contract
                </Menu.Item>
                <Menu.Item icon={<IconAdjustmentsCog size={14} />}>
                  Administration
                </Menu.Item>
                <Menu.Item icon={<IconUsersGroup size={14} />}>
                  Identity & Access
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>

          <div className={styles.navigation}>
            {/* <div>App selection</div> */}
            <div>
              <Navbar
                bg="#f1f1ff"
                height="calc(100vh - 50px)"
                style={{ border: 'none' }}
              >
                <Navbar.Section component={ScrollArea} grow>
                  <div>{links}</div>
                </Navbar.Section>

                <Navbar.Section>
                  <div className=" text-xs p-2 border-t">
                    <div className="flex justify-between items-center">
                      <Text
                        color={networkStatus.online ? 'teal' : 'red'}
                        size="sm"
                      >
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
                </Navbar.Section>
              </Navbar>
            </div>
            <div />
          </div>
        </div>
      ) : null}
      <div className={styles.body}>
        <div className={styles.top}>
          <div className="flex items-center gap-2">
            <ActionIcon onClick={() => toggle()} variant="subtle">
              <IconMenu2 size="1rem" />
            </ActionIcon>
            <div>
              <Breadcrumbs>{items}</Breadcrumbs>
            </div>
          </div>
          <Menu shadow="md" trigger="hover" width={200}>
            <Menu.Target>
              <Button variant="subtle">
                <Avatar color="primary" />
                <Box>
                  <Text>Abebe Mengesha</Text>
                  <Text fz={10}>Organization name</Text>
                </Box>
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item icon={<IconUserCircle size={14} />}>Account</Menu.Item>
              <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
              <Menu.Divider />
              <Menu.Item icon={<IconMessages size={14} />}>FAQ</Menu.Item>
              <Menu.Item icon={<IconHelpCircle size={14} />}>Help</Menu.Item>

              <Menu.Divider />

              <Menu.Item icon={<IconLogout size={14} />}>Logout</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
        <div className={styles.main}>{children}</div>
      </div>
    </div>
  );
}

'use client';
import React from 'react';
import { Box, NavLink } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation'; // Updated import
import {
  IconBriefcase,
  IconDashboard,
  IconHeartHandshake,
  IconNotification,
  IconUserCog,
} from '@tabler/icons-react';
import styles from './sidebar.module.scss';
export interface SidebarLinks {
  label: string;
  icon?: any;
  link?: string;
  links?: SidebarLinks[];
}

export const sidebarLinks: SidebarLinks[] = [
  {
    label: 'Dashboard',
    icon: IconDashboard,
    link: '/vendor/dashboard',
  },
  {
    label: 'Tender ',
    icon: IconNotification,
    link: '/vendor/tender',
  },
  {
    label: 'Contract',
    icon: IconHeartHandshake,
    link: '/vendor/contract',
  },
  {
    label: 'Vendor Service',
    icon: IconUserCog,
    links: [
      {
        label: 'Get registration',
        link: '/vendor/registration/new/basic',
      },
      {
        label: 'Renew registration',
        link: '/vendor/registration/renewal',
      },
      {
        label: 'Upgrade registration',
        link: '/vendor/registration/upgrade',
      },
      {
        label: 'Msme registration',
        link: '/vendor/registration/msme',
      },
      {
        label: 'Dbm registration',
        link: '/vendor/registration/dbm',
      },
      {
        label: 'Debarment Study',
        link: '/vendor/registration/debarment-study',
      },
      {
        label: 'Cancel registration',
        link: '/vendor/registration/cancel',
      },
      {
        label: 'Track Application',
        link: '/vendor/registration/track-applications',
      },
      {
        label: 'My Briefcase',
        link: '/vendor/registration/my-briefcase',
      },
    ],
  },
];
function createNavLinks(
  links: SidebarLinks[] | undefined,
  currentPath: string,
  router: any,
) {
  return links?.map((link) => (
    <NavLink
      label={link.label}
      leftSection={link.icon && <link.icon size="1.2rem" stroke={1.5} />}
      key={link.label}
      active={currentPath === link.link}
      onClick={() => link.link && router.push(link.link)}
      className={!link.icon ? styles.sidebarChildren : ''}
    >
      {createNavLinks(link.links, currentPath, router)}
    </NavLink>
  ));
}
function Sidebar() {
  const router = useRouter();
  const path = usePathname();

  return (
    <Box className={styles.sidebarMain}>
      {createNavLinks(sidebarLinks, path, router)}
    </Box>
  );
}

export default Sidebar;

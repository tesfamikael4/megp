'use client';
import React from 'react';
import { Box, NavLink, UnstyledButton } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation'; // Updated import
import {
  IconBriefcase,
  IconCoins,
  IconDashboard,
  IconHeartHandshake,
  IconListDetails,
  IconNotification,
  IconUserCog,
  IconGavel,
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
    label: 'Procurement Notice ',
    icon: IconNotification,
    link: '/vendor/tender',
  },
  {
    label: 'Plans',
    icon: IconHeartHandshake,
    link: '/vendor/contract',
  },
  {
    label: 'My Tenders',
    icon: IconGavel,
    link: '/vendor/my-tenders',
  },
  {
    label: 'Vendor Service',
    icon: IconUserCog,
    link: '/vendor/service',
  },
  {
    label: 'Track Applications',
    icon: IconListDetails,
    link: '/vendor/registration/track-applications',
  },
  {
    label: 'My Briefcase',
    icon: IconBriefcase,
    link: '/vendor/registration/my-briefcase',
  },
  {
    label: 'My Payments',
    icon: IconCoins,
    link: '/vendor/registration/my-payments',
  },
];

function createNavLinks(
  links: SidebarLinks[] | undefined,
  currentPath: string,
  router: any,
) {
  return links?.map((link) => (
    <UnstyledButton
      key={link.label}
      className={`${styles.mainLink} ${currentPath === link.link && styles.activeLink}`}
      onClick={() => link.link && router.push(link.link)}
    >
      <NavLink
        label={link.label}
        leftSection={link.icon && <link.icon size="1.2rem" stroke={1.5} />}
        key={link.label}
        className={!link.icon ? styles.sidebarChildren : ''}
      >
        {createNavLinks(link.links, currentPath, router)}
      </NavLink>
    </UnstyledButton>
  ));
}
function Sidebar() {
  const router = useRouter();
  const path = usePathname();

  return (
    <Box className={styles.sidebarMain}>
      <div className={styles.mainLinks}>
        {createNavLinks(sidebarLinks, path, router)}
      </div>
    </Box>
  );
}

export default Sidebar;

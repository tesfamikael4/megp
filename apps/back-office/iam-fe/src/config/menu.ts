import { MenuItem } from '@megp/core-fe';
import { IconDeviceAnalytics, IconLoadBalancer } from '@tabler/icons-react';
import {
  IconAdjustmentsHorizontal,
  IconApps,
  IconBuildingBank,
  IconBuildingCommunity,
  IconChartInfographic,
  IconFileZip,
  IconLockSquareRounded,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react';

export const Menu: MenuItem[] = [
  {
    label: 'Organizations',
    icon: IconBuildingBank,
    link: '/organizations',
    permission: ['organization'],
  },
  {
    label: 'Applications',
    icon: IconApps,
    link: '/applications',
    permission: ['permission'],
  },
  {
    label: 'Mandates',
    icon: IconLockSquareRounded,
    link: '/mandate',
    permission: ['mandate'],
  },
  {
    label: 'My Organization',
    icon: IconBuildingBank,
    link: '/my-organization',
    permission: ['user'],
  },
  {
    label: 'My Mandates',
    icon: IconLockSquareRounded,
    link: '/my-mandate',
    permission: ['user'],
  },
  { label: 'Users', icon: IconUsers, link: '/users', permission: ['user'] },
  {
    label: 'Groups',
    icon: IconUsersGroup,
    link: '/groups',
    permission: ['group'],
  },
  {
    label: 'Units',
    icon: IconBuildingCommunity,
    link: '/units',
    permission: ['unit'],
  },
  {
    label: 'Roles',
    icon: IconLockSquareRounded,
    link: '/roles',
    permission: ['role'],
  },
  {
    label: 'System role',
    icon: IconDeviceAnalytics,
    link: '/system-role',
    permission: ['role'],
  },
  {
    label: 'Report & Analytics',
    icon: IconChartInfographic,
    link: '/reports',
  },
  {
    label: 'Archive',
    icon: IconFileZip,
    links: [
      {
        label: 'Organization',
        link: '/archived/organization',
        permission: ['organization'],
      },
      { label: 'Users', link: '/archived/users', permission: ['user'] },
      { label: 'Unit', link: '/archived/units', permission: ['unit'] },
      { label: 'Group', link: '/archived/group', permission: ['group'] },
      { label: 'Role', link: '/archived/roles', permission: ['role'] },
    ],
  },
  {
    label: 'Settings',
    icon: IconAdjustmentsHorizontal,
    links: [
      {
        label: 'Organization Types',
        link: '/organization-type',
        permission: ['organization'],
      },
      { label: 'Unit Types', link: '/unit-type', permission: ['unit'] },
    ],
  },
];

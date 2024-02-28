import { MenuItem } from '@megp/core-fe';
import { IconDeviceAnalytics } from '@tabler/icons-react';
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
    permission: ['iam:organization'],
  },
  {
    label: 'Applications',
    icon: IconApps,
    link: '/applications',
    permission: ['iam:permission'],
  },
  {
    label: 'Mandates',
    icon: IconLockSquareRounded,
    link: '/mandate',
    permission: ['iam:mandate'],
  },
  {
    label: 'My Organization',
    icon: IconBuildingBank,
    link: '/my-organization',
    permission: ['iam:user'],
  },
  {
    label: 'My Mandates',
    icon: IconLockSquareRounded,
    link: '/my-mandate',
    permission: ['iam:user'],
  },
  { label: 'Users', icon: IconUsers, link: '/users', permission: ['iam:user'] },
  {
    label: 'Users',
    icon: IconUsers,
    link: '/super-user',
    permission: ['iam:organization'],
  },

  {
    label: 'Groups',
    icon: IconUsersGroup,
    link: '/groups',
    permission: ['iam:group'],
  },
  {
    label: 'Units',
    icon: IconBuildingCommunity,
    link: '/units',
    permission: ['iam:unit'],
  },
  {
    label: 'Custom Roles',
    icon: IconLockSquareRounded,
    link: '/roles',
    permission: ['iam:role'],
  },
  {
    label: 'System Role',
    icon: IconDeviceAnalytics,
    link: '/system-role',
    permission: ['iam:role'],
  },
  {
    label: 'Report & Analytics',
    icon: IconChartInfographic,
    link: '/dashboard',
  },
  {
    label: 'Archive',
    icon: IconFileZip,
    links: [
      {
        label: 'Organization',
        link: '/archived/organization',
        permission: ['iam:organization'],
      },
      {
        label: 'Users',
        link: '/archived/users',
        permission: ['iam:user', 'iam:organization'],
      },
      { label: 'Unit', link: '/archived/units', permission: ['iam:unit'] },
      { label: 'Group', link: '/archived/group', permission: ['iam:group'] },
      { label: 'Role', link: '/archived/roles', permission: ['iam:role'] },
    ],
  },
  {
    label: 'Settings',
    icon: IconAdjustmentsHorizontal,
    links: [
      {
        label: 'Organization Types',
        link: '/organization-type',
        permission: ['iam:organization'],
      },
      { label: 'Unit Types', link: '/unit-type', permission: ['iam:unit'] },
    ],
  },
];

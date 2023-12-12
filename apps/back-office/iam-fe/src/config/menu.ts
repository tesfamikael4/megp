import { MenuItem } from '@megp/core-fe';
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
    label: 'Report & Analytics',
    icon: IconChartInfographic,
    link: '/reports',
  },
  {
    label: 'Archive',
    icon: IconFileZip,
    links: [
      { label: 'Organization', link: '/archived/organization' },
      { label: 'Users', link: '/archived/users' },
      { label: 'Unit', link: '/archived/units' },
      { label: 'Group', link: '/archived/group' },
      { label: 'Role', link: '/archived/roles' },
    ],
  },
  {
    label: 'Settings',
    icon: IconAdjustmentsHorizontal,
    links: [
      { label: 'Organization Types', link: '/organization-type' },
      { label: 'Unit Types', link: '/unit-type' },
    ],
  },
];

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
  { label: 'Organizations', icon: IconBuildingBank, link: '/organizations' },
  { label: 'Applications', icon: IconApps, link: '/applications' },
  { label: 'Mandates', icon: IconLockSquareRounded, link: '/mandate' },
  {
    label: 'My Organization',
    icon: IconBuildingBank,
    link: '/my-organization',
  },
  { label: 'My Mandates', icon: IconLockSquareRounded, link: '/my-mandate' },
  { label: 'Users', icon: IconUsers, link: '/users' },
  { label: 'Groups', icon: IconUsersGroup, link: '/groups' },
  { label: 'Units', icon: IconBuildingCommunity, link: '/units' },
  { label: 'Roles', icon: IconLockSquareRounded, link: '/roles' },
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

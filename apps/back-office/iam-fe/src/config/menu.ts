import { MenuItem } from '@megp/core-fe';
import {
  IconAdjustmentsHorizontal,
  IconBuildingBank,
  IconBuildingCommunity,
  IconChartInfographic,
  IconLockSquareRounded,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react';

export const Menu: MenuItem[] = [
  { label: 'Organizations', icon: IconBuildingBank, link: '/organizations' },
  {
    label: 'My Organization',
    icon: IconBuildingBank,
    link: '/my-organization',
  },
  { label: 'Users', icon: IconUsers, link: '/users' },
  { label: 'Groups', icon: IconUsersGroup, link: '/groups' },
  { label: 'Units', icon: IconBuildingCommunity, link: '/units' },
  { label: 'Roles', icon: IconLockSquareRounded, link: '/roles' },
  { label: 'Report & Analytics', icon: IconChartInfographic, link: '/reports' },

  {
    label: 'Settings',
    icon: IconAdjustmentsHorizontal,
    links: [
      { label: 'Organization Types', link: '/' },
      { label: 'Unit Types', link: '/' },
    ],
  },
];

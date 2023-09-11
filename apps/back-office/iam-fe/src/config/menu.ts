import { MenuItem } from '@megp/core-fe';
import {
  IconBuildingBank,
  IconBuildingCommunity,
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

  // {
  //     label: 'Security',
  //     icon: IconLock,
  //     links: [
  //         { label: 'Enable 2FA', link: '/' },
  //         { label: 'Change password', link: '/' },
  //         { label: 'Recovery codes', link: '/' },
  //     ],
  // },
];

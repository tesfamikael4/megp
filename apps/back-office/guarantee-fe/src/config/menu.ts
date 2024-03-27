import { MenuItem } from '@megp/core-fe';
import { IconCoin } from '@tabler/icons-react';

export const Menu: MenuItem[] = [
  {
    label: 'Guarantee Request',
    icon: IconCoin,
    link: '/guarantee-request',
  },
  {
    label: 'Guarantee Release',
    icon: IconCoin,
    link: '/guarantee-release',
  },
  {
    label: 'Guarantee Forfeit',
    icon: IconCoin,
    link: '/guarantee-forfeit',
  },
];

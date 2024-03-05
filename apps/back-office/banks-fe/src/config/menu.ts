import { MenuItem } from '@megp/core-fe';
import { IconAdjustmentsHorizontal, IconCoin } from '@tabler/icons-react';

export const Menu: MenuItem[] = [
  {
    label: 'Release',
    icon: IconCoin,
    link: '/release',
  },

  {
    label: 'Settings',
    icon: IconAdjustmentsHorizontal,
    links: [
      {
        label: 'Adjust Release',
        link: '/settings/adjust-release',
      },
    ],
  },
];

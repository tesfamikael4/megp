import { MenuItem } from '@megp/core-fe';
import {
  IconAdjustmentsHorizontal,
  IconBuildingBank,
} from '@tabler/icons-react';

export const Menu: MenuItem[] = [
  { label: 'Initiation', icon: IconBuildingBank, link: '/initiation' },
  {
    label: 'Pre Budget Plan',
    icon: IconBuildingBank,
    link: '/pre-budget-plan',
  },
  {
    label: 'Items',
    icon: IconBuildingBank,
    link: '/item',
  },

  {
    label: 'Settings',
    icon: IconAdjustmentsHorizontal,
    links: [
      { label: 'Organization Types', link: '/organization-type' },
      { label: 'Organization Sector', link: '/organization-sector' },
      { label: 'Unit Types', link: '/unit-type' },
    ],
  },
];

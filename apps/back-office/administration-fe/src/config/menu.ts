import { MenuItem } from '@megp/core-fe';
import {
  IconAdjustmentsHorizontal,
  IconBuildingBank,
} from '@tabler/icons-react';

export const Menu: MenuItem[] = [
  { label: 'Organizations', icon: IconBuildingBank, link: '/organizations' },
  { label: 'Taxonomy', icon: IconBuildingBank, link: '/taxonomy' },
  { label: 'Item Master', icon: IconBuildingBank, link: '/item-master' },
  { label: 'Item Category', icon: IconBuildingBank, link: '/item-category' },
  { label: 'Measurements', icon: IconBuildingBank, link: '/measurement' },
  {
    label: 'Settings',
    icon: IconAdjustmentsHorizontal,
    links: [
      { label: 'Procurement Method', link: '/lookup/procurement-method' },
    ],
  },
];

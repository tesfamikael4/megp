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
  { label: 'Tags', icon: IconBuildingBank, link: '/tag' },
  { label: 'Currency', icon: IconBuildingBank, link: '/currency' },
  { label: 'Target Group', icon: IconBuildingBank, link: '/target-group' },
  { label: 'Region', icon: IconBuildingBank, link: '/region' },
  {
    label: 'Settings',
    icon: IconAdjustmentsHorizontal,
    links: [
      { label: 'Procurement Method', link: '/lookup/procurement-method' },
      { label: 'Budget Category', link: '/lookup/budget-category' },
      {
        label: 'Procurement Procedures',
        link: '/lookup/procurement-procedures',
      },
      {
        label: 'Threshold',
        link: '/procurement-thresholds',
      },
      {
        label: 'Workflow',
        link: '/workflow',
      },
    ],
  },
];

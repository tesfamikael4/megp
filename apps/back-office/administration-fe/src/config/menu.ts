import { MenuItem } from '@megp/core-fe';
import {
  IconAdjustmentsHorizontal,
  IconBookmark,
  IconBrandFlightradar24,
  IconBuildingBank,
  IconDatabaseDollar,
  IconFileCheck,
  IconFileDollar,
  IconMapPin,
  IconTable,
  IconTableShortcut,
  IconTools,
} from '@tabler/icons-react';

export const Menu: MenuItem[] = [
  { label: 'Organizations', icon: IconBuildingBank, link: '/organizations' },
  { label: 'Taxonomy', icon: IconFileDollar, link: '/taxonomy' },
  { label: 'Item Master', icon: IconTable, link: '/item-master' },
  { label: 'Item Category', icon: IconTableShortcut, link: '/item-category' },
  { label: 'Measurements', icon: IconTools, link: '/measurement' },
  { label: 'Item Tags', icon: IconBookmark, link: '/tag' },
  { label: 'Rules', icon: IconFileCheck, link: '/rule-designer' },
  { label: 'Currency', icon: IconDatabaseDollar, link: '/currency' },
  {
    label: 'Target Group',
    icon: IconBrandFlightradar24,
    link: '/target-group',
  },
  { label: 'Region', icon: IconMapPin, link: '/region' },
  {
    label: 'Settings',
    icon: IconAdjustmentsHorizontal,
    links: [
      { label: 'Procurement Institution', link: '/procurement-institution' },
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
        permission: ['administration:platformOwner'],
      },
    ],
  },
];

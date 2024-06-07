import { MenuItem } from '@megp/core-fe';
import {
  IconFile,
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
  IconRegistered,
  IconSearch,
} from '@tabler/icons-react';

export const Menu: MenuItem[] = [
  {
    label: 'Item registry',
    icon: IconRegistered,
    links: [
      { label: 'Taxonomy', link: '/taxonomy' },

      { label: 'Item Master', link: '/item-master' },
      {
        label: 'Item Category',
        link: '/item-category',
      },
      {
        label: 'Item SubCategory',
        link: '/item-sub-category',
      },
      { label: 'Item Tags', link: '/tag' },
      { label: 'Measurements', link: '/measurement' },
      {
        label: 'Contract Catalogs',
        link: '/contract-catalogs',
      },
    ],
  },

  {
    label: 'Lookups',
    icon: IconSearch,
    links: [
      { label: 'Donors', link: '/lookup/donors' },
      { label: 'Region', link: '/region' },
      { label: 'Currency', link: '/currency' },
    ],
  },
  {
    label: 'Settings',
    icon: IconAdjustmentsHorizontal,
    links: [
      { label: 'Procurement Rules', link: '/rule-designer' },
      {
        label: 'Target Group',
        link: '/target-group',
      },

      // { label: 'Budget Category', link: '/lookup/budget-category' },
      // { label: 'Donors', link: '/lookup/donors' },
      // { label: 'Procurement Institution', link: '/procurement-institution' },
      // { label: 'Procurement Method', link: '/lookup/procurement-method' },
      // {
      //   label: 'Procurement Procedures',
      //   link: '/lookup/procurement-procedures',
      // },
      // {
      //   label: 'Threshold',
      //   link: '/procurement-thresholds',
      // },
      {
        label: 'Workflow',
        link: '/workflow',
        permission: ['administration:platformOwner'],
      },
    ],
  },
  // { label: 'Organizations', icon: IconBuildingBank, link: '/organizations' },
  // { label: 'Tax', icon: IconFileDollar, link: '/tax' },
];

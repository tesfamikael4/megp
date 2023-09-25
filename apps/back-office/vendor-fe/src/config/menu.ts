import { MenuItem } from '@megp/core-fe';
import {
  IconAdjustmentsHorizontal,
  IconBuildingStore,
  IconChartInfographic,
  IconFileSettings,
  IconHomeCancel,
  IconHomePlus,
  IconHomeRibbon,
  IconHomeStar,
  IconHomeUp,
  IconReportMoney,
} from '@tabler/icons-react';

export const Menu: MenuItem[] = [
  { label: 'Vendors', icon: IconBuildingStore, link: '/' },
  {
    label: 'New Registration ',
    icon: IconHomePlus,
    link: '/my-organization',
  },
  { label: 'Upgrade', icon: IconHomeUp, link: '/users' },
  { label: 'Renewal', icon: IconHomeRibbon, link: '/groups' },
  { label: 'Information Change', icon: IconHomeStar, link: '/units' },
  { label: 'Payment', icon: IconReportMoney, link: '/debarment' },
  { label: 'Debarment', icon: IconHomeCancel, link: '/debarment' },
  {
    label: 'Preferential Services',
    icon: IconFileSettings,
    links: [
      { label: 'IBM', link: '/' },
      { label: 'MSME', link: '/' },
    ],
  },
  { label: 'Report & Analytics', icon: IconChartInfographic, link: '/reports' },

  {
    label: 'Settings',
    icon: IconAdjustmentsHorizontal,
    links: [
      { label: 'Workflow', link: '/' },
      { label: 'Pricing', link: '/settings/pricing' },
    ],
  },
];

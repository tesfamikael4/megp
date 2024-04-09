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
  {
    label: 'Vendors',
    icon: IconBuildingStore,
    links: [
      { label: 'Approved Vendors', link: '/vendors/approved' },
      { label: 'Debarred Vendors', link: '/vendors/debarred' },
    ],
  },
  {
    label: 'New Registrations ',
    icon: IconHomePlus,
    link: '/new',
  },
  { label: 'Upgrade', icon: IconHomeUp, link: '/upgrade' },
  { label: 'Renewal', icon: IconHomeRibbon, link: '/renewal' },
  { label: 'Profile Updates', icon: IconHomeStar, link: '/info-change' },
  { label: 'Payment', icon: IconReportMoney, link: '/payment' },
  { label: 'Debarment', icon: IconHomeCancel, link: '/debarment' },
  {
    label: 'Rejected Applications',
    icon: IconFileSettings,
    link: '/vendors/rejected',
  },
  {
    label: 'Preferential Services',
    icon: IconFileSettings,
    link: '/preferential-services',
  },
  { label: 'Report & Analytics', icon: IconChartInfographic, link: '/reports' },

  {
    label: 'Settings',
    icon: IconAdjustmentsHorizontal,
    links: [
      { label: 'Workflow', link: '/' },
      {
        label: 'Pricing',
        link: '/settings/pricing',
      },
    ],
  },
];

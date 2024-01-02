import { MenuItem } from '@megp/core-fe';
import { IconCoins, IconReportAnalytics } from '@tabler/icons-react';

export const Menu: MenuItem[] = [
  {
    label: 'Procurement requisition',
    icon: IconCoins,
    link: '/procurement-requisition',
  },
  {
    label: 'Report',
    icon: IconReportAnalytics,
    link: '/report',
  },
];

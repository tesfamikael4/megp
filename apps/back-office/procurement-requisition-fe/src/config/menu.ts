import { MenuItem } from '@megp/core-fe';
import {
  IconAdjustmentsHorizontal,
  IconArrowFork,
  IconCoins,
  IconReportAnalytics,
} from '@tabler/icons-react';

export const Menu: MenuItem[] = [
  {
    label: 'Procurement requisition',
    icon: IconCoins,
    link: '/procurement-requisition',
  },

  {
    label: 'Settings',
    icon: IconAdjustmentsHorizontal,
    links: [
      {
        label: 'Procurement requisition Approval',
        link: '/procurement-requisition-approval',
      },
    ],
  },
];

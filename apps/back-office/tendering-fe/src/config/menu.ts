import { MenuItem } from '@megp/core-fe';
import {
  IconAdjustmentsHorizontal,
  IconCalendarEvent,
  IconCalendarStats,
  IconCoins,
  IconReportAnalytics,
} from '@tabler/icons-react';

export const Menu: MenuItem[] = [
  {
    label: 'Procurement requisition',
    icon: IconCoins,
    link: '/budget-year',
  },
  {
    label: 'Report',
    icon: IconReportAnalytics,
    link: '/report',
  },
];

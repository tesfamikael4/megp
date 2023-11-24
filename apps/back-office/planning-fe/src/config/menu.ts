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
    label: 'Pre Budget Plan',
    icon: IconCalendarStats,
    link: '/pre-budget-plan',
  },
  {
    label: 'Post Budget Plan',
    icon: IconCalendarEvent,
    link: '/post-budget-plan',
  },
  {
    label: 'Budget',
    icon: IconCoins,
    link: '/budget',
  },
  {
    label: 'Report',
    icon: IconReportAnalytics,
    link: '/report',
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

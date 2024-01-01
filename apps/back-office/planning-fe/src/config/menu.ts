import { MenuItem } from '@megp/core-fe';
import {
  IconAdjustmentsHorizontal,
  IconCalendarEvent,
  IconCalendarStats,
  IconCoins,
  IconReportAnalytics,
  IconGizmo,
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
    label: 'Workflow',
    icon: IconReportAnalytics,
    links: [
      { label: 'Pre Budget Plan Approval', link: '/post-budget-plan-approval' },
      {
        label: 'Post Budget Plan Approval',
        link: '/post-budget-plan-approval',
      },
    ],
  },

  {
    label: 'Settings',
    icon: IconAdjustmentsHorizontal,
    links: [
      // { label: 'Organization Types', link: '/organization-type' },
      // { label: 'Organization Sector', link: '/organization-sector' },
      // { label: 'Unit Types', link: '/unit-type' },
    ],
  },
];

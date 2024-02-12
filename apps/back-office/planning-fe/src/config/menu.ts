import { MenuItem } from '@megp/core-fe';
import {
  IconAdjustmentsHorizontal,
  IconArrowBackUpDouble,
  IconArrowFork,
  IconCalendarEvent,
  IconCalendarStats,
  IconCoins,
  IconGizmo,
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
    label: 'Pre Budget Plan Approval',
    link: '/pre-budget-plan-approval',
    icon: IconArrowFork,
  },
  {
    label: 'Post Budget Plan Approval',
    link: '/post-budget-plan-approval',
    icon: IconArrowFork,
  },
  {
    label: 'Settings',
    icon: IconAdjustmentsHorizontal,
    links: [
      {
        label: 'Approval Workflow',

        link: '/workflow',
      },
    ],
  },
];

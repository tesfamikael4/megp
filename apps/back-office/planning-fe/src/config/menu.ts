import { MenuItem } from '@megp/core-fe';
import {
  IconAdjustmentsHorizontal,
  IconArrowFork,
  IconBadge,
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
    permission: [
      'planning:managePrePlan',
      'planning:managePrePlanActivity',
      'planning:managePrePlanItem',
    ],
  },
  {
    label: 'Post Budget Plan',
    icon: IconCalendarEvent,
    link: '/post-budget-plan',
    permission: [
      'planning:managePostPlan',
      'planning:managePostPlanActivity',
      'planning:managePostPlanItem',
    ],
  },

  {
    label: 'Budget',
    icon: IconCoins,
    link: '/budget',
    permission: ['planning:manageBudget'],
  },
  {
    label: 'Procurement Requisition',
    icon: IconBadge,
    link: '/procurement-requisition',
  },
  {
    label: 'Report and Analytics',
    icon: IconReportAnalytics,
    link: '/report',
  },
  {
    label: 'Approval',
    icon: IconArrowFork,
    links: [
      {
        label: 'Pre Budget Plan Approval',
        link: '/pre-budget-plan-approval',
        permission: ['planning:approvePrePlan'],
      },
      {
        label: 'Post Budget Plan Approval',
        link: '/post-budget-plan-approval',
        permission: ['planning:approvePostPlan'],
      },
    ],
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

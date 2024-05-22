import { MenuItem } from '@megp/core-fe';
import { IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { IconArrowFork, IconVersions } from '@tabler/icons-react';
import { IconClipboardCheck, IconPageBreak } from '@tabler/icons-react';

export const Menu: MenuItem[] = [
  {
    label: 'Preparation',
    icon: IconPageBreak,
    link: '/rfx',
  },
  {
    label: 'Review',
    icon: IconVersions,
    link: '/revision',
  },
  {
    label: 'Approval',
    icon: IconArrowFork,
    link: '/approval',
  },

  {
    label: 'Settings',
    icon: IconAdjustmentsHorizontal,
    links: [
      {
        label: 'Approval Workflow',
        link: '/workflow-designer',
      },
    ],
  },
];

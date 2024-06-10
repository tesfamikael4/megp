import { MenuItem } from '@megp/core-fe';
import {
  IconAdjustmentsHorizontal,
  IconBuildingBank,
  IconChecklist,
  IconList,
  IconListCheck,
} from '@tabler/icons-react';
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
    label: 'Solicitation',
    icon: IconList,
    link: '/solicitation',
  },
  {
    label: 'Evaluation',
    icon: IconListCheck,
    link: '/evaluation',
  },
  {
    label: 'Adminstration',
    icon: IconBuildingBank,
    links: [
      {
        label: 'Assignment',
        link: '/assignment',
      },
    ],
  },
  {
    label: 'Approval',
    icon: IconArrowFork,
    links: [
      {
        label: 'RFQ Approval',
        link: '/approval',
      },
      {
        label: 'Evaluation Approval',
        link: '/evaluation-approval',
      },
    ],
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

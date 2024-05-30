import { MenuItem } from '@megp/core-fe';
import {
  IconBuildingBank,
  IconFileStack,
  IconFolderOpen,
  IconListCheck,
  IconLockSquareRounded,
  IconReportAnalytics,
} from '@tabler/icons-react';

export const Menu: MenuItem[] = [
  { label: 'Dashboard', icon: IconBuildingBank, link: '/dashboard' },
  {
    label: 'Standard Procurement Document',
    icon: IconFileStack,
    link: '/spd',
  },
  { label: 'Preparation', icon: IconLockSquareRounded, link: '/preparation' },
  { label: 'Revision', icon: IconLockSquareRounded, link: '/revision' },
  { label: 'Approval', icon: IconLockSquareRounded, link: '/approval' },
  { label: 'Solicitation', icon: IconLockSquareRounded, link: '/solicitation' },
  {
    label: 'Bid Opening',
    icon: IconFolderOpen,
    link: '/opening',
  },
  {
    label: 'Bid Evaluation',
    icon: IconListCheck,
    link: '/evaluation',
  },
  {
    label: 'Administration',
    icon: IconBuildingBank,
    links: [
      {
        label: 'Assignment',
        link: '/administration',
      },
      {
        label: 'Cancelation',
        link: '/cancelation',
      },
      {
        label: 'Workflow',
        link: '/workflow',
      },
    ],
  },
  {
    label: 'Report',
    icon: IconReportAnalytics,
    link: '/report',
  },
];

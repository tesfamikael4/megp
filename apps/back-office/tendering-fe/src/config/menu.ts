import { MenuItem } from '@megp/core-fe';
import {
  IconBuildingBank,
  IconCoins,
  IconFileStack,
  IconFolderOpen,
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
  {
    label: 'Bid Opening',
    icon: IconFolderOpen,
    link: '/opening',
  },
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
  { label: 'Preparation', icon: IconLockSquareRounded, link: '/preparation' },
  { label: 'Solicitation', icon: IconLockSquareRounded, link: '/solicitation' },
];

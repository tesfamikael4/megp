import { MenuItem } from '@megp/core-fe';
import {
  IconBuildingBank,
  IconCoins,
  IconFileStack,
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
    label: 'Procurement requisition',
    icon: IconCoins,
    link: '/procurement-requisition',
  },
  {
    label: 'Report',
    icon: IconReportAnalytics,
    link: '/report',
  },
  { label: 'Initiation', icon: IconLockSquareRounded, link: '/initiation' },
  { label: 'Preparation', icon: IconLockSquareRounded, link: '/preparation' },
  { label: 'Solicitation', icon: IconLockSquareRounded, link: '/solicitation' },
];

import {
  IconAdjustments,
  IconBriefcase,
  IconChecklist,
  IconFolderPlus,
  IconGavel,
  IconHeartHandshake,
  IconShoppingCart,
  IconUserCog,
  IconUserShare,
} from '@tabler/icons-react';
import { MenuLinks } from '../models';

export const infomationLinks: MenuLinks.SidebarLinks[] = [
  {
    label: 'Quotation Preparation',
    icon: IconFolderPlus,
    link: `check-password`,
  },
];

export const managementLinks: MenuLinks.SidebarLinks[] = [
  {
    label: 'Evaluation Result',
    icon: IconBriefcase,
    link: `/vendor/my-tenders/evaluation-result`,
  },
  {
    label: 'Award Negotiation',
    icon: IconHeartHandshake,
    link: `/vendor/my-tenders/award-negotiation`,
  },
  {
    label: 'Purchase Order',
    icon: IconShoppingCart,
    link: `/vendor/my-tenders/purchase-order`,
  },
  {
    label: 'Award Notice',
    icon: IconChecklist,
    link: `/vendor/my-tenders/award-notice`,
  },
];

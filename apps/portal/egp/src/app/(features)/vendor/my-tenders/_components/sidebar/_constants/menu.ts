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
    label: 'Tender Preparation',
    icon: IconFolderPlus,
    link: `check-password`,
  },
  {
    label: 'Bid Security',
    icon: IconAdjustments,
    link: `/vendor/my-tenders/guarantee`,
  },
  {
    label: 'Clarification',
    icon: IconUserShare,
    link: `/vendor/my-tenders/clarification`,
  },
];

export const managementLinks: MenuLinks.SidebarLinks[] = [
  {
    label: 'Tender Minutes',
    icon: IconGavel,
    link: `/vendor/my-tenders/tender-operating-minutes`,
  },

  {
    label: 'Evaluation Clarification',
    icon: IconShoppingCart,
    link: `/vendor/my-tenders/evaluation-clarification`,
  },
  {
    label: 'Evaluation Report',
    icon: IconUserCog,
    link: `/vendor/my-tenders/evaluation-report`,
  },
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

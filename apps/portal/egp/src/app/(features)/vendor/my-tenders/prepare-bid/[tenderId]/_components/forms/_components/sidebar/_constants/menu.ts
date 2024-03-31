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

export const bidSubmittedBy: MenuLinks.SidebarLinks[] = [
  {
    label: 'Bid Submitted By',
    icon: IconFolderPlus,
    link: `submitted-by`,
  },
];

export const financialOffer: MenuLinks.SidebarLinks[] = [
  {
    label: 'Financial Offer',
    icon: IconFolderPlus,
    link: `financial-offer`,
  },
];

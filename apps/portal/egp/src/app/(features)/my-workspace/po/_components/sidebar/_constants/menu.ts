import { IconAward, IconShoppingCart } from '@tabler/icons-react';
import { MenuLinks } from '../models';

export const solicitationLinks: MenuLinks.SidebarLinks[] = [
  {
    label: 'Purchase Order',
    icon: IconShoppingCart,
    link: '/my-workspace/po/purchase-order',
  },
  {
    label: 'Award Notice',
    icon: IconAward,
    link: '/my-workspace/po/award-notice',
  },
];

import {
  IconAward,
  IconBookmark,
  IconBriefcase,
  IconCoins,
  IconDashboard,
  IconGavel,
  IconListDetails,
  IconUserCog,
} from '@tabler/icons-react';
import { MenuLinks } from '../models';
import { IconShoppingCart } from '@tabler/icons-react';
import { IconAddressBook } from '@tabler/icons-react';

export const informationLinks: MenuLinks.SidebarLinks[] = [
  // {
  //   label: 'Dashboard',
  //   icon: IconDashboard,
  //   link: '/my-workspace/dashboard',
  // },
  {
    label: 'Bookmarks',
    icon: IconBookmark,
    link: '/my-workspace/bookmarks',
  },
];

export const managementLinks: MenuLinks.SidebarLinks[] = [
  {
    label: 'My Tenders',
    icon: IconGavel,
    link: '/my-workspace/my-tenders',
  },
  {
    label: 'Vendor Service',
    icon: IconUserCog,
    link: '/my-workspace/service',
  },
  {
    label: 'Track Applications',
    icon: IconListDetails,
    link: '/my-workspace/registration/track-applications',
  },
  {
    label: 'My Briefcase',
    icon: IconBriefcase,
    link: '/my-workspace/registration/my-briefcase',
  },
  {
    label: 'My Payments',
    icon: IconCoins,
    link: '/my-workspace/registration/my-payments',
  },
  {
    label: 'Purchase Orders',
    icon: IconShoppingCart,
    link: '/my-workspace/registration/purchase-orders',
  },
  {
    label: 'My Profile',
    icon: IconAddressBook,
    link: '/my-workspace/registration/my-profile',
  },
  {
    label: 'My Locker',
    icon: IconBriefcase,
    link: '/my-workspace/my-locker',
  },
];

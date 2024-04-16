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
  //   link: '/vendor-ui/my/dashboard',
  // },
  {
    label: 'Bookmarks',
    icon: IconBookmark,
    link: '/vendor-ui/my/bookmarks',
  },
];

export const managementLinks: MenuLinks.SidebarLinks[] = [
  {
    label: 'My Tenders',
    icon: IconGavel,
    link: '/vendor-ui/my/my-tenders',
  },
  {
    label: 'Vendor Service',
    icon: IconUserCog,
    link: '/vendor-ui/my/service',
  },
  {
    label: 'Track Applications',
    icon: IconListDetails,
    link: '/vendor-ui/my/registration/track-applications',
  },
  {
    label: 'My Briefcase',
    icon: IconBriefcase,
    link: '/vendor-ui/my/registration/my-briefcase',
  },
  {
    label: 'My Payments',
    icon: IconCoins,
    link: '/vendor-ui/my/registration/my-payments',
  },
  {
    label: 'Purchase Orders',
    icon: IconShoppingCart,
    link: '/vendor-ui/my/registration/purchase-orders',
  },
  {
    label: 'My Profile',
    icon: IconAddressBook,
    link: '/vendor-ui/my/registration/my-profile',
  },
  {
    label: 'My Locker',
    icon: IconBriefcase,
    link: '/vendor-ui/my/my-locker',
  },
];

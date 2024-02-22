import {
  IconBookmark,
  IconBriefcase,
  IconCoins,
  IconDashboard,
  IconGavel,
  IconHeartHandshake,
  IconListDetails,
  IconNotification,
  IconUserCog,
} from '@tabler/icons-react';
import { MenuLinks } from '../models';

export const informationLinks: MenuLinks.SidebarLinks[] = [
  {
    label: 'Dashboard',
    icon: IconDashboard,
    link: '/vendor/dashboard',
  },
  {
    label: 'Bookmarks',
    icon: IconBookmark,
    link: '/vendor/bookmarks',
  },
];

export const managementLinks: MenuLinks.SidebarLinks[] = [
  {
    label: 'My Tenders',
    icon: IconGavel,
    link: '/vendor/my-tenders',
  },
  {
    label: 'Vendor Service',
    icon: IconUserCog,
    link: '/vendor/service',
  },
  {
    label: 'Track Applications',
    icon: IconListDetails,
    link: '/vendor/registration/track-applications',
  },
  {
    label: 'My Briefcase',
    icon: IconBriefcase,
    link: '/vendor/registration/my-briefcase',
  },
  {
    label: 'My Payments',
    icon: IconCoins,
    link: '/vendor/registration/my-payments',
  },
];

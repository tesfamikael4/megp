import {
  IconBriefcase,
  IconDashboard,
  IconFolderPause,
  IconFolderPlus,
  IconListCheck,
  IconNotification,
} from '@tabler/icons-react';

export const sidebarLinks = [
  {
    title: 'Information',
    children: [
      {
        label: 'Dashboard',
        icon: IconDashboard,
        link: '/egp/vendors/dashboard',
        displayName: 'Dashboard',
      },
      {
        label: 'Notifications',
        icon: IconNotification,
        link: '/egp/vendors/notifications',
        displayName: 'List of Notifications',
      },
    ],
  },
  {
    title: 'Vendor Registration',
    children: [
      {
        label: 'Registrations Service',
        icon: IconFolderPlus,
        links: [
          {
            label: 'New',
            link: '/egp/vendors/new',
            displayName: 'Register as a Vendor',
          },
          {
            label: '',
            link: '/egp/vendors/registration-form',
            displayName: 'Vendor Registration',
          },
          {
            label: 'Renewal',
            link: '/egp/vendors/renewal',
            displayName: 'Renewal Vendor Information',
          },
          {
            label: 'Upgrade',
            link: '/egp/vendors/upgrade',
            displayName: 'Upgrade Vendor Information',
          },
          {
            label: 'Update Information',
            link: '/egp/vendors/update-info',
            displayName: 'Upgrade Vendor Information',
          },
          {
            label: 'Add Additional service',
            link: '/egp/vendors/additional-service',
            displayName: 'Additional Services',
          },
        ],
      },
      {
        label: 'Draft Applications',
        icon: IconFolderPause,
        link: '/egp/vendors/draft-applications',
        displayName: 'List of Drafts',
      },
      {
        label: 'Follow Up Tasks',
        icon: IconListCheck,
        link: '/egp/vendors/follow-up-tasks',
        displayName: 'List of Follow Up Tasks',
      },
      {
        label: 'Application Tracking',
        icon: IconBriefcase,
        link: '/egp/vendors/track-applications',
        displayName: 'Track Applications',
      },
    ],
  },
];

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
        link: '/vendor/dashboard',
        displayName: 'Dashboard',
      },
      {
        label: 'Notifications',
        icon: IconNotification,
        link: '/vendor/notifications',
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
            link: '/vendor/registration/new',
            displayName: 'Register as a Vendor',
          },
          {
            label: '',
            link: '/vendor/registration/registration-form',
            displayName: 'Vendor Registration',
          },
          {
            label: 'Renewal',
            link: '/vendor/registration/renewal',
            displayName: 'Renewal Vendor Information',
          },
          {
            label: 'Upgrade',
            link: '/vendor/registration/upgrade',
            displayName: 'Upgrade Vendor Information',
          },
          {
            label: 'Update Information',
            link: '/vendor/registration/update-info',
            displayName: 'Upgrade Vendor Information',
          },
          {
            label: 'Add Additional service',
            link: '/vendor/registration/additional-service',
            displayName: 'Additional Services',
          },
        ],
      },
      {
        label: 'Draft Applications',
        icon: IconFolderPause,
        link: '/vendor/draft-applications',
        displayName: 'List of Drafts',
      },
      {
        label: 'Follow Up Tasks',
        icon: IconListCheck,
        link: '/vendor/follow-up-tasks',
        displayName: 'List of Follow Up Tasks',
      },
      {
        label: 'Application Tracking',
        icon: IconBriefcase,
        link: '/vendor/track-applications',
        displayName: 'Track Applications',
      },
    ],
  },
];

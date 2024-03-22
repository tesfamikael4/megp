import {
  IconCalendarEvent,
  IconClipboardList,
  IconNotes,
  IconPackage,
  IconUserPlus,
  IconFiles,
} from '@tabler/icons-react';

export const featuredContent = [
  {
    icon: <IconUserPlus />,
    color: 'red',
    title: 'Vendor Registration',
    description:
      'Vendor registration allows businesses to access public sector opportunities. Online registration leads to approval and access to diverse procurement options. Compliance and updates are vital for eligibility and success in government contracts.',
  },
  {
    icon: <IconClipboardList />,
    color: 'cyan',
    title: 'Registered Vendors',
    description:
      'Registered vendors are authorized companies validated to engage in government procurement via the electronic platform. Registered Vendors access opportunities, demonstrating their reliability and adherence to procurement regulations.',
  },
  {
    icon: <IconCalendarEvent />,
    color: 'green',
    title: 'Procurement Plans',
    description:
      'A predetermined acquisition, encompassing goods, services, or works, each accompanied by its allocated budget, designated timeline for procurement, and specified procurement methods.',
  },
  {
    icon: <IconNotes />,
    color: 'yellow',
    title: 'Procurement Notices',
    description:
      'Official announcements by procurement authorities, providing details of published opportunities for goods, services, or works.',
  },
  {
    icon: <IconPackage />,
    color: 'red',
    title: 'Contract Notices',
    description:
      'Official announcements by procurement authorities disclosing awarded contracts and upcoming contract opportunities.',
  },
  {
    icon: <IconFiles />,
    color: 'cyan',
    title: 'Procurement Information',
    description:
      'Digital repository provides essential information on procurement activities, including procurement legislation, standard bidding documents, templates, contract awards, spending trends, and vendor performance metrics.',
  },
];

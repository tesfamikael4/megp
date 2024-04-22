import { MenuItem } from '@megp/core-fe';
import { IconClipboardCheck, IconPageBreak } from '@tabler/icons-react';

export const Menu: MenuItem[] = [
  {
    label: 'Preparation',
    icon: IconClipboardCheck,
    link: '/purchasing',
  },
  {
    label: 'Procurment Requisitions',
    icon: IconPageBreak,
    link: '/procurement-requisition',
  },
];

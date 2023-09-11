import type { TablerIconsProps } from '@tabler/icons-react';
import {
  IconAdjustmentsCog,
  IconBasketCog,
  IconBuildingStore,
  IconCalendarEvent,
  IconFileSpreadsheet,
  IconUsersGroup,
} from '@tabler/icons-react';

interface ApplicationType {
  key: string;
  name: string;
  icon: (props: TablerIconsProps) => JSX.Element;
}

export const Applications = [
  { key: 'vender', name: 'Vender Management', icon: IconBuildingStore },
  { key: 'Planning', name: 'Planning', icon: IconCalendarEvent },
  { key: 'tendering', name: 'Tendering', icon: IconBasketCog },
  { key: 'contract', name: 'Contract', icon: IconFileSpreadsheet },
  { key: 'administration', name: 'Administration', icon: IconAdjustmentsCog },
  { key: 'iam', name: 'Identity & Access', icon: IconUsersGroup },
];

export const CurrentApplication = (key = 'iam'): ApplicationType => {
  const application =
    Applications.find((app) => app.key === key) ?? Applications[0];
  return application;
};

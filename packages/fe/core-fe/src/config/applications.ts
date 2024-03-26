import type { TablerIconsProps } from '@tabler/icons-react';
import {
  IconAdjustmentsCog,
  IconBasketCog,
  IconBuildingBank,
  IconBuildingStore,
  IconCalendarEvent,
  IconUsersGroup,
} from '@tabler/icons-react';

interface ApplicationType {
  key: string;
  name: string;
  icon: (props: TablerIconsProps) => JSX.Element;
}

export const Applications = [
  { key: 'administration', name: 'Administration', icon: IconAdjustmentsCog },
  { key: 'banks', name: 'Banks', icon: IconBuildingBank },
  { key: 'iam', name: 'Identity & Access', icon: IconUsersGroup },
  { key: 'planning', name: 'Planning', icon: IconCalendarEvent },
  { key: 'tendering', name: 'Tendering', icon: IconBasketCog },
  { key: 'vendors', name: 'Vendor Management', icon: IconBuildingStore },
  // { key: 'contract', name: 'Contract', icon: IconFileSpreadsheet },
];

export const CurrentApplication = (key = 'iam'): ApplicationType => {
  const application =
    Applications.find((app) => app.key === key) ?? Applications[0];
  return application;
};

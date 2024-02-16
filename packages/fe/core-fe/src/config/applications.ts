import type { TablerIconsProps } from '@tabler/icons-react';
import {
  IconAdjustmentsCog,
  IconBasketCog,
  IconBuildingStore,
  IconCalendarEvent,
  IconShoppingBag,
  IconUsersGroup,
} from '@tabler/icons-react';

interface ApplicationType {
  key: string;
  name: string;
  icon: (props: TablerIconsProps) => JSX.Element;
}

export const Applications = [
  { key: 'vendors', name: 'Vendor Management', icon: IconBuildingStore },
  { key: 'planning', name: 'Planning', icon: IconCalendarEvent },
  { key: 'tendering', name: 'Tendering', icon: IconBasketCog },
  { key: 'procurement-requisition', name: 'PR', icon: IconShoppingBag },
  // { key: 'contract', name: 'Contract', icon: IconFileSpreadsheet },
  { key: 'administration', name: 'Administration', icon: IconAdjustmentsCog },
  { key: 'iam', name: 'Identity & Access', icon: IconUsersGroup },
];

export const CurrentApplication = (key = 'iam'): ApplicationType => {
  const application =
    Applications.find((app) => app.key === key) ?? Applications[0];
  return application;
};

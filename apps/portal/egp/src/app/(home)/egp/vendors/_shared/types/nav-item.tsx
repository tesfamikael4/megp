import { TablerIconsProps } from '@tabler/icons-react';

export interface NavItem {
  label: string;
  icon: (props: TablerIconsProps) => JSX.Element;
  link?: string;
  links?: {
    label: string;
    link: string;
    displayName?: string;
  }[];
  displayName?: string;
}
export interface NavItemWrapper {
  title: string;
  children: NavItem[];
}

import type { ColumnDef } from '@tanstack/react-table';

export interface EntityConfig<T> {
  basePath: string;
  entity: string;
  mode: 'list' | 'new' | 'detail';

  hasAdd?: boolean;
  hasDetail?: boolean;
  onDetail?: (selected: T) => void;
  onAdd?: () => void;

  // data
  primaryKey?: string;
  primaryContent?: string;
  columns: ColumnDef<T>[];
  onSearch?: (search: string) => void;
  isLoading?: boolean;
  selectedKey?: string;

  selectable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  pagination?: boolean;

  // UI
  title?: React.ReactElement | string;
  subTitle?: React.ReactElement | string;

  // Default
  className?: string;
}

export const defaultEntityConfig = {
  basePath: '/list',
  entity: 'list',
  mode: 'list',
  primaryKey: 'id',
  primaryContent: 'name',
  hasAdd: true,
  hasDetail: true,
  addPath: '/list/new',
  title: 'List',
  columns: [],

  // data
  selectable: false,
  searchable: false,
  filterable: false,
  sortable: false,
  pagination: false,
};

import type { ColumnDef } from '@tanstack/react-table';

export interface List<T> {
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

  hasAdd?: boolean;
  onAdd?: () => void;
}

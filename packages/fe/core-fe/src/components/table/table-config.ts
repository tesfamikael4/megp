import type { ColumnDef } from '@tanstack/react-table';

export interface TableConfig<T> {
  columns: ColumnDef<T>[];
  pagination?: boolean;
  searchable?: boolean;
  primaryColumn?: string;
}

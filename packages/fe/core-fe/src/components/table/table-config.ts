import type { ColumnDef } from '@tanstack/react-table';

export interface TableConfig<T> {
  columns: ColumnDef<T>[];
}

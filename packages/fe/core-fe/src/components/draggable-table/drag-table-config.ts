import type { ColumnDef } from '@tanstack/react-table';

export interface DragTableConfig<T> {
  columns: ColumnDef<T>[];
}

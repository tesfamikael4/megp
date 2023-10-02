import type { List } from './list';

export interface RelationConfig<T> extends List<T> {
  onSave?: (selected: T[]) => void;
  onDeleteAll?: (selected: T[]) => void;
  onDelete?: (selected: T) => void;
}

export const defaultRelationConfig: RelationConfig<{ id: string }> = {
  primaryContent: 'name',
  columns: [],
  hasAdd: true,

  // data
  selectable: false,
  searchable: false,
  filterable: false,
  sortable: false,
  pagination: false,
};

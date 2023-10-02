import type { List } from './list';

export interface EntityConfig<T> extends List<T> {
  basePath: string;
  entity: string;
  mode: 'list' | 'new' | 'detail';

  hasAdd?: boolean;
  hasDetail?: boolean;
  onDetail?: (selected: T) => void;
  onAdd?: () => void;

  // Default
  className?: string;
}

export const defaultEntityConfig: EntityConfig<{ id: string }> = {
  basePath: '/list',
  entity: 'list',
  mode: 'list',

  primaryContent: 'name',
  hasAdd: true,
  hasDetail: true,

  title: 'List',
  columns: [],

  // data
  selectable: false,
  searchable: false,
  filterable: false,
  sortable: false,
  pagination: false,
};

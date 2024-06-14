import { type ReactNode } from 'react';

export interface ExpandableTableConfig {
  idAccessor?: string;
  columns: any[];
  isExpandable?: boolean;
  expandedRowContent?: (record: any, collapse?: any) => React.ReactNode;
  isSearchable?: boolean;
  primaryColumn?: string;
  isSelectable?: boolean;
  disableMultiSelect?: boolean;
  selectedItems?: any[];
  setSelectedItems?: (items: any[]) => void;
  action?: ReactNode;
  onClick?: (record: any) => void;
  minHeight?: number;
  noRecordsText?: string;
  isLoading?: boolean;
  filters?: any[];
}

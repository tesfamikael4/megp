import type { DataTableProps } from 'mantine-datatable';
import type { Dispatch, SetStateAction } from 'react';

//TableConfig interface
export interface TreeConfig<TData> {
  title?: string;
  withBorder?: boolean;
  // return the whole row instead of id
  onClick?: (data: TDataWithChildren<TData>) => void;
  selectable?: boolean;
  multipleSelect?: boolean;
  multipleExpand?: boolean;
  id: keyof TData;
  label: keyof TData;
  setSelectedIds?: Dispatch<SetStateAction<string[]>>;
  selectedIds?: string[];
  selectOnlyLeafs?: boolean;
  load?: (
    record?: TDataWithChildren<TData>,
  ) => Promise<{ result: TDataWithChildren<TData>[]; loading: boolean }>;
  backgroundColor?: DataTableProps<TData>['backgroundColor'];
}

export interface NestedDataTableProps<TData> {
  records: TDataWithChildren<TData>[];
  expandedRecordIds: string[];
  onExpandedRecordIdsChange: Dispatch<SetStateAction<string[]>>;
  config: TreeConfig<TData>;
}

export interface ChildNodeProps<TData> {
  id: string;
  expandedRecordIds: string[];
  onExpandedRecordIdsChange: Dispatch<SetStateAction<string[]>>;
  level: number;
  data: TDataWithChildren<TData>;
  setManipulatedData: Dispatch<SetStateAction<TDataWithChildren<TData>[]>>;
  manipulatedData: TDataWithChildren<TData>[];
  config: TreeConfig<TData>;
  clicked: string | null;
  setClicked: Dispatch<SetStateAction<string | null>>;
}

export interface TreeProps<TData> {
  data: TDataWithChildren<TData>[];
  config: TreeConfig<TData>;
}

export type TDataWithChildren<TData> = TData & {
  children?: TDataWithChildren<TData>[];
};

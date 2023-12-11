'use client';
import { RelationConfig, visibleColumn } from '@megp/entity';
import {
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { List } from './List';
import {
  CollectionQuery,
  defaultRelationConfig,
} from '@megp/entity/src/models';

interface RelationProps<T> {
  mode?: 'list' | 'detail' | 'modal';
  config: RelationConfig<T>;
  data: T[];
  isLoading?: boolean;
  handleCloseModal?: () => void;
  onRequestChange?: (request: CollectionQuery) => void;
  total?: number;
  search: string;
}

export function TaxonomyList<T>({
  config,
  data: dataRender,
  isLoading,
  onRequestChange,
  total,
  search,
}: RelationProps<T>): React.ReactElement {
  const options: any = useMemo(() => {
    return { ...defaultRelationConfig, ...config };
  }, [config]);

  // construct header columns with the select column and action column
  const tableColumns: any = useMemo<any[]>(
    () => [
      ...options.columns.map((column) => ({
        ...column,
        meta: { widget: 'primary' },
      })),
    ],

    [options.columns],
  );

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData(dataRender);
  }, [dataRender]);

  const table = useReactTable({
    data,
    state: {
      columnVisibility: visibleColumn(tableColumns, options.primaryContent),
    },
    enableMultiRowSelection: !options.disableMultiSelect,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      enableHiding: false,
    },

    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
    enableRowSelection: true,
  });

  const body = (
    <>
      <List
        data={data}
        isLoading={isLoading}
        onRequestChange={onRequestChange}
        options={options}
        table={table}
        total={total}
        search={search}
      />
    </>
  );

  return <>{body}</>;
}

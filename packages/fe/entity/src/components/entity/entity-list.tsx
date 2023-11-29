'use client';

import {
  Box,
  Button,
  Tooltip,
  LoadingOverlay,
  Stack,
  ActionIcon,
} from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconHierarchy2, IconPlus } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { defaultEntityConfig, type EntityConfig } from '../../models/entity';
import type { CollectionQuery } from '../../models/query';
import { visibleColumn } from '../../utilities/table';
import { Grid } from '../table/grid';
import { actionColumn, selectColumn, newExpand } from '../table/header-column';

interface EntityListProps<T> {
  mode?: 'list' | 'detail' | 'new' | 'tree';
  config: EntityConfig<T>;
  data: T[];
  total?: number;
  hasSearch?: boolean;
  hasPagination?: boolean;
  onRequestChange?: (request: CollectionQuery) => void;
  isLoading?: boolean;
  hasTree?: boolean;
}

export function EntityList<T>({
  mode,
  config,
  data: dataRender = [],
  total = 0,
  hasTree,
  onRequestChange,
  isLoading = false,
}: EntityListProps<T>): React.ReactElement {
  // update the options with the default config
  const options: EntityConfig<T> = useMemo(() => {
    return { ...defaultEntityConfig, ...config };
  }, [config]);

  const [expanded, setExpanded] = useState({});
  const [treeView, setTreeView] = useState(false);
  const [width, setWidth] = useState(100);
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);

  // construct header columns with the select column and action column
  const tableColumns = useMemo<ColumnDef<T>[]>(
    () => [
      ...(treeView && mode !== 'tree' ? [newExpand] : []),
      ...(options.selectable ? [selectColumn] : []),
      ...(!treeView
        ? options.columns.map((column) => ({
            ...column,
          }))
        : []),
      ...(options.hasDetail ? [actionColumn(options)] : []),
    ],
    [treeView, mode, options],
  );

  // change the width of the table columns when the mode changes
  useEffect(() => {
    let columnCount = tableColumns.length;
    columnCount = options.selectable ? columnCount - 1 : columnCount;
    columnCount = options.hasDetail ? columnCount - 1 : columnCount;
    const w = mode !== 'list' ? 100 : (1 / columnCount) * 100;
    setWidth(w);
  }, [mode]);

  useEffect(() => {
    function transformData(originalData: T[]) {
      const transformedData = [];

      const map = new Map();

      originalData.forEach((item: any) => {
        map.set(item?.id, { ...item, subRows: [] });
      });

      map.forEach((item: any) => {
        const parentId = item?.parentId;
        const parent = map.get(parentId);

        if (parent) {
          parent.subRows.push(item);
        } else {
          transformedData.push(item as never);
        }
      });

      return transformedData;
    }

    const transformedData = transformData(dataRender);

    treeView ? setData(transformedData) : setData(dataRender);
  }, [dataRender, treeView]);

  useEffect(() => {
    if (mode === 'tree') {
      setTreeView(true);
    }
  }, [mode]);

  const table = useReactTable({
    data,
    state: {
      columnVisibility: visibleColumn(
        tableColumns,
        options.primaryContent,
        mode,
      ),
      expanded,
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    columns: tableColumns,
    enableSortingRemoval: false,
    enableRowSelection: true,
    getSubRows: (row: any) => row.subRows,
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    defaultColumn: {
      enableHiding: false,
    },
  });

  return (
    <Section
      action={
        <>
          {hasTree ? (
            <ActionIcon onClick={() => setTreeView(!treeView)}>
              <IconHierarchy2 />
            </ActionIcon>
          ) : null}
          {options.hasAdd ? (
            <Button
              leftSection={<IconPlus size={16} stroke={2.2} />}
              onClick={options.onAdd}
            >
              Add
            </Button>
          ) : null}
        </>
      }
      className={`${options.className} relative`}
      collapsible={false}
      mh="400px"
      title={
        <Tooltip label="Go to list" withArrow>
          <Box component={Link} href={options.basePath}>
            {options.title}
          </Box>
        </Tooltip>
      }
      w={mode === 'list' ? '100%' : '35%'}
    >
      <LoadingOverlay
        overlayProps={{ radius: 'sm', blur: 2 }}
        visible={isLoading}
      />
      <Stack>
        <Grid
          data={data}
          isLoading={isLoading}
          mode={mode}
          onRequestChange={onRequestChange}
          options={options}
          table={table}
          total={total}
          width={width}
        />
      </Stack>
    </Section>
  );
}

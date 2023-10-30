'use client';

import { ActionIcon, Box, Button, Tooltip } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconHierarchy2, IconPlus } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { defaultEntityConfig, type EntityConfig } from '../../models/entity';
import { visibleColumn } from '../../utilities/table';
import { Grid } from '../table/grid';
import { actionColumn, newExpand, selectColumn } from '../table/header-column';

interface EntityListProps<T> {
  mode?: 'list' | 'detail' | 'new' | 'tree';
  config: EntityConfig<T>;
  data: T[];
  isLoading?: boolean;
  hasTree?: boolean;
}

// new lists
export function TreeList<T>({
  mode,
  config,
  data: dataRender,
  hasTree,
  isLoading = false,
}: EntityListProps<T>): React.ReactElement {
  // update the options with the default config
  const options: EntityConfig<T> = useMemo(() => {
    return { ...defaultEntityConfig, ...config };
  }, [config]);

  const [expanded, setExpanded] = useState({});
  const [treeView, setTreeView] = useState(false);
  const [data, setData] = useState([]);

  // construct header columns with the select column and action column
  const tableColumns = useMemo<ColumnDef<T>[]>(
    () => [
      ...(treeView && mode !== 'tree' ? [newExpand] : []),
      ...(options.selectable ? [selectColumn] : []),
      ...(!treeView
        ? options.columns.map((column) => ({
            ...column,

            meta: { widget: 'primary' },
          }))
        : []),
      ...(options.hasDetail ? [actionColumn(options)] : []),
    ],
    [options, treeView, mode],
  );

  const [width, setWidth] = useState(100);

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
    autoResetExpanded: false,

    state: {
      columnVisibility: visibleColumn(
        tableColumns,
        options.primaryContent,
        mode,
      ),
      expanded,
    },
    enableRowSelection: true,
    getSubRows: (row: any) => row.subRows,
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),

    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      enableHiding: false,
    },
  });

  useEffect(() => {
    function generateExpandedObject(items, parentKey = '') {
      let expandedObject = {};

      items.forEach((item, index) => {
        const newKey = parentKey ? `${parentKey}.${index}` : `${index}`;
        expandedObject[newKey] = true;

        if (item.subRows && item.subRows.length > 0) {
          const childObject = generateExpandedObject(item.subRows, newKey);
          expandedObject = { ...expandedObject, ...childObject };
        }
      });

      return expandedObject;
    }

    setExpanded(generateExpandedObject(data));
  }, [data]);

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
      w={mode === 'list' || mode === 'tree' ? '100%' : '35%'}
    >
      <Grid
        data={data}
        isLoading={isLoading}
        mode={mode}
        options={options}
        table={table}
        width={width}
      />
    </Section>
  );
}

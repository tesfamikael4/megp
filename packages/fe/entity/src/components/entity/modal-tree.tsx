'use client';

import { Button } from '@mantine/core';
import type { ColumnDef } from '@tanstack/react-table';
import {
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { defaultEntityConfig, type EntityConfig } from '../../models/entity';
import { visibleColumn } from '../../utilities/table';
import { Grid } from '../table/grid';
import { Expand } from '../table/header-column';

interface EntityListProps<T> {
  mode?: 'list' | 'detail' | 'new' | 'tree';
  config: EntityConfig<T>;
  data: T[];
  isLoading?: boolean;
  hasTree?: boolean;
  parentUnitId?: string;
  setParentUnitId?: () => void;
  setIsModalOpen?: (boolean) => void;
}

// new lists
export function TreeList<T>({
  mode,
  config,
  data: dataRender,
  isLoading = false,
  parentUnitId,
  setParentUnitId,
  setIsModalOpen,
}: EntityListProps<T>): React.ReactElement {
  // update the options with the default config
  const options: EntityConfig<T> = useMemo(() => {
    return { ...defaultEntityConfig, ...config };
  }, [config]);

  const [expanded, setExpanded] = useState({});

  const [data, setData] = useState([]);

  // construct header columns with the select column and action column
  const tableColumns = useMemo<ColumnDef<T>[]>(
    () => [...[Expand(parentUnitId, setParentUnitId)]],
    [parentUnitId, setParentUnitId],
  );

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

    setData(transformedData);
  }, [dataRender]);

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
    <>
      <Grid
        data={data}
        isLoading={isLoading}
        mode={mode}
        options={options}
        table={table}
        width={100}
      />

      {setIsModalOpen ? (
        <Button
          className="mt-4"
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          Done
        </Button>
      ) : null}
    </>
  );
}

'use client';
import { Button, Group } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconDeviceFloppy, IconPlus } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { defaultRelationConfig, type RelationConfig } from '../../models';
import { visibleColumn } from '../../utilities/table';
import { Grid } from '../table/grid';

interface RelationProps<T> {
  mode?: 'list' | 'detail';
  config: RelationConfig<T>;
  data: T[];

  //
  isSaving?: boolean;
}
export function Relation<T>({
  config,
  data,
  mode = 'list',
  isSaving = false,
}: RelationProps<T>): React.ReactElement {
  const options: RelationConfig<T> = useMemo(() => {
    return { ...defaultRelationConfig, ...config };
  }, [config]);

  // construct header columns with the select column and action column
  const tableColumns = useMemo<ColumnDef<T>[]>(
    () => [
      ...options.columns.map((column) => ({
        ...column,

        meta: { widget: 'primary' },
      })),
    ],
    [options],
  );

  const [width, setWidth] = useState(100);

  // change the width of the table columns when the mode changes
  useEffect(() => {
    let columnCount = tableColumns.length;
    columnCount = options.selectable ? columnCount - 1 : columnCount;

    const w = mode !== 'list' ? 100 : (1 / columnCount) * 100;
    setWidth(w);
  }, [mode]);

  const table = useReactTable({
    data,
    state: {
      columnVisibility: visibleColumn(
        tableColumns,
        options.primaryContent,
        mode,
      ),
    },

    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      enableHiding: false,
    },
  });

  return (
    <Section
      action={
        options.hasAdd ? (
          <Button
            leftSection={<IconPlus size={16} stroke={2.2} />}
            onClick={options.onAdd}
          >
            Add
          </Button>
        ) : null
      }
      defaultCollapsed
      title={options.title}
    >
      <Grid
        data={data}
        mode={mode}
        options={options}
        table={table}
        width={width}
      />
      {data.length > 0 ? (
        <Group className="border-t pt-4">
          {options.onSave ? (
            <Button
              leftSection={<IconDeviceFloppy size={14} stroke={1.6} />}
              loading={isSaving}
              onClick={() => options.onSave?.(data)}
            >
              Save
            </Button>
          ) : null}
        </Group>
      ) : null}
    </Section>
  );
}

'use client';
import { Box, Button, Group, LoadingOverlay } from '@mantine/core';
import { Section, logger } from '@megp/core-fe';
import { IconDeviceFloppy, IconPlus } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { defaultRelationConfig, type RelationConfig } from '../../models';
import { visibleColumn } from '../../utilities/table';
import { Grid } from '../table/grid';
import { selectColumn } from '../table/header-column';

interface RelationProps<T> {
  mode?: 'list' | 'detail' | 'modal';
  config: RelationConfig<T>;
  data: T[];
  currentSelected?: T[];
  //
  isSaving?: boolean;
  isLoading?: boolean;
}
export function Relation<T>({
  config,
  data,
  mode = 'list',
  currentSelected,
  isSaving,
  isLoading,
}: RelationProps<T>): React.ReactElement {
  const options: RelationConfig<T> = useMemo(() => {
    return { ...defaultRelationConfig, ...config };
  }, [config]);

  // construct header columns with the select column and action column
  const tableColumns = useMemo<ColumnDef<T>[]>(
    () => [
      ...(options.selectable && mode === 'modal' ? [selectColumn] : []),
      ...options.columns.map((column) => ({
        ...column,

        meta: { widget: 'primary' },
      })),
    ],
    [options],
  );

  const [width, setWidth] = useState(100);
  const [rowSelection, setRowSelection] = useState({});

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
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      enableHiding: false,
    },
  });

  useEffect(() => {
    function generateRowSelection(d, selectedData) {
      const rowSeleced = {};
      selectedData?.forEach((selecte) => {
        const index = d.findIndex((item) => item.id === selecte.id);
        if (index !== -1) {
          rowSeleced[index] = true;
        }
      });
      return rowSeleced;
    }
    const selectedRowa = generateRowSelection(data, currentSelected);
    logger.log(selectedRowa);
    setRowSelection(selectedRowa);
  }, [data, currentSelected]);

  const body = (
    <>
      <Box pos="relative">
        <LoadingOverlay visible={isLoading} />
        <Grid
          data={data}
          mode={mode}
          options={options}
          table={table}
          width={width}
        />
      </Box>

      {data.length > 0 ? (
        <Group className="border-t pt-4">
          {options.onSave ? (
            <Button
              leftSection={<IconDeviceFloppy size={14} stroke={1.6} />}
              loading={isSaving}
              onClick={() =>
                mode === 'modal'
                  ? options.onSave?.(
                      table
                        .getSelectedRowModel()
                        .flatRows.map((s) => s.original),
                    )
                  : options.onSave?.(data)
              }
            >
              Save
            </Button>
          ) : null}
        </Group>
      ) : null}
    </>
  );

  return (
    <>
      {mode === 'modal' ? (
        body
      ) : (
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
          {body}
        </Section>
      )}
    </>
  );
}

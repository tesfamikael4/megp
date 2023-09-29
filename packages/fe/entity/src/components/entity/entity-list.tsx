'use client';

import {
  Box,
  Button,
  Center,
  Group,
  Input,
  LoadingOverlay,
  Pagination,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconInboxOff, IconPlus, IconSearch } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { actionColumn, selectColumn } from '../table/header-column';
import Widget from '../table/widget';
import styles from './entity-list.module.scss';
import { visibleColumn } from '@/utilities/table';
import { defaultEntityConfig, type EntityConfig } from '@/models/entity';

interface EntityListProps<T> {
  mode?: 'list' | 'detail' | 'new';
  config: EntityConfig<T>;
  data: T[];
}
// new list
export function EntityList<T>({
  mode,
  config,
  data = [],
}: EntityListProps<T>): React.ReactElement {
  // update the options with the default config
  const options: EntityConfig<T> = useMemo(() => {
    return { ...defaultEntityConfig, ...config };
  }, [config]);

  // construct header columns with the select column and action column
  const tableColumns = useMemo<ColumnDef<T>[]>(
    () => [
      ...(options.selectable ? [selectColumn] : []),
      ...options.columns.map((column) => ({
        ...column,

        meta: { widget: 'primary' },
      })),
      ...(options.hasDetail ? [actionColumn(options)] : []),
    ],
    [options],
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
        visible={options.isLoading}
      />

      {data.length === 0 ? (
        <Center c="dimmed" className="h-full min-h-[300px]">
          <Stack align="center">
            <IconInboxOff size={40} />
            <Text>No {options.entity} Found</Text>
            {options.hasAdd ? (
              <Button
                leftSection={<IconPlus size={16} stroke={2.2} />}
                onClick={options.onAdd}
                size="xs"
                variant="outline"
              >
                Add
              </Button>
            ) : null}
          </Stack>
        </Center>
      ) : (
        <Stack>
          <Group justify="end">
            {options.selectable ? (
              <Input
                className={mode === 'list' ? 'w-1/4' : 'w-full'}
                leftSection={<IconSearch size={16} />}
                placeholder="Search"
                size="xs"
              />
            ) : null}
          </Group>
          <Table className={styles.table} highlightOnHover striped>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.Th
                      colSpan={header.colSpan}
                      key={header.id}
                      style={{
                        width:
                          header.getSize() !== 150
                            ? header.getSize()
                            : `${width}%`,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </Table.Th>
                  ))}
                </Table.Tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <Table.Tr className={styles.row} key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Td key={cell.id}>
                      <Widget cell={cell} />
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </tbody>
          </Table>
          <Group justify="center">
            {options.pagination ? (
              <Pagination size="sm" total={10} withEdges />
            ) : null}
          </Group>
        </Stack>
      )}
    </Section>
  );
}

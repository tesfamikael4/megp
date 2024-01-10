'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState, type ReactElement, useEffect } from 'react';
import {
  Box,
  Center,
  Group,
  Table as MantineTable,
  Pagination,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { IconInboxOff, IconSearch } from '@tabler/icons-react';
import { useDebouncedState } from '@mantine/hooks';
import styles from './table.module.scss';
import type { TableConfig } from './table-config';

interface TableProps<T> {
  data: T[];
  config: TableConfig<T>;
  onRequestChange?: (collectionQuery: any) => void;
  total?: number;
}

const perPage = 10;

function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0;
  }

  return Math.ceil(totalItems / itemsPerPage);
}

export function Table<T>({
  data,
  config,
  onRequestChange,
  total = 0,
}: TableProps<T>): ReactElement {
  const table = useReactTable({
    data,
    columns: config.columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const [page, setPage] = useState(1);
  const totalPages = calculateTotalPages(total, perPage);
  const [search, setSearch] = useDebouncedState('', 500);

  useEffect(() => {
    const from = (page - 1) * perPage;

    onRequestChange?.({
      skip: from,
      take: perPage,
      where: search
        ? [
            [
              {
                column: config.primaryColumn,
                value: search,
                operator: 'ILIKE',
              },
            ],
          ]
        : [],
    });
  }, [page, search]);

  return (
    <Box className={styles.container}>
      {config.searchable ? (
        <TextInput
          className="mb-2 ml-auto"
          leftSection={<IconSearch size={16} />}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
          }}
          placeholder="Search"
          rightSectionWidth={30}
          w={300}
        />
      ) : null}
      {data.length === 0 ? (
        <Center c="dimmed" className="h-full min-h-[300px]">
          <Stack align="center">
            <IconInboxOff size={40} />
            <Text>No Data Found</Text>
          </Stack>
        </Center>
      ) : (
        <MantineTable className={styles.table} highlightOnHover striped>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <MantineTable.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <MantineTable.Th
                    colSpan={header.colSpan}
                    key={header.id}
                    style={{
                      width: 'auto',
                      textAlign:
                        header.column.id === 'action' ? 'right' : 'left',
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </MantineTable.Th>
                ))}
              </MantineTable.Tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <MantineTable.Tr className={styles.row} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <MantineTable.Td className={styles.td} key={cell.id}>
                    <Text fz={14} lineClamp={2}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Text>
                  </MantineTable.Td>
                ))}
              </MantineTable.Tr>
            ))}
          </tbody>
        </MantineTable>
      )}

      {config.pagination ? (
        <Group className="mt-2" justify="end">
          <Pagination
            onChange={setPage}
            size="sm"
            total={totalPages}
            value={page}
            withEdges
          />
        </Group>
      ) : null}
    </Box>
  );
}

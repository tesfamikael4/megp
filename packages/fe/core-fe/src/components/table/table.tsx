'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { type ReactElement } from 'react';
import { Box, Center, Table as MantineTable, Stack, Text } from '@mantine/core';
import { IconInboxOff } from '@tabler/icons-react';
import styles from './table.module.scss';
import type { TableConfig } from './table-config';

interface TableProps<T> {
  data: T[];
  config: TableConfig<T>;
}

export function Table<T>({ data, config }: TableProps<T>): ReactElement {
  const table = useReactTable({
    data,
    columns: config.columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Box className={styles.container}>
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
                      width:
                        header.getSize() !== 150 ? header.getSize() : `${5}%`,
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
    </Box>
  );
}

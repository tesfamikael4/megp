import {
  Box,
  Center,
  Group,
  LoadingOverlay,
  Stack,
  Table,
  Text,
  Pagination,
} from '@mantine/core';
import { IconDatabase } from '@tabler/icons-react';
import { flexRender } from '@tanstack/react-table';
import type t from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import styles from '../../../../../../../../packages/fe/entity/src/components/table/grid.module.scss';
import { CollectionQuery } from '@megp/entity';

interface GridProps<T> {
  options: any;
  table: t.Table<T>;
  data: any[];
  isLoading?: boolean;
  total?: number;
  onRequestChange?: (request: CollectionQuery) => void;
  search: string;
}

const perPage = 20;

function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0; // No pages if no items or itemsPerPage is non-positive.
  }

  return Math.ceil(totalItems / itemsPerPage);
}

export function List<T>({
  options,
  table,
  data,
  total = 0,
  isLoading = false,
  onRequestChange,
  search,
}: GridProps<T>): React.ReactElement {
  const [page, setPage] = useState(1);

  const totalPages = calculateTotalPages(total, perPage);

  useEffect(() => {
    const from = (page - 1) * perPage;
    const to = perPage;

    onRequestChange?.({
      skip: from,
      take: to,
      where: search
        ? [
            [
              {
                column: `${options.columns[0]?.accessorKey}`,
                value: search,
                operator: 'LIKE',
              },
            ],
          ]
        : [],
    });
  }, [page]);

  useEffect(() => {
    if (page === 1) {
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      onRequestChange?.({
        skip: from,
        take: to,
        where: search
          ? [
              [
                {
                  column: `${options.columns[0]?.accessorKey}`,
                  value: search,
                  operator: 'LIKE',
                },
              ],
            ]
          : [],
      });
    } else {
      setPage(1);
    }
  }, [search]);
  return (
    <Box>
      <LoadingOverlay
        overlayProps={{ radius: 'sm', blur: 2 }}
        visible={isLoading}
      />
      {data.length === 0 ? (
        <Center
          c="dimmed"
          className="h-[500px]"
          style={{
            border: 0,
          }}
        >
          <Stack align="center">
            <IconDatabase size={40} />
            <Text>There are no results that match your search</Text>
          </Stack>
        </Center>
      ) : (
        <>
          <Table className={styles.table} highlightOnHover striped>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <Table.Tr className={styles.row} key={row.id}>
                  {row
                    .getVisibleCells()
                    .map((cell) =>
                      flexRender(cell.column.columnDef.cell, cell.getContext()),
                    )}
                </Table.Tr>
              ))}
            </tbody>
          </Table>
          {data.length > 0 && options.pagination ? (
            <Group justify="space-between" mb="lg" mt="lg">
              <Text>Total : {total.toLocaleString()} results</Text>

              <Pagination
                onChange={setPage}
                size="sm"
                total={totalPages}
                value={page}
                withEdges
              />
            </Group>
          ) : null}
        </>
      )}
    </Box>
  );
}

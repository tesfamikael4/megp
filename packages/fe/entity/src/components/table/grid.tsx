import {
  ActionIcon,
  Box,
  Button,
  Center,
  Flex,
  Group,
  LoadingOverlay,
  Stack,
  Table,
  Text,
  TextInput,
  Pagination,
} from '@mantine/core';
import {
  IconArrowsSort,
  IconInboxOff,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react';
import { flexRender } from '@tanstack/react-table';
import type t from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import { useDebouncedState } from '@mantine/hooks';
import type { CollectionQuery } from '../../models/query';
import styles from './grid.module.scss';
import Widget from './widget';

interface GridProps<T> {
  options: any;
  table: t.Table<T>;
  data: any[];
  isLoading?: boolean;
  width: number;
  mode: any;
  total?: number;
  onRequestChange?: (request: CollectionQuery) => void;
}

const perPage = 15;

function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0;
  }

  return Math.ceil(totalItems / itemsPerPage);
}

export function Grid<T>({
  options,
  table,
  data,
  total = 0,
  mode,
  width,
  isLoading = false,
  onRequestChange,
}: GridProps<T>): React.ReactElement {
  const [search, setSearch] = useDebouncedState('', 500);
  const [page, setPage] = useState(1);

  const totalPages = calculateTotalPages(total, perPage);

  useEffect(() => {
    const from = (page - 1) * perPage;

    onRequestChange?.({
      skip: from,
      take: perPage,
      where: search
        ? [
            [
              {
                column: `${options.primaryContent}`,
                value: search,
                operator: 'ILIKE',
              },
            ],
          ]
        : [],
    });
  }, [page]);

  useEffect(() => {
    if (page === 1) {
      const from = (page - 1) * perPage;
      onRequestChange?.({
        skip: from,
        take: perPage,
        where: search
          ? [
              [
                {
                  column: `${options.columns[0]?.accessorKey}`,
                  value: search,
                  operator: 'ILIKE',
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
    <Box pos="relative">
      <LoadingOverlay
        overlayProps={{ radius: 'sm', blur: 2 }}
        visible={isLoading}
      />

      {options.searchable ? (
        <Flex justify="flex-end" mb="md" mt="md">
          <TextInput
            className={mode === 'list' ? 'w-1/4' : 'w-full'}
            leftSection={<IconSearch size={16} stroke={0.5} />}
            miw={300}
            onChange={(event) => {
              setSearch(event.currentTarget.value);
            }}
            placeholder="Search"
            rightSectionWidth={30}
            size="xs"
          />
        </Flex>
      ) : null}

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
        <>
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
                        textAlign:
                          header.column.id === 'action' ? 'right' : 'left',
                      }}
                    >
                      <Flex>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {header.column.id !== 'action' &&
                        header.column.id !== 'select' &&
                        options.sortable ? (
                          <ActionIcon
                            onClick={header.column.getToggleSortingHandler()}
                            size="sm"
                            variant="transparent"
                          >
                            <IconArrowsSort
                              className="mt-1 ml-1"
                              color="grey"
                              height={14}
                              width={14}
                            />
                          </ActionIcon>
                        ) : null}
                      </Flex>
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

          {data.length > 0 && total > perPage && options.pagination ? (
            <Group justify="space-between" mb="lg" mt="lg">
              {total !== 0 && (
                <Text>Total : {total.toLocaleString()} results</Text>
              )}

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

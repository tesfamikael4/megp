'use client';

import {
  Box,
  Button,
  Group,
  Tooltip,
  Text,
  Pagination,
  Flex,
  TextInput,
  LoadingOverlay,
  Stack,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { Section } from '@megp/core-fe';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from '@tanstack/react-table';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { defaultEntityConfig, type EntityConfig } from '../../models/entity';
import type { CollectionQuery } from '../../models/query';
import { visibleColumn } from '../../utilities/table';
import { Grid } from '../table/grid';
import { actionColumn, selectColumn } from '../table/header-column';

interface EntityListProps<T> {
  mode?: 'list' | 'detail' | 'new';
  config: EntityConfig<T>;
  data: T[];
  total?: number;
  hasSearch?: boolean;
  hasPagination?: boolean;
  onRequestChange?: (request: CollectionQuery) => void;
  isLoading?: boolean;
}

const perPage = 15;

function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0; // No pages if no items or itemsPerPage is non-positive.
  }

  return Math.ceil(totalItems / itemsPerPage);
}

// new list
export function EntityList<T>({
  mode,
  config,
  data = [],
  total = 0,
  hasSearch = true,
  hasPagination = true,
  onRequestChange,
  isLoading = false,
}: EntityListProps<T>): React.ReactElement {
  const [search, setSearch] = useDebouncedState('', 500);
  const [page, setPage] = useState(1);

  const totalPages = calculateTotalPages(total, perPage);

  // update the options with the default config
  const options: EntityConfig<T> = useMemo(() => {
    return { ...defaultEntityConfig, ...config };
  }, [config]);

  useEffect(() => {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    onRequestChange?.({
      skip: from,
      take: to,
      where: [[{ column: '', value: search, operator: 'ILIKE' }]],
    });
  }, [page]);

  useEffect(() => {
    if (page === 1) {
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      onRequestChange?.({
        skip: from,
        take: to,
        where: [[{ column: '', value: search, operator: 'ILIKE' }]],
      });
    } else {
      setPage(1);
    }
  }, [search]);

  // construct header columns with the select column and action column
  const tableColumns = useMemo<ColumnDef<T>[]>(
    () => [
      ...(options.selectable ? [selectColumn] : []),
      ...options.columns.map((column) => ({
        ...column,
      })),
      ...(options.hasDetail ? [actionColumn(options)] : []),
    ],
    [options],
  );

  const [width, setWidth] = useState(100);
  const [sorting, setSorting] = useState([]);

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
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    columns: tableColumns,
    enableSortingRemoval: false,

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
        visible={isLoading}
      />
      <Stack>
        {data.length > 0 && hasSearch ? (
          <Flex justify="flex-end" mt="md">
            <TextInput
              leftSection={<IconSearch size="22" stroke={1.5} />}
              miw={300}
              onChange={(event) => {
                setSearch(event.currentTarget.value);
              }}
              placeholder="Search"
              rightSectionWidth={30}
              size="sm"
            />
          </Flex>
        ) : null}
        <Grid
          data={data}
          isLoading={isLoading}
          mode={mode}
          options={options}
          table={table}
          width={width}
        />
        {data.length > 0 && hasPagination ? (
          <Group justify="space-between">
            <Text>Total : {total.toLocaleString()} results</Text>
            <Pagination
              onChange={setPage}
              total={totalPages}
              value={page}
              withEdges
            />
          </Group>
        ) : null}
      </Stack>
    </Section>
  );
}

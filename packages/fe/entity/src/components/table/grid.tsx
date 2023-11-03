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
} from '@mantine/core';
import { IconInboxOff, IconPlus, IconSearch } from '@tabler/icons-react';
import { flexRender } from '@tanstack/react-table';
import type t from '@tanstack/react-table';
import styles from './grid.module.scss';
import Widget from './widget';

interface GridProps<T> {
  options: any;
  table: t.Table<T>;
  data: any[];
  isLoading?: boolean;
  width: number;
  mode: any;
}

export function Grid<T>({
  options,
  table,
  data,
  mode,
  width,
  isLoading = false,
}: GridProps<T>): React.ReactElement {
  return (
    <Box>
      <LoadingOverlay
        overlayProps={{ radius: 'sm', blur: 2 }}
        visible={isLoading}
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
        <>
          {options.searchable ? (
            <Group justify="end">
              <Input
                className={mode === 'list' ? 'w-1/4' : 'w-full'}
                leftSection={<IconSearch size={16} />}
                placeholder="Search"
                size="xs"
              />
            </Group>
          ) : null}
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
          {options.pagination ? (
            <Group className="my-4" justify="center">
              <Pagination size="sm" total={10} withEdges />
            </Group>
          ) : null}
        </>
      )}
    </Box>
  );
}

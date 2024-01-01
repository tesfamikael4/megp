'use client';

import type { Renderable } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { type ReactElement } from 'react';
import { Box, Center, Table as MantineTable, Stack, Text } from '@mantine/core';
import { IconDragDrop, IconInboxOff } from '@tabler/icons-react';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './table.module.scss';
import type { DragTableConfig } from './drag-table-config';

interface TableProps<T> {
  data: T[];
  config: DragTableConfig<T>;
  setData: React.Dispatch<any>;
}

interface TableRowProps {
  row: any;
}

function TableRow({ row }: TableRowProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: row.original.id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <MantineTable.Tr
      className={styles.row}
      key={row.id}
      ref={setNodeRef}
      style={style}
    >
      {row.getVisibleCells().map((cell) => (
        <MantineTable.Td className={styles.td} key={cell.id}>
          <Text fz={14} lineClamp={2}>
            {flexRender(
              cell.column.columnDef.cell as Renderable<any>,
              cell.getContext(),
            )}
          </Text>
        </MantineTable.Td>
      ))}
      <div className="w-fit h-auto flex ml-auto">
        <IconDragDrop {...attributes} {...listeners} color="gray" size={18} />
      </div>
    </MantineTable.Tr>
  );
}

export function DragTable<T>({
  data,
  config,
  setData,
}: TableProps<T>): ReactElement {
  const table = useReactTable<T>({
    data,
    columns: config.columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) {
      return;
    }
    setData(() => {
      const oldIndex = data.findIndex((step: any) => step.id === active.id);
      const newIndex = data.findIndex((step: any) => step.id === over.id);
      const newData = arrayMove(data as any[], oldIndex, newIndex);
      return newData;
    });
  };

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

          {
            <tbody>
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
              >
                <SortableContext
                  items={data as any}
                  strategy={verticalListSortingStrategy}
                >
                  {/* {data.map((user) => (
              <TableRow key={user.id} user={user} />
            ))} */}

                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              </DndContext>
            </tbody>
          }
        </MantineTable>
      )}
    </Box>
  );
}

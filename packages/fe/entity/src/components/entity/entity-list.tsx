'use client';

import { Box, Button, Tooltip } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconPlus } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { defaultEntityConfig, type EntityConfig } from '../../models/entity';
import { visibleColumn } from '../../utilities/table';
import { Grid } from '../table/grid';
import { actionColumn, selectColumn } from '../table/header-column';

interface EntityListProps<T> {
  mode?: 'list' | 'detail' | 'new';
  config: EntityConfig<T>;
  data: T[];
  isLoading?: boolean;
}
// new list
export function EntityList<T>({
  mode,
  config,
  data = [],
  isLoading = false,
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
      <Grid
        data={data}
        isLoading={isLoading}
        mode={mode}
        options={options}
        table={table}
        width={width}
      />
    </Section>
  );
}

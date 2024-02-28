'use client';
import { Button, Group } from '@mantine/core';
import { Section } from '@megp/core-fe';
import {
  IconArrowsCross,
  IconDeviceFloppy,
  IconPlus,
} from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { defaultRelationConfig } from '../../models';
import type { CollectionQuery, RelationConfig } from '../../models';
import { visibleColumn } from '../../utilities/table';
import { Grid } from '../table/grid';
import { relationSelectColumn, remove } from '../table/header-column';

interface RelationProps<T> {
  mode?: 'list' | 'detail' | 'modal';
  config: RelationConfig<T>;
  data: T[];
  currentSelected?: T[];
  isSaving?: boolean;
  isLoading?: boolean;
  handleCloseModal?: () => void;
  onRequestChange?: (request: CollectionQuery) => void;
  showPopUp?: boolean;
  openDeleteModal?: (id) => void;
  openEditModal?: (id) => void;
  handleId?: (id) => void;
  collapsed?: boolean;
  setIsCollapsed?: (boolean) => void;
  readOnly?: boolean;
  total?: number;
}

export function Relation<T>({
  config,
  data: dataRender,
  mode = 'list',
  currentSelected,
  isSaving,
  isLoading,
  setIsCollapsed,
  collapsed = true,
  handleCloseModal,
  openDeleteModal,
  showPopUp,
  onRequestChange,
  openEditModal,
  readOnly,
  total,
}: RelationProps<T>): React.ReactElement {
  const options: RelationConfig<T> = useMemo(() => {
    return { ...defaultRelationConfig, ...config };
  }, [config]);

  const [selected, setSelected] = useState<T[]>([]);

  // construct header columns with the select column and action column
  const tableColumns = useMemo<ColumnDef<T>[]>(
    () => [
      ...(options.selectable && mode === 'modal'
        ? [relationSelectColumn(selected, setSelected)]
        : []),
      ...options.columns.map((column) => ({
        ...column,
      })),

      ...(mode !== 'modal' && !readOnly
        ? [remove(openEditModal, showPopUp)]
        : []),
    ],

    [options, mode, selected, readOnly, openEditModal, showPopUp],
  );

  const [width, setWidth] = useState(100);
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);

  // change the width of the table columns when the mode changes
  useEffect(() => {
    let columnCount = tableColumns.length;
    columnCount = options.selectable ? columnCount - 1 : columnCount;
    const w = mode !== 'list' ? 100 : (1 / columnCount) * 100;
    setWidth(w);
  }, [mode]);

  useEffect(() => {
    setData(dataRender);
  }, [dataRender]);

  const table = useReactTable({
    data,
    state: {
      columnVisibility: visibleColumn(tableColumns, options.primaryContent),
      rowSelection,
      sorting,
    },
    onRowSelectionChange: setRowSelection,
    enableMultiRowSelection: !options.disableMultiSelect,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      enableHiding: false,
    },

    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    enableRowSelection: true,
    meta: {
      removeSelectedRows: (selectedRows) => {
        showPopUp
          ? openDeleteModal && openDeleteModal(selectedRows?.id)
          : setData?.(data.filter((item) => item.id !== selectedRows?.id));
      },
      updateData: (rowIndex: number) => {
        data.map((row, index) => {
          if (index === rowIndex) {
            openEditModal && openEditModal(row.id);
          }
          return rowIndex;
        });
      },
    },
  });

  useEffect(() => {
    const generateRowSelection = (d, selectedData) => {
      const rowSelected = {};
      selectedData?.forEach((selecte) => {
        const index = d.findIndex((item) => item.id === selecte.id);
        if (index !== -1) {
          rowSelected[index] = true;
        }
      });
      return rowSelected;
    };
    const selectedRowa = generateRowSelection(data, currentSelected);

    setRowSelection(selectedRowa);
  }, [data, currentSelected]);

  useEffect(() => {
    currentSelected && setSelected(() => [...selected, ...currentSelected]);
  }, [currentSelected]);

  const body = (
    <>
      <Grid
        data={data}
        isLoading={isLoading}
        mode={mode}
        onRequestChange={onRequestChange}
        options={options}
        table={table}
        total={total}
        width={width}
      />

      <Group
        className={
          mode === 'modal' ? 'border-t pt-4 flex justify-end' : 'border-t pt-4'
        }
      >
        {options.onSave ? (
          <>
            {!readOnly && (
              <Button
                leftSection={<IconDeviceFloppy size={14} stroke={1.6} />}
                loading={isSaving}
                onClick={() => {
                  mode === 'modal'
                    ? options.onSave?.(selected as T[])
                    : options.onSave?.(data as T[]);
                }}
              >
                {mode === 'modal' ? 'Done' : 'Save'}
              </Button>
            )}

            {handleCloseModal ? (
              <Button
                color="red"
                leftSection={<IconArrowsCross size={14} stroke={1.6} />}
                onClick={() => {
                  handleCloseModal();
                }}
              >
                cancel
              </Button>
            ) : null}
          </>
        ) : null}
      </Group>
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
                {openEditModal ? 'Add' : 'Assign'}
              </Button>
            ) : null
          }
          defaultCollapsed={Boolean(collapsed)}
          setIsCollapsed={setIsCollapsed}
          title={options.title}
        >
          {body}
        </Section>
      )}
    </>
  );
}

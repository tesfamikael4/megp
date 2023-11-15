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
import { defaultRelationConfig, type RelationConfig } from '../../models';
import { visibleColumn } from '../../utilities/table';
import { Grid } from '../table/grid';
import { remove, selectColumn } from '../table/header-column';

interface RelationProps<T> {
  mode?: 'list' | 'detail' | 'modal';
  config: RelationConfig<T>;
  data: T[];
  currentSelected?: T[];
  isSaving?: boolean;
  isLoading?: boolean;
  handleCloseModal?: () => void;

  showPopUp?: boolean;
  openDeleteModal?: (id) => void;
  openEditModal?: (id) => void;
  handleId?: (id) => void;
  collapsed?: boolean;
  readOnly?: boolean;
}

export function Relation<T>({
  config,
  data: dataRender,
  mode = 'list',
  currentSelected,
  isSaving,
  isLoading,
  collapsed = true,
  handleCloseModal,
  openDeleteModal,
  showPopUp,
  openEditModal,
  readOnly,
}: RelationProps<T>): React.ReactElement {
  const options: RelationConfig<T> = useMemo(() => {
    return { ...defaultRelationConfig, ...config };
  }, [config]);

  // construct header columns with the select column and action column
  const tableColumns = useMemo<ColumnDef<T>[]>(
    () => [
      ...(options.selectable && mode === 'modal' ? [selectColumn] : []),
      ...options.columns.map((column) => ({
        ...column,
        meta: { widget: 'primary' },
      })),

      ...(mode !== 'modal' && !readOnly
        ? [remove(openEditModal, showPopUp)]
        : []),
    ],

    [
      options.selectable,
      options.columns,
      mode,
      readOnly,
      openEditModal,
      showPopUp,
    ],
  );

  const [width, setWidth] = useState(100);
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  // const [isexpanded, setIsExpanded] = useState(true);

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
      columnVisibility: visibleColumn(
        tableColumns,
        options.primaryContent,
        mode,
      ),
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
  const body = (
    <>
      <Grid
        data={data}
        isLoading={isLoading}
        mode={mode}
        options={options}
        table={table}
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
                    ? options.onSave?.(
                        table
                          .getSelectedRowModel()
                          .flatRows.map((s: any) => s.original) as T[],
                      )
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
          title={options.title}
        >
          {body}
        </Section>
      )}
    </>
  );
}

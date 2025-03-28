import type { ReactElement } from 'react';
import React, { useEffect, useRef } from 'react';
import { ActionIcon, Box, Checkbox, Menu, Radio, Text } from '@mantine/core';
import {
  IconArrowRight,
  IconChevronDown,
  IconChevronRight,
  IconCircleMinus,
  IconDotsVertical,
  IconMinus,
  IconPencil,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import styles from './grid.module.scss';

type Props = {
  indeterminate?: boolean;
} & React.HTMLProps<HTMLInputElement>;

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: Props): ReactElement {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <Checkbox
      className={`${className} cursor-pointer`}
      indeterminate={indeterminate}
      ref={ref as any}
      size={'xs' as any}
      type="checkbox"
      {...rest}
    />
  );
}

const detailBtn = (info: any, onDetail) => {
  const handleCellClick = () => {
    onDetail(info.row.original);
  };

  return (
    <ActionIcon
      className={styles.actionBtn}
      color="primary"
      onClick={handleCellClick}
      variant="outline"
    >
      <IconArrowRight size={18} />
    </ActionIcon>
  );
};

export const selectColumn = {
  id: 'select',
  meta: {
    widget: 'select',
  },
  size: 40,
  header: ({ table }) => (
    <IndeterminateCheckbox
      checked={table.getIsAllRowsSelected()}
      indeterminate={table.getIsSomeRowsSelected()}
      onChange={table.getToggleAllRowsSelectedHandler()}
    />
  ),
  cell: ({ row }) => (
    <div>
      <IndeterminateCheckbox
        checked={row.getIsSelected()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    </div>
  ),
};
export const relationSelectColumn = (selected, setSelected) => {
  const id = selected?.map((sel) => sel.id);

  return {
    id: 'select',
    meta: {
      widget: 'select',
    },
    size: 40,
    header: ({ table }) => {
      const toggleSelectAllRows = (event) => {
        if (event.target.checked) {
          const selectedModified = table?.options.data?.map((row) => row);
          setSelected(selectedModified);
        } else {
          setSelected([]);
        }
      };
      return (
        <IndeterminateCheckbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={toggleSelectAllRows}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          <Checkbox
            checked={id?.includes(row.original.id)}
            onChange={(data) => {
              if (data.target.checked) setSelected([...selected, row.original]);
              else
                setSelected([
                  ...selected.filter((s) => s.id !== row.original.id),
                ]);
            }}
          />
        </div>
      );
    },
  };
};

export const removeSingleRow = () => {
  return {
    id: 'action',
    accessorKey: '',
    size: 40,
    header: <p className="ml-auto">Action</p>,
    meta: {
      widget: 'action',
    },

    cell: ({ row, table }) => {
      const meta = table.options.meta;

      const removeRow = () => {
        meta?.removeSelectedRows(row.original);
      };

      return (
        <ActionIcon color="primary" onClick={removeRow} variant="subtle">
          <IconCircleMinus color="red" size={15} />
        </ActionIcon>
      );
    },
  };
};
export const remove = (openEditModal, showPopUp) => {
  return {
    id: 'action',
    accessorKey: '',
    size: 40,
    header: <p className="ml-auto">Action</p>,
    meta: {
      widget: 'action',
    },

    cell: ({ row, table }) => {
      const meta = table.options.meta;

      const removeRow = () => {
        meta?.removeSelectedRows(row.original);
      };

      const enableEdit = () => {
        meta?.updateData(row.index);
        openEditModal(row.original.id);
      };

      return (
        <ActionIcon color="primary" onClick={removeRow} variant="subtle">
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <IconDotsVertical size={18} />
            </Menu.Target>
            <Menu.Dropdown>
              {openEditModal ? (
                <Menu.Item
                  leftSection={<IconPencil size={15} />}
                  onClick={enableEdit}
                >
                  Edit
                </Menu.Item>
              ) : null}
              {showPopUp ? (
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={15} />}
                  onClick={removeRow}
                >
                  Delete
                </Menu.Item>
              ) : (
                <Menu.Item
                  color="red"
                  leftSection={<IconX size={15} />}
                  onClick={removeRow}
                >
                  Remove
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </ActionIcon>
      );
    },
  };
};

export const actionColumn = (options) => {
  return {
    id: 'action',
    accessorKey: options.primaryKey,
    header: '',
    size: 40,
    cell: (info: any) => (
      <Box className="ml-auto">{detailBtn(info, options.onDetail)}</Box>
    ),
  };
};

export const Expand = (parentUnitId, setParentUnitId, id) => {
  return {
    id: 'select',
    meta: {
      widget: 'expand',
    },
    size: 40,
    header: '',
    accessorKey: 'name',
    cell: (props) => {
      return (
        <div
          className={styles.tree}
          style={{ paddingLeft: `${props.row.depth * 2}rem` }}
        >
          <div>
            <ActionIcon
              className={styles.buttonModal}
              color="primary"
              onClick={props.row.getToggleExpandedHandler()}
              size={15}
              variant="outline"
            >
              {props.row.getIsExpanded() ? (
                <IconMinus size={10} stroke={1} />
              ) : (
                <IconPlus size={10} stroke={1} />
              )}
            </ActionIcon>
          </div>
          <Radio
            checked={parentUnitId === props.row.original.id}
            className={styles.buttonModal}
            disabled={id ? id.toString() === props.row.original.id : false}
            onChange={() => {
              setParentUnitId(props.row.original.id);
            }}
          />

          <Text fw={600}>{props.getValue()}</Text>
        </div>
      );
    },
  };
};

export const newExpand = {
  id: 'select',
  accessorKey: 'name',
  size: 40,
  meta: {
    widget: 'expand',
  },
  header: '',
  cell: (props) => {
    return (
      <div
        className="flex  "
        style={{
          marginLeft: `${props.row.depth * 2}rem`,
        }}
      >
        <div className="pr-2 mt-1">
          <ActionIcon
            className={styles.button}
            color="primary"
            onClick={props.row.getToggleExpandedHandler()}
            size={20}
            variant="subtle"
          >
            {props.row.getIsExpanded() ? (
              <IconChevronDown size={20} />
            ) : (
              <IconChevronRight size={20} />
            )}
          </ActionIcon>
        </div>

        <div />
        <Text fw={600}>{props.getValue()}</Text>
      </div>
    );
  },
};

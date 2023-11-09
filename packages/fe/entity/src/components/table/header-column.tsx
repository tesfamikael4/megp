import type { ReactElement } from 'react';
import React, { useEffect, useRef } from 'react';
import { ActionIcon, Checkbox, Menu, Radio, Text } from '@mantine/core';
import { useParams } from 'next/navigation';
import {
  IconArrowRight,
  IconDotsVertical,
  IconMinus,
  IconPlus,
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

export const remove = (openEditModal, showPopUp) => {
  return {
    id: 'action',
    accessorKey: '',
    size: 40,
    header: 'Action',
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
        <ActionIcon color="primary" variant="subtle">
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <IconDotsVertical size={18} />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={removeRow}>
                {' '}
                {showPopUp ? 'Delete' : 'Remove'}
              </Menu.Item>
              {openEditModal ? (
                <Menu.Item onClick={enableEdit}>Edit</Menu.Item>
              ) : null}
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
    cell: (info: any) => detailBtn(info, options.onDetail),
  };
};

export const Expand = (parentUnitId, setParentUnitId) => {
  const { id } = useParams();
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
        <div className="pr-2">
          <ActionIcon
            className={styles.button}
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

        <div />
        <Text fw={600}>{props.getValue()}</Text>
      </div>
    );
  },
};

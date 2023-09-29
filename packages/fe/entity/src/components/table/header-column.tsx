import type { ReactElement } from 'react';
import React, { useEffect, useRef } from 'react';
import { ActionIcon, Checkbox } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import styles from '../entity.module.scss';

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
    onDetail(info.getValue());
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

export const actionColumn = (options) => {
  return {
    id: 'action',
    accessorKey: options.primaryKey,
    header: '',
    size: 40,
    cell: (info: any) => detailBtn(info, options.onDetail),
  };
};

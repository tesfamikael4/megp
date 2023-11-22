import type { Cell } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { Text } from '@mantine/core';
import styles from './grid.module.scss';

function Widget<TData>({
  cell,
}: {
  cell: Cell<TData, unknown>;
}): React.ReactElement {
  const { widget } = cell.column.columnDef.meta ?? ({ widget: '' } as any);

  switch (widget) {
    case 'primary':
      return (
        <Text fw={500} fz={14} lineClamp={2}>
          {cell.getValue() as any}
        </Text>
      );
    case 'select':
      return <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>;
    case 'expand':
      return (
        <Text className={styles.expandBtn} fz={14} lineClamp={2}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </Text>
      );
    case 'action':
      return (
        <Text className={styles.menuBtn} fz={14} lineClamp={2}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </Text>
      );
    case 'new':
      return <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>;
  }

  return (
    <Text className={styles.text} fz={14} lineClamp={2}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </Text>
  );
}

export default Widget;

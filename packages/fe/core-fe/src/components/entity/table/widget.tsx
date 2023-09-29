import type { Cell } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { Text } from '@mantine/core';

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
  }

  return (
    <Text fz={14} lineClamp={2}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </Text>
  );
}

export default Widget;

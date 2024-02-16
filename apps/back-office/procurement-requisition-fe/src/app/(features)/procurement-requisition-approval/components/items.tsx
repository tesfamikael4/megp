import { Table, TableConfig } from '@megp/core-fe';
import { useLazyListByAppIdQuery } from '../../procurement-requisition/_api/items.api';
import { useEffect } from 'react';

const tableConfig: TableConfig<any> = {
  columns: [
    {
      id: 'itemCode',
      header: 'Code',
      accessorKey: 'itemCode',
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      id: 'unitPrice',
      header: () => <div className="text-right">Unit Price</div>,
      accessorKey: 'unitPrice',
      cell: ({ row: { original } }: any) => (
        <p className="text-right">
          {original.unitPrice.toLocaleString('en-US', {
            style: 'currency',
            currency: original?.currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      ),
    },
    {
      id: 'quantity',
      header: 'Quantity',
      accessorKey: 'quantity',
    },
    {
      id: 'uomName',
      header: 'UoM',
      accessorKey: 'uomName',
    },

    {
      id: 'totalEstimatedAmount',
      header: () => <div className="text-right">Total Amount</div>,
      accessorKey: 'totalEstimatedAmount',
      cell: ({ row: { original } }: any) => (
        <p className="text-right">
          {(original.unitPrice * original.quantity).toLocaleString('en-US', {
            style: 'currency',
            currency: original?.currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      ),
    },
  ],
};

export const Items = ({ activityId }: { activityId: string }) => {
  const [listItems, { data }] = useLazyListByAppIdQuery();

  useEffect(() => {
    listItems(activityId);
  }, []);
  return <Table config={tableConfig} data={data?.items ?? []} />;
};

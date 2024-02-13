import { useLazyListByAppIdQuery } from '../../../_api/items.api';
import { useEffect } from 'react';
import { ExpandableTable } from '../../../_components/expandable-table';
import { DetailItem } from '../../../_components/deatil-item';

const config = {
  isExpandable: true,
  expandedRowContent: (record) => <DetailItem data={record} />,
  columns: [
    {
      accessor: 'description',
    },
    {
      accessor: 'unitPrice',
      textAlign: 'right',
      width: 150,
      render: (record) => (
        <p className="text-right">
          {parseFloat(record.unitPrice).toLocaleString('en-US', {
            style: 'currency',
            currency: record?.currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      ),
    },
    {
      accessor: 'quantity',
      width: 100,
    },
    // {
    //   title: 'UoM',
    //   accessor: 'uomName',
    // },

    {
      title: 'Total Amount',
      accessor: 'totalEstimatedAmount',
      textAlign: 'right',
      render: (record) => (
        <p className="text-right">
          {(
            parseFloat(record.unitPrice) * parseFloat(record.quantity)
          ).toLocaleString('en-US', {
            style: 'currency',
            currency: record?.currency,
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
  return (
    <ExpandableTable
      config={config}
      data={data?.items ?? []}
      total={(data as any)?.total ?? 0}
    />
  );
};

import { Box } from '@mantine/core';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useLazyListByIdQuery } from '@/app/(features)/_api/disbersment.api';
import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { useLazyListByIdQuery as useLazyGetActivityQuery } from '@/app/(features)/_api/pr-activity.api';

export const Disbursement = ({ activityId }: { activityId?: string }) => {
  const { id } = useParams();

  const [trigger, { data: assignedActivity }] = useLazyGetActivityQuery();

  useEffect(() => {
    id !== undefined &&
      trigger({ id: id?.toString(), collectionQuery: undefined });
  }, [id, trigger]);

  const [
    getDisbursement,
    {
      data: disbursement,

      isLoading: isDisbursementLoading,
    },
  ] = useLazyListByIdQuery();

  useEffect(() => {
    getDisbursement({
      id: activityId ?? id.toString(),
      collectionQuery: undefined,
    });
  }, [activityId, getDisbursement, id]);

  const config = {
    idAccessor: 'budgetYear',
    isLoading: isDisbursementLoading,

    columns: [
      {
        title: 'Budget Year',
        accessor: 'budgetYear',
      },
      {
        title: '1st Quarter',
        accessor: 'quarter1',
        textAlign: 'right',
        render: (record) => (
          <p>
            {parseInt(record.quarter1).toLocaleString('en-US', {
              style: 'currency',
              currency: assignedActivity?.items?.[0]?.currency ?? 'MKW',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
      {
        title: '2nd Quarter',
        accessor: 'quarter2',
        textAlign: 'right',
        render: (record) => (
          <p>
            {parseInt(record.quarter2).toLocaleString('en-US', {
              style: 'currency',
              currency: assignedActivity?.items?.[0]?.currency ?? 'MKW',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
      {
        title: '3rd Quarter',
        accessor: 'quarter3',
        textAlign: 'right',
        render: (record) => (
          <p>
            {parseInt(record.quarter3).toLocaleString('en-US', {
              style: 'currency',
              currency: assignedActivity?.items?.[0]?.currency ?? 'MKW',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
      {
        title: '4th Quarter',
        accessor: 'quarter4',
        textAlign: 'right',
        render: (record) => (
          <p>
            {parseInt(record.quarter4).toLocaleString('en-US', {
              style: 'currency',
              currency: assignedActivity?.items?.[0]?.currency ?? 'MKW',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
      {
        title: 'Total Amount',
        accessor: 'amount',
        textAlign: 'right',
        render: (record) => (
          <p>
            {parseInt(record.amount).toLocaleString('en-US', {
              style: 'currency',
              currency: assignedActivity?.items?.[0]?.currency ?? 'MKW',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
    ],
  };

  return (
    <Box className="mt-2">
      <ExpandableTable
        data={disbursement ? disbursement?.items : []}
        config={config}
      />
    </Box>
  );
};

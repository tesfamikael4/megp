import { ExpandableTable, ExpandableTableConfig } from '@megp/core-fe';
import { DetailTable } from '../../_components/detail-table';
import { Box, Modal, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useMemo } from 'react';
import { useLazyGetActivityByBudgetIdQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';

const ActivityDetail = ({ data }: { data: any }) => {
  const config: ExpandableTableConfig = useMemo(
    () => ({
      isSearchable: true,
      primaryColumn: 'name',
      columns: [
        {
          accessor: 'name',
          title: 'Activity',
          render: (data) => <p>{data.name}</p>,
          width: 50,
        },
        {
          accessor: 'estimatedAmount',
          title: 'Estimated Amount',
          render: (data) => (
            <>
              <p>
                {parseInt(data.estimatedAmount).toLocaleString('en-US', {
                  style: 'currency',
                  currency: data.currency,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  currencyDisplay: 'code',
                })}
              </p>{' '}
            </>
          ),
          width: 50,
        },
      ],
    }),
    [],
  );

  return (
    <ExpandableTable config={config} data={data} total={data?.length ?? 0} />
  );
};
export const ModalDetail = ({ data }: { data: any }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [getActivityByBudget, { data: activities }] =
    useLazyGetActivityByBudgetIdQuery();

  useEffect(() => {
    if (data?.id) {
      getActivityByBudget(data.id);
    }
  }, [data?.id, getActivityByBudget]);

  const detailData = useMemo(
    () => [
      {
        key: 'Budget Code',
        value: data?.budgetCode,
      },
      {
        key: 'Description',
        value: data?.description,
      },
      {
        key: 'Allocated Budget',
        value: parseInt(data?.allocatedBudget).toLocaleString('en-US', {
          style: 'currency',
          currency: data.currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      },
      {
        key: 'Revised Budget',
        value: parseInt(data?.revisedBudget).toLocaleString('en-US', {
          style: 'currency',
          currency: data.currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      },
      {
        key: 'Obligated Budget',
        value: parseInt(data?.obligatedBudget).toLocaleString('en-US', {
          style: 'currency',
          currency: data.currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      },
      {
        key: 'Available Budget',
        value: parseInt(data?.availableBudget).toLocaleString('en-US', {
          style: 'currency',
          currency: data.currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      },
      {
        key: 'Funding Source',
        value: data?.fundingSource,
      },
      {
        key: 'Currency',
        value: data?.currency.toLocaleString('en-US', {
          style: 'currency',
          currency: data.currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      },
      {
        key: 'Type',
        value: data?.type,
      },
    ],
    [data],
  );

  return (
    <Box className="bg-white p-5">
      <DetailTable data={detailData} />
      <Button className="mt-4 ml-auto" onClick={open}>
        Show Detail
      </Button>
      <Modal opened={opened} onClose={close} size="xl" title="Activity Details">
        <ActivityDetail data={activities} />
        <Button className="mt-4 ml-auto" onClick={close}>
          Close
        </Button>
      </Modal>
    </Box>
  );
};

'use client';
import { useEffect, useState } from 'react';
import { useLazyListByIdQuery as useLazyGetActivitiesQuery } from '../../_api/activity.api';
import { useCreateMutation } from '@/app/(features)/procurement-requisition/_api/procurement-requisition.api';
import { useGetBudgetYearQuery } from '@/store/api/budget/budget-year.api';
import { ExpandableTable } from '../../_components/expandable-table';
import {
  Box,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Select,
} from '@mantine/core';
import { DetailActivity } from './detail-activity';
import { notify } from '@megp/core-fe';
import { useRouter } from 'next/navigation';
// import ActivityItemDetail from './activity-item-detail';

export const ActivitySelector = () => {
  const [selected, setSelected] = useState<any | any[]>([]);
  const [selectedBudgetYear, setSelectedBudgetYear] = useState<
    string | undefined
  >();
  const [selectedActivity, setSelectedActivity] = useState<undefined | any>(
    undefined,
  );

  const {
    data: budget,
    isSuccess: budgetFetched,
    isLoading: isBudgetYearLoading,
  } = useGetBudgetYearQuery(undefined);
  const config = {
    selectable: true,
    selectedItems: selected,
    setSelectedItems: setSelected,
    isSearchable: true,
    disableMultiSelect: true,
    isExpandable: true,
    expandedRowContent: (record) => {
      return (
        <DetailActivity
          activity={record}
          onDetail={(activity) => setSelectedActivity(activity)}
        />
      );
    },
    columns: [
      {
        title: '#Ref',
        accessor: 'procurementReferenceNumber',
        width: 100,
      },
      {
        title: 'Name',
        accessor: 'activityName',
        width: 250,
      },
      {
        title: 'Description',
        accessor: 'description',
      },

      {
        title: 'Total Amount',
        accessor: 'estimatedAmount',
        textAlign: 'right',
        width: 150,
        render: (record) => (
          <p>
            {parseFloat(record.estimatedAmount).toLocaleString('en-US', {
              style: 'currency',
              currency: record.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
    ],
  };
  const router = useRouter();

  const [listById, { data: prActivity, isLoading: loadingActivity }] =
    useLazyGetActivitiesQuery();

  const [create, { isLoading: isSaving }] = useCreateMutation();

  const onCreate = async () => {
    try {
      const result = await create({ id: selected[0].id }).unwrap();

      router.push(`/procurement-requisition/${result.id}`);

      notify('Success', 'Procurement requisition created successfully');
    } catch (err) {
      notify('Error', 'Error in creating Procurement requisition');
    }
  };

  useEffect(() => {
    budgetFetched && setSelectedBudgetYear(budget?.items?.[0]?.id);
  }, [budget?.items, budgetFetched]);

  useEffect(() => {
    if (budgetFetched) {
      onRequestChange({ skip: 0, take: 10 });
    }
  }, [budget, budgetFetched, selectedBudgetYear]);
  const onRequestChange = (collectionQuery) => {
    if (budgetFetched && selectedBudgetYear !== undefined)
      listById({
        id: selectedBudgetYear,
        collectionQuery: {
          ...collectionQuery,
          includes: ['procurementMechanisms', 'annualProcurementPlanItems'],
          where: [
            ...(collectionQuery?.where ?? []),
            [
              {
                column: 'status',
                value: 'Assigned',
                operator: '!=',
              },
            ],
          ],
        },
      });
  };

  return (
    <Box pos={'relative'}>
      <LoadingOverlay visible={loadingActivity || isBudgetYearLoading} />
      {!selectedActivity && (
        <>
          <Group w={300}>
            <Select
              value={selectedBudgetYear}
              onChange={(e: any) => {
                setSelectedBudgetYear(e?.id);
              }}
              data={budget?.items.map((b) => {
                return {
                  value: b.id,
                  label: b.name,
                };
              })}
            />
          </Group>

          <ExpandableTable
            config={config}
            data={prActivity?.items ?? []}
            total={prActivity?.total ?? 0}
            onRequestChange={onRequestChange}
          />
          <Divider h={10} />
          <Group justify="end">
            <Button
              onClick={onCreate}
              disabled={selected.length === 0}
              loading={isSaving}
            >
              Done
            </Button>
          </Group>
        </>
      )}
    </Box>
  );
};

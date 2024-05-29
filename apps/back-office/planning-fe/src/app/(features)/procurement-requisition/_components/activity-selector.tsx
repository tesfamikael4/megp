'use client';
import { useEffect, useState } from 'react';
import { useLazyListByIdQuery as useLazyGetActivitiesQuery } from '../_api/activities.api';
import { useCreatePrFromPlanMutation } from '@/app/(features)/procurement-requisition/_api/custom.api';
import { useGetPostBudgetPlansQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';
import {
  Box,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Select,
} from '@mantine/core';
import { DetailActivity } from './detail-activity';
import { ExpandableTable, notify } from '@megp/core-fe';
import { useRouter } from 'next/navigation';
import { useAuth } from '@megp/auth';

export const ActivitySelector = () => {
  const [selected, setSelected] = useState<any | any[]>([]);
  const { user } = useAuth();

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
  } = useGetPostBudgetPlansQuery(undefined);
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
        accessor: 'procurementReference',
        width: 100,
      },
      {
        title: 'Name',
        accessor: 'name',
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

  const [create, { isLoading: isSaving }] = useCreatePrFromPlanMutation();

  const onCreate = async () => {
    try {
      const result = await create({
        id: selected[0].id,
      }).unwrap();

      router.push(`/procurement-requisition/${result.id}`);

      notify('Success', 'Procurement requisition created successfully');
    } catch (err) {
      if (err?.data?.statusCode === 430) {
        notify('Error', err?.data?.message);
      } else {
        notify('Error', 'Error in creating Procurement requisition');
      }
    }
  };

  useEffect(() => {
    budgetFetched &&
      setSelectedBudgetYear(
        budget?.items.filter((b) => b.status === 'Approved')?.[0]?.id,
      );
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
          includes: [
            'postProcurementMechanism',
            'postBudgetPlanItems',
            'postBudgetRequisitioners',
          ],
          where: [
            ...(collectionQuery?.where ?? []),
            [
              {
                column: 'status',
                value: 'USED_IN_PR',
                operator: '!=',
              },
            ],
            [
              {
                column: 'postBudgetRequisitioners.userId',
                value: `${user?.organizations?.[0]?.userId}`, //todo: will replace with ${user?.id}
                operator: '=',
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
          <Group w={500}>
            <Select
              w={'300'}
              label="Budget Year"
              value={selectedBudgetYear}
              onChange={(e: any) => {
                setSelectedBudgetYear(e);
              }}
              data={budget?.items
                .filter((b) => b.status === 'Approved')
                .map((b) => {
                  return {
                    value: b.id,
                    label: b.app.planName,
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

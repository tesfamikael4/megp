'use client';

import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { useLazyListByIdQuery } from './_api/activities.api';
import { useParams, useRouter } from 'next/navigation';
import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { IconChevronRight, IconPlus } from '@tabler/icons-react';
import { DetailActivity } from '@/app/(features)/(app)/_components/detail-activity';
import { useGetPreBudgetPlanQuery } from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import PlanningTab from '../../../_components/planning-tab';

export default function PreBudget() {
  const { budgetYear } = useParams();
  const { data: preBudgetYear } = useGetPreBudgetPlanQuery(
    budgetYear as string,
  );
  const [listById, { data: list }] = useLazyListByIdQuery();
  const router = useRouter();

  const config: ExpandableTableConfig = {
    columns: [
      {
        accessor: 'procurementReference',
        title: 'Reference',
        width: 150,
        sortable: true,
      },
      { accessor: 'name', title: 'Name', width: 300, sortable: true },
      { accessor: 'description', title: 'Description', sortable: true },
      {
        accessor: 'estimatedAmount',
        title: 'Total Amount',
        textAlign: 'right',
        render: (activity) => (
          <>
            {parseFloat(activity.estimatedAmount).toLocaleString('en-US', {
              style: 'currency',
              currency: activity.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </>
        ),
        width: 200,
        sortable: true,
      },
      {
        accessor: '',
        title: '',
        render: (record) =>
          record.reasons.length == 0 ? (
            <Tooltip label={'Aligns perfectly with the rule'}>
              <p className="text-green-500 text-3xl">•</p>
            </Tooltip>
          ) : (
            <Tooltip label={'Violated the rule'}>
              <p className="text-red-500 text-3xl">•</p>
            </Tooltip>
          ),
        width: 50,
      },
      {
        accessor: 'id',
        title: '',
        render: (activity) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/pre-budget-plan/${budgetYear}/activities/${activity.id}`,
              );
            }}
          >
            <IconChevronRight />
          </ActionIcon>
        ),
        width: 50,
      },
    ],
    isExpandable: true,
    isSearchable: true,
    primaryColumn: 'name',
    expandedRowContent: (activity) => {
      return <DetailActivity activity={activity} page="pre" />;
    },
  };

  const onRequestChange = (request: any) => {
    listById({
      id: budgetYear as string,
      collectionQuery: {
        ...request,
        includes: ['reasons', 'preProcurementMechanism'],
        orderBy: [
          ...request.orderBy,
          {
            column: 'createdAt',
            direction: 'ASC',
          },
        ],
      },
    });
  };
  return (
    <>
      <PlanningTab page="pre" />
      <Section
        title="Activities"
        collapsible={false}
        action={
          preBudgetYear?.status == 'Draft' && (
            <Button
              onClick={() =>
                router.push(`/pre-budget-plan/${budgetYear}/activities/new`)
              }
            >
              <IconPlus size={14} /> Add
            </Button>
          )
        }
      >
        <ExpandableTable
          config={config}
          data={list?.items ?? []}
          total={list?.total ?? 0}
          onRequestChange={onRequestChange}
        />
      </Section>
    </>
  );
}

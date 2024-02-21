'use client';

import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { Section } from '@megp/core-fe';
import { useLazyListByIdQuery } from './_api/activities.api';
import { useParams, useRouter } from 'next/navigation';
import { ActionIcon, Button } from '@mantine/core';
import { IconChevronRight, IconPlus } from '@tabler/icons-react';
import { DetailActivity } from '@/app/(features)/(app)/_components/detail-activity';
import { useGetPostBudgetPlanQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';

export default function PostBudget() {
  const { budgetYear } = useParams();
  const { data: postBudgetYear } = useGetPostBudgetPlanQuery(
    budgetYear as string,
  );
  const [listById, { data: list }] = useLazyListByIdQuery();
  const router = useRouter();

  const config = {
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
        sortable: true,
        render: (activity) => (
          <>
            {parseInt(activity.estimatedAmount).toLocaleString('en-US', {
              style: 'currency',
              currency: activity.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </>
        ),
        width: 200,
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
                `/post-budget-plan/${budgetYear}/activities/${activity.id}`,
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
      return <DetailActivity activity={activity} page="post" />;
    },
  };

  const onRequestChange = (request: any) => {
    listById({
      id: budgetYear as string,
      collectionQuery: { ...request, includes: ['postProcurementMechanisms'] },
    });
  };
  return (
    <Section
      title="Activities"
      collapsible={false}
      action={
        postBudgetYear?.status == 'Draft' && (
          <Button
            onClick={() =>
              router.push(`/post-budget-plan/${budgetYear}/activities/new`)
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
  );
}

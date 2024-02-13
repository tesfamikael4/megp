'use client';

import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { Section, logger } from '@megp/core-fe';
import { useRouter } from 'next/navigation';
import { ActionIcon } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useLazyGetPostBudgetPlansQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';

export default function PreBudgetPlanApproval() {
  const [getPlan, { data }] = useLazyGetPostBudgetPlansQuery();
  const router = useRouter();

  useEffect(() => {
    getPlan({
      where: [
        [
          {
            column: 'status',
            value: 'Submitted',
            operator: '=',
          },
        ],
      ],
    });
  }, []);

  const config = {
    columns: [
      {
        accessor: 'planName',
        title: 'Plan Name',
        sortable: true,
        render: (record) => <p>{record.app.planName}</p>,
      },
      {
        accessor: 'budgetYear',
        title: 'Budget Year',
        width: 300,
        sortable: true,
        render: (record) => <p>{record.app.budgetYear}</p>,
      },
      {
        accessor: 'id',
        title: '',
        render: (record) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/post-budget-plan-approval/${record.id}`);
            }}
          >
            <IconChevronRight />
          </ActionIcon>
        ),
        width: 50,
      },
    ],
    isSearchable: true,
    primaryColumn: 'name',
  };

  const onRequestChange = (request: any) => {
    logger.log({ request });
  };
  return (
    <Section
      title="Pre Budget Plans"
      subTitle="Pre Budget Plans to be approved"
      collapsible={false}
    >
      <ExpandableTable
        config={config}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
      />
    </Section>
  );
}

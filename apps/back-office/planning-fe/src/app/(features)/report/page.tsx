'use client';

import { Section } from '@megp/core-fe';
import { ExpandableTable } from '../_components/expandable-table';
import { ActionIcon } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useLazyGetPostBudgetPlansQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';

export default function ReportPage() {
  const router = useRouter();
  const config = {
    isSearchable: true,
    columns: [
      {
        accessor: 'planName',
        title: 'Plan Name',
        render: (record) => <p>{record.app.planName}</p>,
      },

      {
        accessor: 'action',
        title: '',
        width: 50,
        render: (record) => {
          return (
            <ActionIcon
              variant="outline"
              onClick={() => router.push(`/report/${record.id}/activities`)}
            >
              <IconChevronRight size={14} />
            </ActionIcon>
          );
        },
      },
    ],
  };

  const [getPostBudgetPlans, { data }] = useLazyGetPostBudgetPlansQuery();

  const onRequestChange = (collectionQuery) =>
    getPostBudgetPlans(collectionQuery);
  return (
    <Section title="Report" collapsible={false}>
      <ExpandableTable
        config={config}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
      />
    </Section>
  );
}

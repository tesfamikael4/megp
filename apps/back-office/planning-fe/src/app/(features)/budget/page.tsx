'use client';

import { ExpandableTable } from '../_components/expandable-table';
import { useLazyListQuery } from '../_api/app.api';
import { ActionIcon } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { Section } from '@megp/core-fe';
// import { useLazyListQuery } from '../_api/budget.api';
export default function BudgetPage() {
  const router = useRouter();
  const config = {
    columns: [
      {
        accessor: 'budgetYear',
        title: 'Budget Year',
      },
      {
        accessor: 'startDate',
        title: 'Start Date',
        render: (record) => (
          <p>
            {new Date(record.budgetYears.startDate).toLocaleDateString(
              'en-US',
              {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              },
            )}
          </p>
        ),
      },
      {
        accessor: 'endDate',
        title: 'End Date',
        render: (record) => (
          <p>
            {new Date(record.budgetYears.endDate).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })}
          </p>
        ),
      },
      {
        accessor: 'action',
        title: 'Action',
        width: 100,
        render: (record) => (
          <ActionIcon
            variant="outline"
            onClick={() => {
              router.push(`/budget/${record.id}`);
            }}
          >
            <IconChevronRight />
          </ActionIcon>
        ),
      },
    ],
    primaryColumn: 'budgetYear',
    isSearchable: true,
  };

  //rtk
  const [getBudgetYears, { data: list }] = useLazyListQuery({} as any);

  //helpers
  const onRequestChange = (collectionQuery) =>
    getBudgetYears({ ...collectionQuery, includes: ['budgetYears'] });
  return (
    <>
      <Section title="Budget" collapsible={false}>
        <ExpandableTable
          data={list?.items ?? []}
          config={config}
          onRequestChange={onRequestChange}
          total={list?.total ?? 0}
        />
      </Section>
    </>
  );
}

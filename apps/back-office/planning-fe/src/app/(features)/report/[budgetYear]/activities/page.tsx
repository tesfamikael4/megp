'use client';

import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { Section } from '@megp/core-fe';
import { useLazyListByIdQuery } from './_api/activities.api';
import { useParams, useRouter } from 'next/navigation';
import { ActionIcon, Flex, Tooltip } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { DetailActivity } from '@/app/(features)/_components/detail-activity';

export default function PreBudget() {
  const { budgetYear } = useParams();
  const [listById, { data: list }] = useLazyListByIdQuery();
  const router = useRouter();

  const config = {
    columns: [
      { accessor: 'procurementReference', title: 'Reference', width: 150 },
      { accessor: 'name', title: 'Name', width: 300 },
      { accessor: 'description', title: 'Description' },
      {
        accessor: 'estimatedAmount',
        title: 'Total Amount',
        textAlign: 'right',
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
              router.push(`/report/${budgetYear}/activities/${activity.id}`);
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
    listById({ id: budgetYear as string, collectionQuery: request });
  };
  return (
    <Section
      title={
        <Tooltip
          label="List Budget Years"
          className="cursor-pointer"
          onClick={() => router.push(`/report/`)}
        >
          <Flex align="center">
            <IconChevronLeft />
            Activities
          </Flex>
        </Tooltip>
      }
      collapsible={false}
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

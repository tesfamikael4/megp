'use client';

import { ActionIcon, Box } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { ExpandableTable } from '../_components/expandable-table';
import { useLazyListQuery } from './_api/tender.api';

export default function Solicitation() {
  const [trigger, { data, isFetching }] = useLazyListQuery();
  const router = useRouter();

  const config = {
    columns: [
      { accessor: 'name', title: 'Name', width: 200 },
      {
        accessor: 'procurementReferenceNumber',
        title: 'Procurement Reference Number',

        width: 200,
      },
      {
        accessor: 'budgetAmount',
        title: 'Budget Amount',

        width: 200,
      },
      {
        accessor: 'budgetCode',
        title: 'Budget Code',

        width: 200,
      },
      { accessor: 'status', title: 'Status', width: 200 },
      {
        accessor: 'id',
        title: '',
        render: (tender) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/solicitation/${tender.id}`);
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
    primaryColumn: 'title',
    isFetching: isFetching,
  };

  const onRequestChange = (request: any) => {
    trigger(request);
  };
  return (
    <Section title="Tenders" collapsible={false}>
      <Box className="">
        <ExpandableTable
          config={config}
          data={data?.items ?? []}
          total={data?.total ?? 0}
          onRequestChange={onRequestChange}
        />
      </Box>
    </Section>
  );
}

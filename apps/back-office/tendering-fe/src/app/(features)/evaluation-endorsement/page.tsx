'use client';

import { ActionIcon } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useLazyGetLotsQuery } from '@/store/api/tendering/technical-endorsement.api';

export default function BidOpening() {
  const router = useRouter();
  const [getLots, { data: lots, isLoading }] = useLazyGetLotsQuery();
  const config: ExpandableTableConfig = {
    isLoading: isLoading,
    isSearchable: true,
    columns: [
      {
        accessor: 'number',
        width: 70,
        sortable: true,
      },
      {
        accessor: 'name',
        width: 400,
        sortable: true,
      },
      {
        accessor: 'milestone',
        width: 100,
        sortable: true,
        render: (record) =>
          record?.tenderMilestones
            ?.filter((milestone) => milestone.isCurrent)?.[0]
            ?.milestoneTxt?.replace(/([a-z])([A-Z])/g, '$1 $2') ?? '',
      },

      {
        accessor: '',
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/evaluation-endorsement/${record.id}`);
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
        width: 10,
      },
    ],
  };

  return (
    <>
      <Section title="Lots List" collapsible={false} className="mt-2">
        <ExpandableTable
          config={config}
          data={lots?.items ?? []}
          total={lots?.total ?? 0}
          onRequestChange={(request) => {
            getLots(request);
          }}
        />
      </Section>
    </>
  );
}

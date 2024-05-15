'use client';

import { ActionIcon, Text } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useLazyGetLotsByTenderIdQuery } from '@/store/api/tendering/tendering.api';
import { TenderOverView } from '../_components/tender-overview';

export default function BidOpening() {
  const router = useRouter();
  const { tenderId } = useParams();
  const [getLots, { data: lots, isLoading }] = useLazyGetLotsByTenderIdQuery();
  const config: ExpandableTableConfig = {
    isLoading: isLoading,
    isSearchable: true,
    columns: [
      {
        accessor: 'name',
        width: 400,
        sortable: true,
      },
      {
        accessor: 'status',
        width: 50,
        sortable: true,
      },

      {
        accessor: '',
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/evaluation/${tenderId}/${record.id}`);
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
      <TenderOverView basePath="/evaluation" />
      <Section title="Lots List" collapsible={false} className="mt-2">
        <ExpandableTable
          config={config}
          data={lots?.items ?? []}
          total={lots?.total ?? 0}
          onRequestChange={(request) => {
            getLots({
              tenderId,
              collectionQuery: { ...request, includes: ['tenderMilestones'] },
            });
          }}
        />
      </Section>
    </>
  );
}

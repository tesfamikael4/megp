'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight, IconUsers } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { LotOverview } from '../../../_components/lot-overview';
import { useLazyGetItemsQuery } from '@/store/api/tendering/technical-responsiveness.api';
export default function BidOpening() {
  const router = useRouter();
  const { tenderId, lotId } = useParams();
  const [getItems, { data: items, isLoading: isItemsLoading }] =
    useLazyGetItemsQuery();
  const config: ExpandableTableConfig = {
    isSearchable: true,
    isLoading: isItemsLoading,
    columns: [
      {
        accessor: 'name',
        sortable: true,
      },
      {
        accessor: 'description',
      },
      {
        accessor: '',
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/evaluation/${tenderId}/${lotId}/responsiveness/${record.id}`,
              );
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
        width: 70,
      },
    ],
  };
  return (
    <>
      <LotOverview
        basePath={`/evaluation/${tenderId}`}
        milestone="technicalResponsiveness"
      />
      <Section
        title="Items List"
        collapsible={false}
        className="mt-2"
        action={
          <Tooltip label="Bidders List">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => {
                router.push(
                  `/evaluation/${tenderId}/${lotId}/responsiveness/bidders`,
                );
              }}
            >
              <IconUsers size={14} />
            </ActionIcon>
          </Tooltip>
        }
      >
        <ExpandableTable
          config={config}
          data={items?.items ?? []}
          total={items?.total ?? 0}
          onRequestChange={(request) => {
            getItems({ lotId, collectionQuery: request });
          }}
        />
      </Section>
    </>
  );
}

'use client';

import { ActionIcon, Badge } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { CollectionQuery } from '@megp/entity';
import { useLazyListQuery } from '../../_api/guarantee-request.api';

export default function Extension() {
  const router = useRouter();
  const { tenderId, lotId, guaranteeId } = useParams();
  const [trigger, { data }] = useLazyListQuery();

  const config: ExpandableTableConfig = {
    isSearchable: true,
    isExpandable: true,

    columns: [
      {
        accessor: 'vendorName',
        sortable: true,
      },
      {
        accessor: 'organizationName',
        sortable: true,
      },

      { accessor: 'title', title: 'Lot Name', sortable: true },
      {
        accessor: 'name',
        title: 'Procuring Entity ',

        sortable: true,
      },
      {
        accessor: 'type',

        sortable: true,
      },

      {
        accessor: 'status',
        sortable: true,
        width: 150,
        render: ({ status }: any) => (
          <Badge
            color={
              status === 'APPROVED'
                ? 'green'
                : status === 'REQUESTED ' || status === 'DRAFT'
                  ? 'yellow'
                  : 'red'
            }
            variant="light"
            fw={700}
            radius={'sm'}
          >
            {status}
          </Badge>
        ),
      },
      {
        accessor: '',

        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/solicitation/${tenderId}/${lotId}/${guaranteeId}/guarantee-extension/${record?.id}`,
              );
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
      },
    ],
  };
  const onRequestChange = (request: CollectionQuery) => {
    trigger(request);
  };

  return (
    <Section collapsible={false} title="Guarantee Extension">
      <ExpandableTable
        config={config}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
      />
    </Section>
  );
}

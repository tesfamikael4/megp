'use client';

import { ActionIcon, Badge } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useLazyListByIdQuery } from '../_api/guarantee-release.api';
import { CollectionQuery } from '@megp/entity';

export default function GuaranteeRelease() {
  const router = useRouter();
  const { guaranteeId } = useParams();
  const [trigger, { data }] = useLazyListByIdQuery();

  const config: ExpandableTableConfig = {
    isSearchable: true,
    columns: [
      {
        accessor: 'reason',

        width: 200,
      },

      { accessor: 'remark', width: 200 },

      {
        accessor: 'status',
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
              router.push(`/guarantee-release/${guaranteeId}/${record?.id}`);
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
        width: 50,
      },
    ],
  };
  const onRequestChange = (request: CollectionQuery) => {
    trigger({ id: guaranteeId.toString(), collectionQuery: request });
  };

  return (
    <Section collapsible={false} title="Guarantee Release">
      <ExpandableTable
        config={config}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
      />
    </Section>
  );
}

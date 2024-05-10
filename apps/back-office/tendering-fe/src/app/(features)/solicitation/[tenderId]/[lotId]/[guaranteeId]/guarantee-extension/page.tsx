'use client';

import { ActionIcon, Badge, Button } from '@mantine/core';
import { ExpandableTable, Section } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useLazyListByIdQuery } from './_api/guarantee-extension.api';

export default function Extension() {
  const router = useRouter();
  const { tenderId, lotId, guaranteeId } = useParams();
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();

  const config = {
    isSearchable: true,

    isFetching: isFetching,
    columns: [
      {
        accessor: 'noOfDays',
        title: ' Number of Days',
        width: 200,
      },
      {
        accessor: 'reason',
        title: ' Reason',
        width: 200,
      },
      {
        accessor: 'remark',
        title: 'Remark',
        width: 200,
      },

      {
        accessor: 'status',

        width: 150,
        render: ({ status }: any) => (
          <Badge
            color={
              status === 'APPROVED'
                ? 'green'
                : status === 'REJECTED '
                  ? 'red'
                  : 'yellow'
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
        width: 50,
      },
    ],
  };
  const onRequestChange = (request: CollectionQuery) => {
    trigger({ id: guaranteeId.toString(), collectionQuery: request });
  };

  return (
    <Section
      collapsible={false}
      title="Guarantee Extension"
      action={
        <Button
          onClick={() =>
            router.push(
              `/solicitation/${tenderId}/${lotId}/${guaranteeId}/guarantee-extension/new`,
            )
          }
        >
          New
        </Button>
      }
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

'use client';

import { ActionIcon, Badge } from '@mantine/core';
import { ExpandableTable, Section } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useLazyListByIdQuery } from './[guaranteeId]/_api/guarantee-request.api';

export default function Guarantees() {
  const router = useRouter();
  const { tenderId, lotId } = useParams();
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();

  const config = {
    columns: [
      {
        accessor: 'bidderName',
        title: 'Vendor Name',
        width: 200,
      },

      { accessor: 'guarantorName', title: 'Guarantor Name', width: 200 },
      {
        accessor: 'guarantorBranchName',
        title: ' Guarantor Branch Name',
        width: 200,
      },
      {
        accessor: 'type',
        title: 'Type',
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
                `/solicitation/${tenderId}/${lotId}/${record?.id}?tab=extension`,
              );
            }}
          >
            <IconChevronRight size={14} />
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
  const onRequestChange = (request: CollectionQuery) => {
    trigger({
      id: lotId.toString(),
      collectionQuery: {
        ...request,
        where: [
          ...(request?.where ?? []),
          [
            {
              column: 'status',
              operator: '=',
              value: 'APPROVED',
            },
          ],
        ],
      },
    });
  };
  return (
    <>
      <Section title="Guarantees " collapsible={false} className="mt-2">
        <ExpandableTable
          config={config}
          data={data?.items ?? []}
          total={data?.total ?? 0}
          onRequestChange={onRequestChange}
        />
      </Section>
    </>
  );
}

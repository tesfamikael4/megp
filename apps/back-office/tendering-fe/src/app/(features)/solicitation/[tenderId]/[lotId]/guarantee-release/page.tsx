'use client';

import { ActionIcon, Badge } from '@mantine/core';
import { ExpandableTable, Section, logger } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useLazyListByIdQuery } from '../_api/guarantee-request.api';
import { CollectionQuery } from '@megp/entity';

export default function GuaranteeRelease() {
  const router = useRouter();
  const { tenderId, lotId } = useParams();
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();
  logger.log({ data });
  const config = {
    isSearchable: true,
    isExpandable: true,
    isFetching: isFetching,
    columns: [
      {
        accessor: 'bidderName',
        title: 'Vendor Name',
      },

      { accessor: 'guarantorName', title: 'Guarantor Name' },
      {
        accessor: 'guarantorBranchName',
        title: ' Guarantor Branch Name',
      },
      {
        accessor: 'type',
        title: 'Type',
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
                `/solicitation/${tenderId}/${lotId}/guarantee-release/${record?.id}`,
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

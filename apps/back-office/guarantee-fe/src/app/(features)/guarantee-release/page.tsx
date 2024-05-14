'use client';

import { useLazyGetGuaranteesQuery } from '@/store/api/guarantee-request/guarantee-request.api';
import { ActionIcon, Badge } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import { IconChevronRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function GuaranteeRequest() {
  const router = useRouter();
  const [trigger, { data: list }] = useLazyGetGuaranteesQuery();

  const config: ExpandableTableConfig = {
    isSearchable: true,

    columns: [
      {
        accessor: 'bidderName',
        title: 'Customer Name',
        width: 200,
      },

      {
        accessor: 'contactPerson.fullName  ',
        title: 'Contact Full Name',
        width: 200,
        render: (record) => record.contactPerson.fullName,
      },
      {
        accessor: 'contactPerson.email  ',
        title: 'Contact Email',
        width: 200,
        render: (record) => record.contactPerson.email,
      },
      {
        accessor: 'contactPerson.phoneNumber  ',
        title: 'Contact Phone Number',
        width: 200,
        render: (record) => record.contactPerson.phoneNumber,
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
              router.push(`/guarantee-release/${record?.id}`);
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
    trigger({
      ...request,
      where: [
        ...(request?.where ?? []),
        [
          {
            column: 'status',
            operator: '=',
            value: 'REQUESTED',
          },
        ],
      ],
    });
  };

  return (
    <Section collapsible={false} title="Guarantee Request">
      <ExpandableTable
        config={config}
        data={list?.items ?? []}
        total={list?.total.length ?? 0}
        onRequestChange={onRequestChange}
      />
    </Section>
  );
}

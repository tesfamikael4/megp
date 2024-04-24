'use client';

import { ActionIcon, Badge } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import ReleaseDetail from './[id]/page';
import { IconChevronRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function GuaranteeRelease() {
  const router = useRouter();
  // const { data: list } = useListQuery({});
  const data = [
    {
      id: '1f344819-d64d-4986-b192-ee06f5bf0e98',
      organizationName: 'organizationName',
      title: 'title',
      name: 'name',
      type: 'type',
      status: 'Released',
    },
  ];

  const config: ExpandableTableConfig = {
    isSearchable: true,
    isExpandable: true,
    expandedRowContent: (record) => <ReleaseDetail />,

    columns: [
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
              router.push(`/guarantee-release/${record?.id}`);
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
      },
    ],
  };

  return (
    <Section collapsible={false} title="Guarantee Release">
      <ExpandableTable config={config} data={data ?? []} total={data?.length} />
    </Section>
  );
}

'use client';

import { Badge } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';

export default function GuaranteeRelease() {
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
    ],
  };

  return (
    <Section collapsible={false} title="Guarantee Release">
      <ExpandableTable config={config} data={data ?? []} total={data?.length} />
    </Section>
  );
}

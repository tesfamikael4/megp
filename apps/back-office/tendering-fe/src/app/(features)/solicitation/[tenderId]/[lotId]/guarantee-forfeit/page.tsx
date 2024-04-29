'use client';

import { ActionIcon, Badge } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useRouter, useParams } from 'next/navigation';
import { ListData } from '../_components/data';

export default function GuaranteeForfeit() {
  const { tenderId, lotId } = useParams();
  const router = useRouter();
  // const { data: list } = useListQuery({});

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
                `/solicitation/${tenderId}/${lotId}/guarantee-forfeit/${record?.id}`,
              );
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
      },
    ],
  };

  return (
    <Section collapsible={false} title="Guarantee Forfeit">
      <ExpandableTable
        config={config}
        data={ListData ?? []}
        total={ListData?.length}
      />
    </Section>
  );
}

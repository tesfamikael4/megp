'use client';

import { ActionIcon } from '@mantine/core';
import { ExpandableTable, Section } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useLazyListByIdQuery } from '../_api/lot.api';

export default function Lots() {
  const router = useRouter();
  const { tenderId } = useParams();
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();

  const config = {
    columns: [
      { accessor: 'name', title: 'Name', width: 200 },
      { accessor: 'number', title: 'Number', width: 200 },
      { accessor: 'status', title: 'Status', width: 200 },

      {
        accessor: 'id',
        title: '',
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/solicitation/${tenderId}/${record.id}?tab=guarantee`,
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
    trigger({ id: tenderId.toString(), collectionQuery: request });
  };
  return (
    <>
      <Section title="Lots " collapsible={false} className="mt-2">
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

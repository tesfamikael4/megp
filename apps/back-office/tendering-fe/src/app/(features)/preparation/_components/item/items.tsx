'use client';
import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { Section } from '@megp/core-fe';
import { LoadingOverlay, ActionIcon } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

import { useLazyListByIdQuery } from '@/app/(features)/preparation/_api/lot/items.api';
import { useParams, useRouter } from 'next/navigation';
import { CollectionQuery } from '@megp/entity';

export default function ItemList({
  lotId,
}: Readonly<{ lotId: string | null }>) {
  const router = useRouter();
  const { id } = useParams();
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();
  const config = {
    columns: [
      { accessor: 'name', title: 'Name', width: 300 },
      { accessor: 'description', title: 'Description', width: 150 },
      { accessor: 'quantity', title: 'Quantity', width: 150 },
      { accessor: 'unitOfMeasure', title: 'Unit Of Measure', width: 150 },
      {
        accessor: 'procurementCategory',
        title: 'Procurement Category',
        width: 150,
      },
      {
        accessor: 'id',
        title: '',
        render: (pr) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/preparation//${id}/${pr.id}`);
            }}
          >
            <IconChevronRight />
          </ActionIcon>
        ),
        width: 50,
      },
    ],
    isExpandable: false,
    isSearchable: true,
    isLoading: isFetching,
    primaryColumn: 'name',
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({ id: lotId ?? '', collectionQuery: request });
  };

  return (
    <Section title="Items" collapsible={false} defaultCollapsed={false}>
      <LoadingOverlay
        visible={isFetching}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <ExpandableTable
        config={config}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
      />
    </Section>
  );
}

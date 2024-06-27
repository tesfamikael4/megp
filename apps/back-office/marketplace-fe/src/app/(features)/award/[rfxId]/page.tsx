'use client';
import { ActionIcon, Box, Stack } from '@mantine/core';
import { useParams, useRouter } from 'next/navigation';
import { IconChevronRight } from '@tabler/icons-react';
import { ExpandableTable, Section } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import { useLazyListByIdQuery } from '@/app/(features)/rfx/_api/rfx/items.api';
import RfxHeader from '../_components/rfx-header.component';

export default function ItemsList() {
  const [listById, { data: itemsList, isLoading }] = useLazyListByIdQuery();

  const { rfxId } = useParams();
  const router = useRouter();

  const config = {
    columns: [
      { accessor: 'description', title: 'Description' },
      {
        title: 'UoM',
        accessor: 'unitOfMeasure',
        width: 200,
      },
      {
        accessor: 'quantity',
        width: 100,
      },
      {
        accessor: 'procurementCategory',
      },
      {
        accessor: 'id',
        title: '',
        render: (item) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/award/${rfxId}/${item.id}`);
            }}
          >
            <IconChevronRight />
          </ActionIcon>
        ),
        width: 50,
      },
    ],
  };

  const listConfig = {
    ...config,
    isLoading: isLoading,
    isSearchable: true,
    columns: [...config.columns],
  };

  const onRequestChange = (request: CollectionQuery) => {
    listById({
      id: rfxId?.toString() ?? '',
      collectionQuery: request,
    });
  };

  return (
    <Stack>
      <RfxHeader />
      <Section title="Items" collapsible={false}>
        <ExpandableTable
          config={listConfig}
          data={itemsList?.items ?? []}
          total={itemsList?.total ?? 0}
          onRequestChange={onRequestChange}
        />
      </Section>
    </Stack>
  );
}

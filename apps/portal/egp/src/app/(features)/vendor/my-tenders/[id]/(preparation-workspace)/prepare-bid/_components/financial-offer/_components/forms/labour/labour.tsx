'use client';
import { ExpandableTable, Section } from '@megp/core-fe';
import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { CollectionQuery } from '@megp/entity';
import { Item } from '@/models/tender/lot/item';
import { useLazyGetLaborQuery } from '@/app/(features)/vendor/_api/item.api';

export default function Labour({ item }: { item: Item }) {
  const [trigger, { data, isFetching }] = useLazyGetLaborQuery();
  const config = {
    columns: [
      { accessor: 'itemNumber', title: 'Item number', width: 300 },
      {
        accessor: 'description',
        title: 'Description',
        width: 150,
      },
      { accessor: 'unit', title: 'Unit of measure', width: 150 },
      { accessor: 'quantity', title: 'Quantity', width: 150 },
    ],
    isExpandable: true,
    isSearchable: true,
    isLoading: isFetching,
    primaryColumn: 'name',
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({
      itemId: item.id,
      collectionQuery: {
        ...request,
      },
    });
  };

  return (
    <Section
      title="Labour"
      collapsible={true}
      defaultCollapsed={true}
      className="capitalize"
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

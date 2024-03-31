'use client';
import { ExpandableTable, Section } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import { Item } from '@/models/tender/lot/item';
import { useLazyGetEquipmentQuery } from '@/app/(features)/vendor/_api/item.api';
import { NumberInput } from '@mantine/core';

export default function Equipment({ item }: { item: Item }) {
  const [trigger, { data, isFetching }] = useLazyGetEquipmentQuery();
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
      {
        accessor: 'unitRate',
        title: 'Unit Rate',
        render: (record) => (
          <>
            (
            <NumberInput withAsterisk />)
          </>
        ),
        width: 200,
      },
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
      title="Equipment"
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

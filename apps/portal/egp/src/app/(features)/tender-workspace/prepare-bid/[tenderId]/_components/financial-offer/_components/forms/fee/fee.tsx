'use client';
import { ExpandableTable, Section } from '@megp/core-fe';
import type { Fee } from '@/models/tender/lot/item/fee.model';
import { CollectionQuery } from '@megp/entity';
import { Item } from '@/models/tender/lot/item';
import { useLazyGetFeeQuery } from '@/app/(features)/vendor/_api/item.api';
import { NumberInput } from '@mantine/core';

export default function Fee({ item }: { item: Item }) {
  const [trigger, { data, isFetching }] = useLazyGetFeeQuery();
  const config = {
    columns: [
      { accessor: 'category', title: 'Category', width: 300 },
      {
        accessor: 'position',
        title: 'Position',
        width: 150,
      },
      { accessor: 'inputStaffMonth', title: 'Input staff month', width: 150 },
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
      title="Fee"
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

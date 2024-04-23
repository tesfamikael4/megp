'use client';
import { ExpandableTable, Section } from '@megp/core-fe';
import type { ReimburseableExpense } from '@/models/tender/lot/item/reimburseable-expense.model';
import { CollectionQuery } from '@megp/entity';
import type { Item } from '@/models/tender/lot/item';
import { useLazyGetReimbursableExpenseQuery } from '@/app/(features)/vendor/_api/item.api';
import { NumberInput } from '@mantine/core';
export default function ReimburseableExpense({ item }: { item: Item }) {
  const [trigger, { data, isFetching }] = useLazyGetReimbursableExpenseQuery();
  const config = {
    columns: [
      { accessor: 'category', title: 'Category', width: 300 },
      {
        accessor: 'description',
        title: 'Description',
        width: 150,
      },
      { accessor: 'quantity', title: 'Quantity', width: 150 },
      { accessor: 'unit', title: 'Unit of measure', width: 150 },
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
      title="Reimburseable Expense"
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

'use client';
import { ExpandableTable, Section } from '@megp/core-fe';
import { LoadingOverlay, ActionIcon, Button, Box } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CollectionQuery } from '@megp/entity';
import { useLazyItemsQuery } from '@/app/(features)/vendor/_api/item.api';
import BillOfMaterial from './bill-of-material/bill-of-material';
import Labour from './labour/labour';
import Material from './material/material';
import Equipment from './equipment/equipment';
import Fee from './fee/fee';
import ReimburseableExpense from './reimburseable-expense/reimburseable-expense';
import { useEffect } from 'react';

export default function ItemList() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [trigger, { data, isFetching }] = useLazyItemsQuery();
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
    ],
    isExpandable: true,
    isSearchable: true,
    isLoading: isFetching,
    primaryColumn: 'name',
    expandedRowContent: (item) => {
      return (
        <>
          <div className="my-4">
            <BillOfMaterial item={item} />
          </div>
          <div className="my-4">
            <Labour item={item} />
          </div>
          <div className="my-4">
            <Material item={item} />
          </div>
          <div className="my-4">
            <Equipment item={item} />
          </div>
          <div className="my-4">
            <Fee item={item} />
          </div>
          <div className="my-4">
            <ReimburseableExpense item={item} />
          </div>
          <Box className="flex justify-end">
            <Button>
              <IconDeviceFloppy size={14} /> Save Changes
            </Button>
          </Box>
        </>
      );
    },
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({ lotId: searchParams.get('lot') ?? '', collectionQuery: request });
  };
  useEffect(() => {
    trigger({
      lotId: searchParams.get('lot') ?? '',
      collectionQuery: { skip: 0, top: 10 },
    });
  }, [searchParams, trigger]);

  return (
    <Section
      title="Financial Offer"
      collapsible={false}
      defaultCollapsed={false}
    >
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

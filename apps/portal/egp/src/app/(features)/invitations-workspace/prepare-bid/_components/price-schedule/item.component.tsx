'use client';
import React from 'react';
import { ExpandableTable } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import { useParams, useRouter } from 'next/navigation';
import { useLazyGetMyItemsQuery } from '../../../_api/items.api';
import { ActionIcon, LoadingOverlay, Stack } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { DetailTable } from '@/app/(features)/_components/detail-table/detail-table';
import { useLazyGetRfxItemsQuery } from '@/app/(features)/procurement-notice/_api/rfx.api';

export default function Items({
  layout,
  viewMode,
  id,
  mode,
}: {
  layout?: 'partition';
  viewMode?: 'list' | 'detail';
  mode?: 'open' | 'closed';
  id?;
}) {
  const [getMyItems, { data: myItemsList, isLoading: isFetching }] =
    useLazyGetMyItemsQuery();
  const [getRfxItems, { data: itemsList, isLoading }] =
    useLazyGetRfxItemsQuery();
  const router = useRouter();

  const { rfxId } = useParams();

  const config = {
    columns: [
      { accessor: 'name', title: 'Name', width: 300 },
      {
        accessor: 'description',
        title: 'Description',
        hidden: viewMode == 'detail',
        width: 150,
      },
      {
        accessor: 'quantity',
        title: 'Quantity',
        hidden: viewMode == 'detail',
        width: 150,
      },
      {
        accessor: 'unitOfMeasure',
        title: 'Unit Of Measure',
        width: 150,
        hidden: viewMode == 'detail',
      },
      {
        accessor: 'procurementCategory',
        title: 'Procurement Category',
        width: 150,
        hidden: viewMode == 'detail',
      },
      {
        accessor: 'id',
        title: '',
        render: (item) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              if (layout == 'partition') {
                router.push(
                  `/invitations-workspace/prepare-bid/${rfxId}/price-schedule/${item.id}`,
                );
              }
            }}
          >
            <IconChevronRight />
          </ActionIcon>
        ),
        width: 50,
      },
    ],
    isExpandable: true,
    isSearchable: true,
    isLoading: isFetching || isLoading,
    primaryColumn: 'name',
    expandedRowContent: (item) => {
      return <ItemDetail item={item} />;
    },
  };

  const onRequestChange = (request: CollectionQuery) => {
    mode != 'open' &&
      getMyItems({
        id: id ? id : rfxId?.toString() ?? '',
        collectionQuery: request,
      });
    mode == 'open' &&
      getRfxItems({ id: id?.toString() ?? '', collectionQuery: request });
  };

  return (
    <Stack>
      <LoadingOverlay visible={isLoading} />
      <ExpandableTable
        config={config}
        data={(mode == 'open' ? itemsList?.items : myItemsList?.items) ?? []}
        total={(mode == 'open' ? itemsList?.total : myItemsList?.total) ?? []}
        onRequestChange={onRequestChange}
      />
    </Stack>
  );
}

const ItemDetail = (itemList: any) => {
  const item = itemList?.item;
  const ItemConfig = [
    {
      key: 'Description',
      value: item?.description,
    },
    {
      key: 'Item Code',
      value: item?.itemCode,
    },
    {
      key: 'Quantity',
      value: item?.quantity,
    },
    {
      key: 'Unit of measure',
      value: item?.unitOfMeasure,
    },
    {
      key: 'Unit Price',
      value: `${item?.estimatedPriceCurrency} ${item?.estimatedPrice}`,
    },
    {
      key: 'Calculated Amount',
      value: `${(parseInt(item?.estimatedPrice ?? 0) * item?.quantity).toLocaleString('en-US', { style: 'currency', currency: item?.estimatedPriceCurrency ?? 'MKW' })}`,
    },
  ];
  return <DetailTable data={ItemConfig} />;
};

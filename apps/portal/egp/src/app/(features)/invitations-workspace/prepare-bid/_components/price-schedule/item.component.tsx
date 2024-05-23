'use client';
import React from 'react';
import { ExpandableTable } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import { useParams, useRouter } from 'next/navigation';
import { useLazyGetItemsQuery } from '../../../_api/items.api';
import { ActionIcon } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

export default function Items({
  layout,
  viewMode,
  id,
}: {
  layout?: 'partition';
  viewMode?: 'list' | 'detail';
  id?;
}) {
  const [getItems, { data: itemsList, isLoading: isFetching }] =
    useLazyGetItemsQuery();
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
    isLoading: isFetching,
    primaryColumn: 'name',
  };

  const onRequestChange = (request: CollectionQuery) => {
    getItems({
      id: id ? id : rfxId?.toString() ?? '',
      collectionQuery: request,
    });
  };

  return (
    <ExpandableTable
      config={config}
      data={itemsList?.items ?? []}
      total={itemsList?.total}
      onRequestChange={onRequestChange}
    />
  );
}

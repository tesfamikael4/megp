import { CollectionSelector } from '@/app/(features)/_components/collection-selector';
import { CollectionQuery, RelationConfig } from '@megp/entity';
import React from 'react';
import { useLazyListQuery } from '../../_api/tender/config-spd.api';
import { LoadingOverlay } from '@mantine/core';
import { Spd } from '@/models/spd/spd.model';

interface TenderSpdProps {
  onSelect: (data: Spd) => void;
  returnFunction: () => void;
}
export default function TenderSpd({
  onSelect,
  returnFunction,
}: TenderSpdProps) {
  const [trigger, { data, isFetching }] = useLazyListQuery();
  const addConfig: RelationConfig<any> = {
    title: 'Standard Procurement Document',
    columns: [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
        meta: {
          widget: 'expand',
        },
      },
      {
        id: 'marketType',
        header: 'Market Type',
        accessorKey: 'marketType',
        meta: {
          widget: 'expand',
        },
      },
      {
        id: 'isActive',
        header: 'Status',
        accessorKey: 'isActive',
        meta: {
          widget: 'expand',
        },
      },
      {
        id: 'procurementCategory',
        header: 'Procurement Category',
        accessorKey: 'procurementCategory',
        meta: {
          widget: 'expand',
        },
      },
    ],
    searchable: true,
    disableMultiSelect: true,
    selectable: true,
    pagination: true,
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger(request);
  };
  return (
    <>
      <LoadingOverlay visible={isFetching} />
      <CollectionSelector
        config={addConfig}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onDone={(data) => {
          onSelect(data);
          returnFunction();
        }}
        onRequestChange={onRequestChange}
      />
    </>
  );
}

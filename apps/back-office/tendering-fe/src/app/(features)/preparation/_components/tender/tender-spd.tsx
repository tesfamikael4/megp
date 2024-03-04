// import { LoadingOverlay, NativeSelect, Stack, TextInput, Textarea } from '@mantine/core'
import { CollectionSelector } from '@/app/(features)/_components/collection-selector';
import { logger } from '@megp/core-fe';
import { CollectionQuery, RelationConfig } from '@megp/entity';
import React from 'react';
import { useLazyListQuery } from '../../_api/tender/config-spd.api';
import { LoadingOverlay } from '@mantine/core';
import { Spd } from '@/models/spd/spd.model';

interface TenderSpdProps {
  onSelect: (data: Spd) => void;
}
export default function TenderSpd({ onSelect }: TenderSpdProps) {
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
    onSave: (selected) => {
      logger.log(selected[0]);
      //   onDone(selected[0]);
      close();
    },
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
          close();
        }}
        onRequestChange={onRequestChange}
      />
    </>
  );
}

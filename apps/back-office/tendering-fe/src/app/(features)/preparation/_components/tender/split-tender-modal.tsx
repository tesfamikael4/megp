import { CollectionQuery, RelationConfig } from '@megp/entity';
import React from 'react';
import { CollectionSelector } from '@/app/(features)/_components/collection-selector';
import { LoadingOverlay } from '@mantine/core';
import { logger, notify } from '@megp/core-fe';
import {
  useCreateMutation,
  useLazyListByIdQuery,
} from '../../_api/lot/items.api';

interface SplitTenderModalProps {
  lotId: string;
}
export default function SplitTenderModal({ lotId }: SplitTenderModalProps) {
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();
  const addConfig: RelationConfig<any> = {
    title: 'Items List',
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
        id: 'description',
        header: 'Description',
        accessorKey: 'description',
        meta: {
          widget: 'expand',
        },
      },
      {
        id: 'quantity',
        header: 'Quantity',
        accessorKey: 'quantity',
        meta: {
          widget: 'expand',
        },
      },
      {
        id: 'unitOfMeasure',
        header: 'Unit Of Measure',
        accessorKey: 'unitOfMeasure',
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

  const [create, { isLoading: isSaving }] = useCreateMutation();

  const onDone = async (data: any) => {
    if (!data) return;
    if (Array.isArray(data)) {
      logger.log(data);
      try {
        await create({
          itemId: data.map((item) => item.id),
        });
        notify('Success', 'Lot created successfully');
      } catch (err) {
        logger.log(err);
        notify('Error', 'Error in creating lot');
      }
    } else {
      logger.log(data.id);
      try {
        await create({
          itemId: data.id,
        });
        notify('Success', 'Lot created successfully');
      } catch (err) {
        logger.log(err);
        notify('Error', 'Error in creating lot');
      }
    }
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({ id: lotId ?? '', collectionQuery: request });
  };

  return (
    <>
      <LoadingOverlay visible={isFetching || isSaving} />
      <CollectionSelector
        config={addConfig}
        data={data?.items ?? []}
        multiselect
        total={data?.total ?? 0}
        onSelect={(data) => {
          logger.log(data);
        }}
        onDone={(data) => {
          onDone(data);
          close();
        }}
        onRequestChange={onRequestChange}
      />
    </>
  );
}

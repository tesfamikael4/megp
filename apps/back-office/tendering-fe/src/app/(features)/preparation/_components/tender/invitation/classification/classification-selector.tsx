import { CollectionQuery, RelationConfig } from '@megp/entity';
import { useState } from 'react';
import { CollectionSelector } from '@/app/(features)/_components/collection-selector';
import {
  Divider,
  Flex,
  LoadingOverlay,
  Select,
  Button,
  TextInput,
  Box,
} from '@mantine/core';
import { logger, notify } from '@megp/core-fe';
import { useCreateMutation } from '@/app/(features)/preparation/_api/tender/classification.api';
import { useLazyGetClassificationsQuery } from '@/app/(features)/preparation/_api/tender/get-classification.api';
import { useParams } from 'next/navigation';

interface ClassificationSelectorProps {
  closeModal: () => void;
}
export default function ClassificationSelector({
  closeModal,
}: ClassificationSelectorProps) {
  const { id } = useParams();
  const [trigger, { data, isFetching }] = useLazyGetClassificationsQuery();
  const addConfig: RelationConfig<any> = {
    title: 'Items List',
    columns: [
      {
        id: 'code',
        header: 'Code',
        accessorKey: 'code',
        meta: {
          widget: 'expand',
        },
      },
      {
        id: 'definition',
        header: 'Description',
        accessorKey: 'definition',
        meta: {
          widget: 'expand',
        },
      },
    ],
    onSave: (selected) => {
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
    try {
      await create({
        tenderId: id,
        classification: data,
      });
      notify('Success', 'Lot created successfully');
    } catch (err) {
      logger.log(err);
      notify('Error', 'Error in creating lot');
    }
    closeModal();
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({
      where: [
        [
          {
            column: 'parentCode',
            value: 'IsNull',
            operator: 'IsNull',
          },
        ],
      ],
    });
  };

  return (
    <>
      <LoadingOverlay visible={isFetching || isSaving} />
      <CollectionSelector
        config={addConfig}
        data={data?.items ?? []}
        multiSelect
        isForSplitting
        total={data?.total ?? 0}
        onDone={(data) => {
          onDone(data);
        }}
        onRequestChange={onRequestChange}
      />
    </>
  );
}

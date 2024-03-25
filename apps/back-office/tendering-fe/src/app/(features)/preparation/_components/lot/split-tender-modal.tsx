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
import { useCreateMutation } from '../../_api/lot/split-items.api';
import { useLazyListByIdQuery } from '../../_api/lot/items.api';
import { useParams } from 'next/navigation';

interface SplitTenderModalProps {
  lotId: string;
  listOfLots: any[];
  closeModal: () => void;
}
export default function SplitTenderModal({
  lotId,
  listOfLots,
  closeModal,
}: SplitTenderModalProps) {
  const { id } = useParams();
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();
  const [steps, setSteps] = useState<number>(1);
  const [value, setValue] = useState<any | null>(null);
  const [name, setName] = useState<string>('');
  const [selected, setSelected] = useState<any[]>([]);
  const [required, setRequired] = useState<boolean>(false);
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
    if (name === '' && value === null) {
      setRequired(true);
    } else {
      setRequired(false);
      if (value !== null) {
        try {
          await create({
            tenderId: id,
            lotId: value.id,
            itemIds: data.map((item) => item.id),
            name: name,
          });
          notify('Success', 'Lot created successfully');
        } catch (err) {
          logger.log(err);
          notify('Error', 'Error in creating lot');
        }
      } else {
        try {
          await create({
            tenderId: id,
            itemIds: data.map((item) => item.id),
            name: name,
          });
          notify('Success', 'Lot created successfully');
        } catch (err) {
          logger.log(err);
          notify('Error', 'Error in creating lot');
        }
      }
      closeModal();
    }
  };

  const onSelected = (data: any) => {
    setSteps(2);
    setSelected(data);
    logger.log(data);
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({ id: lotId ?? '', collectionQuery: request });
  };

  return (
    <>
      <LoadingOverlay visible={isFetching || isSaving} />
      {steps === 1 && (
        <CollectionSelector
          config={addConfig}
          data={data?.items ?? []}
          multiSelect
          isForSplitting
          total={data?.total ?? 0}
          onDone={(data) => {
            onSelected(data);
          }}
          onRequestChange={onRequestChange}
        />
      )}
      {steps === 2 && (
        <>
          <Box className="flex space-x-4 w-full items-start">
            <Box className="w-1/2">
              <Flex gap={'sm'} direction={'column'}>
                <Box className="font-semibold text-base">
                  Save with a new lot
                </Box>
                <TextInput
                  value={name}
                  placeholder="Lot Name"
                  withAsterisk
                  onChange={(e) => setName(e.target.value)}
                />
                {required && name !== '' && (
                  <span className="text-red-500 text-sm">
                    {' '}
                    Name is required field
                  </span>
                )}
              </Flex>
            </Box>
            <Box className="w-1/2">
              <Flex gap={'sm'} direction={'column'}>
                <Box className="font-semibold text-base">
                  merge in to an existing lot
                </Box>
                <Select
                  placeholder="Select Lot"
                  data={
                    listOfLots
                      ? listOfLots
                          .filter((lot) => lot.id !== lotId)
                          .map((single) => {
                            const value = { ...single };
                            value['label'] = value.name;
                            value['value'] = value.id;
                            return value;
                          })
                      : []
                  }
                  onChange={setValue}
                />
              </Flex>
            </Box>
          </Box>
          <Flex justify={'flex-end'}>
            <Button onClick={() => onDone(selected)}>Done</Button>
          </Flex>
        </>
      )}
    </>
  );
}

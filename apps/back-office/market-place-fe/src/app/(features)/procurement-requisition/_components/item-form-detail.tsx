'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Select,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { logger } from '@megp/core-fe';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { DetailTable } from './detail-table';
import FormBuilder2 from './form-builder-2';
import { IconSearch } from '@tabler/icons-react';

const ItemSchema: ZodType<any> = z.object({
  classification: z.string().min(1, { message: 'Classification is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  currency: z.string(),
  quantity: z.string().min(1, { message: 'Quantity is required' }),
  unitPrice: z.string().min(1, { message: 'Unit Price is required' }),
  itemCode: z.string().min(1, { message: 'Item Code is required' }),
  uom: z.string().min(1, { message: 'Unit of measurement is required' }),
});

export const ItemDetailForm = ({
  item,
  onSave,
  isLoading,
  onDone,
}: {
  item: any;
  isLoading?: boolean;
  onSave?: (data: any, id?: string) => void;
  onDone?: (data: any, id?: string) => void;
}) => {
  // const {
  //   handleSubmit,
  //   formState: { errors },
  //   control,
  //   setValue,
  //   register,
  // } = useForm<any>({
  //   resolver: zodResolver(ItemSchema),
  // });

  const onSubmit = (data) => {
    onSave && onSave(data, item.id);
    onDone && onDone(data, item.id);
  };

  // const onError = (err) => {
  //   logger.log(err);
  // };

  logger.log([item]);

  const itemDetails = [
    {
      key: 'Item Description',
      value: item?.description,
    },
    {
      key: 'Item Code',
      value: item?.itemCode,
    },
    {
      key: 'Classification',
      value: item?.classification,
    },
  ];
  return (
    <Stack className="bg-white p-5" pos="relative">
      <DetailTable data={itemDetails ?? []} />
      <Stack>
        <FormBuilder2 />
      </Stack>
      <Group justify="end">
        <Button
          onClick={() => onSubmit({ test: 'data' })}
          loading={isLoading}
          leftSection={<IconSearch />}
        >
          {onSave ? 'Search for item' : 'Done'}
        </Button>
      </Group>
    </Stack>
  );
};

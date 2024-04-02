'use client';

import { useLazyGetUnitOfMeasurementsQuery } from '@/store/api/administration/administration.api';
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
  disable,
}: {
  item: any;
  isLoading?: boolean;
  onSave?: (data: any, id?: string) => void;
  onDone?: (data: any, id?: string) => void;
  disable?: boolean;
}) => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    register,
  } = useForm<any>({
    resolver: zodResolver(ItemSchema),
  });

  const [getUom, { data: uom, isLoading: isUomLoading }] =
    useLazyGetUnitOfMeasurementsQuery();

  const onSubmit = (data) => {
    onSave && onSave(data, item.id);
    onDone && onDone(data, item.id);
  };

  const onError = (err) => {
    logger.log(err);
  };

  useEffect(() => {
    logger.log('item', item);
    setValue('description', item?.description);
    setValue('quantity', `${item?.quantity}`);
    setValue('unitPrice', `${item?.unitPrice}`);
    setValue('uom', item?.uom);
    setValue('classification', `${item?.classification}`);
    setValue('itemCode', item?.itemCode);
    setValue('currency', item?.currency ? item?.currency : 'USD');

    //get Unit of measurement
    getUom(item?.measurement);
  }, [item]);
  return (
    <Stack className="bg-white p-5" pos="relative">
      <LoadingOverlay visible={isUomLoading} />
      <Flex gap="md">
        <Box className="w-1/2">
          <Textarea
            label="Description"
            disabled
            {...register('description')}
            rows={4}
          />
          <TextInput
            label="Classification"
            {...register('classification')}
            disabled
          />
        </Box>
        <Box className="w-1/2">
          <TextInput
            type="number"
            label="Quantity"
            {...register('quantity')}
            error={
              errors?.quantity ? errors?.quantity?.message?.toString() : ''
            }
            disabled={disable}
          />
          <TextInput
            type="number"
            leftSection={item.currency !== undefined ? item.currency : 'USD'}
            label="Unit Price"
            {...register('unitPrice')}
            error={
              errors?.unitPrice ? errors?.unitPrice?.message?.toString() : ''
            }
            disabled={disable}
          />
          <Controller
            name="uom"
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <Select
                label="Unit of Measurement"
                name={name}
                disabled={disable}
                value={value}
                onChange={onChange}
                data={uom?.items.map((u) => u.abbreviation) ?? []}
                error={errors?.uom ? errors?.uom?.message?.toString() : ''}
              />
            )}
          />
        </Box>
      </Flex>
      <Group justify="end">
        <Button
          onClick={handleSubmit(onSubmit, onError)}
          loading={isLoading}
          disabled={disable}
        >
          {onSave ? 'Save' : 'Done'}
        </Button>
      </Group>
    </Stack>
  );
};

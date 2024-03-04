import {
  LoadingOverlay,
  NativeSelect,
  NumberInput,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  useReadQuery,
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
} from '@/app/(features)/preparation/_api/item/bill-of-material.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { BillOfMaterial } from '@/models/tender/lot/item/bill-of-material.model';

interface FormDetailProps {
  mode: 'new' | 'detail';
  parentId?: string;
  boqId?: string;
}

export function BillOfMaterialFormDetail({
  mode,
  parentId,
  boqId,
}: FormDetailProps) {
  const spdSchema: ZodType<Partial<BillOfMaterial>> = z.object({
    payItem: z.string().min(1, { message: 'This field is required' }),
    description: z.string().min(1, { message: 'This field is required' }),
    unit: z.string().min(1, { message: 'This field is required' }),
    code: z.string().min(1, { message: 'This field is required' }),
    quantity: z.number({ required_error: 'This field is required' }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    control,
  } = useForm({
    resolver: zodResolver(spdSchema),
  });
  const { itemId } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(boqId ?? '');

  useEffect(() => {
    logger.log(errors);
  }, [errors]);

  const onCreate = async (data) => {
    logger.log('here');
    try {
      await create({
        ...data,
        itemId: itemId,
        parentCode: parentId ?? null,
      });
      notify('Success', 'technical scoring created successfully');
    } catch (err) {
      notify('Error', 'Error in creating technical scoring');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: boqId?.toString(),
      });
      notify('Success', 'technical scoring updated successfully');
    } catch {
      notify('Error', 'Error in updating technical scoring');
    }
  };
  const onDelete = async () => {
    try {
      await remove(boqId ?? '');
      notify('Success', 'technical scoring  deleted successfully');
    } catch {
      notify('Error', 'Error in deleting technical scoring');
    }
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        description: selected?.description,
        payItem: selected?.payItem,
        quantity: selected?.quantity,
        code: selected?.code,
        unit: selected?.unit,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />
      <div className="flex space-x-4">
        <TextInput
          label="Pay Item"
          withAsterisk
          className="w-1/2"
          error={errors?.payItem ? errors?.payItem?.message?.toString() : ''}
          {...register('payItem')}
        />
        <TextInput
          label="Code"
          withAsterisk
          className="w-1/2"
          error={errors?.code ? errors?.code?.message?.toString() : ''}
          {...register('code')}
        />
      </div>
      <Textarea
        label="Description"
        withAsterisk
        autosize
        minRows={2}
        error={
          errors?.description ? errors?.description?.message?.toString() : ''
        }
        {...register('description')}
      />
      <div className="flex space-x-4">
        <Controller
          name="quantity"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Quantity"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['quantity']
                  ? errors['quantity']?.message?.toString()
                  : ''
              }
              withAsterisk
            />
          )}
        />
        <TextInput
          label="Unit of measure"
          withAsterisk
          className="w-1/2"
          error={errors?.unit ? errors?.unit?.message?.toString() : ''}
          {...register('unit')}
        />
      </div>
      <EntityButton
        mode={mode}
        data={selected}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        isSaving={isSaving}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    </Stack>
  );
}

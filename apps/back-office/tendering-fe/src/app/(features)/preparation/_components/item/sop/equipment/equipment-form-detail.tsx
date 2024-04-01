import {
  LoadingOverlay,
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
} from '@/app/(features)/preparation/_api/item/equipment.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { DayWork } from '@/models/tender/lot/item/day-work';

interface FormDetailProps {
  mode: 'new' | 'detail';
  equipmentId?: string;
  returnFunction: () => void;
}

export function EquipmentFormDetail({
  mode,
  equipmentId,
  returnFunction,
}: FormDetailProps) {
  const equipmentSchema: ZodType<Partial<DayWork>> = z.object({
    itemNumber: z.string().min(1, { message: 'This field is required' }),
    description: z.string().min(1, { message: 'This field is required' }),
    unit: z.string().min(1, { message: 'This field is required' }),
    quantity: z.number({ required_error: 'This field is required' }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    control,
  } = useForm({
    resolver: zodResolver(equipmentSchema),
  });
  const { itemId } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(equipmentId ?? '');

  useEffect(() => {
    logger.log(errors);
  }, [errors]);

  const onCreate = async (data) => {
    logger.log('here');
    try {
      await create({
        ...data,
        itemId: itemId,
      });
      returnFunction();
      notify('Success', 'equipment created successfully');
    } catch (err) {
      notify('Error', 'Error in creating equipment');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: equipmentId?.toString(),
      });
      returnFunction();
      notify('Success', 'equipment updated successfully');
    } catch {
      notify('Error', 'Error in updating equipment');
    }
  };
  const onDelete = async () => {
    try {
      await remove(equipmentId ?? '');
      returnFunction();
      notify('Success', 'equipment  deleted successfully');
    } catch {
      notify('Error', 'Error in deleting equipment');
    }
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        description: selected?.description,
        itemNumber: selected?.itemNumber,
        quantity: selected?.quantity,
        unit: selected?.unit,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />
      <TextInput
        label="Item Number"
        withAsterisk
        className="w-1/2"
        error={
          errors?.itemNumber ? errors?.itemNumber?.message?.toString() : ''
        }
        {...register('itemNumber')}
      />
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

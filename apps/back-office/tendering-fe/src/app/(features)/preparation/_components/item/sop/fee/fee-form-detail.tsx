import { LoadingOverlay, NumberInput, Stack, TextInput } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  useReadQuery,
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
} from '@/app/(features)/preparation/_api/item/fee.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { Fee } from '@/models/tender/lot/item/fee.model';

interface FormDetailProps {
  mode: 'new' | 'detail';
  feeId?: string;
  returnFunction: () => void;
}

export function FeeFormDetail({
  mode,
  feeId,
  returnFunction,
}: FormDetailProps) {
  const feeSchema: ZodType<Partial<Fee>> = z.object({
    category: z.string().min(1, { message: 'This field is required' }),
    position: z.string().min(1, { message: 'This field is required' }),
    inputStaffMonth: z.number({ required_error: 'This field is required' }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    control,
  } = useForm({
    resolver: zodResolver(feeSchema),
  });
  const { itemId } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(feeId ?? '');

  useEffect(() => {
    logger.log(errors);
  }, [errors]);

  const onCreate = async (data) => {
    logger.log('here');
    try {
      await create({
        ...data,
        itemId: itemId,
        nameOfStaff: '',
      });
      returnFunction();
      notify('Success', 'fee created successfully');
    } catch (err) {
      notify('Error', 'Error in creating fee');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: feeId?.toString(),
      });
      returnFunction();
      notify('Success', 'fee updated successfully');
    } catch {
      notify('Error', 'Error in updating fee');
    }
  };
  const onDelete = async () => {
    try {
      await remove(feeId ?? '');
      returnFunction();
      notify('Success', 'fee  deleted successfully');
    } catch {
      notify('Error', 'Error in deleting fee');
    }
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        category: selected?.category,
        inputStaffMonth: selected?.inputStaffMonth,
        position: selected?.position,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />
      <div className="flex space-x-4">
        <TextInput
          label="Category"
          withAsterisk
          className="w-1/2"
          error={errors?.category ? errors?.category?.message?.toString() : ''}
          {...register('category')}
        />
        <TextInput
          label="Position"
          withAsterisk
          className="w-1/2"
          error={errors?.position ? errors?.position?.message?.toString() : ''}
          {...register('position')}
        />
      </div>
      <Controller
        name="inputStaffMonth"
        control={control}
        render={({ field: { name, value, onChange } }) => (
          <NumberInput
            label="Quantity"
            name={name}
            value={value}
            className="w-1/2"
            onChange={(d) => onChange(parseInt(d as string))}
            error={
              errors['inputStaffMonth']
                ? errors['inputStaffMonth']?.message?.toString()
                : ''
            }
            withAsterisk
          />
        )}
      />
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

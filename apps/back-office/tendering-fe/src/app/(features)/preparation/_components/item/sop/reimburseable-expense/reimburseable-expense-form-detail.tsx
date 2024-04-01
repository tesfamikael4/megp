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
} from '@/app/(features)/preparation/_api/item/reimburseable-expense.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { ReimburseableExpense } from '@/models/tender/lot/item/reimburseable-expense.model';

interface FormDetailProps {
  mode: 'new' | 'detail';
  reimburseableExpenseId?: string;
  returnFunction: () => void;
}

export function ReimburseableExpenseFormDetail({
  mode,
  reimburseableExpenseId,
  returnFunction,
}: FormDetailProps) {
  const reimburseableExpenseSchema: ZodType<Partial<ReimburseableExpense>> =
    z.object({
      itemNumber: z.string().min(1, { message: 'This field is required' }),
      category: z.string().min(1, { message: 'This field is required' }),
      description: z.string().min(1, { message: 'This field is required' }),
      quantity: z.number({ required_error: 'This field is required' }),
      unit: z.string().min(1, { message: 'This field is required' }),
    });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    control,
  } = useForm({
    resolver: zodResolver(reimburseableExpenseSchema),
  });
  const { itemId } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(reimburseableExpenseId ?? '');

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
      notify('Success', 'reimburseable expense created successfully');
      returnFunction();
    } catch (err) {
      notify('Error', 'Error in creating reimburseableExpense');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: reimburseableExpenseId?.toString(),
      });
      returnFunction();
      notify('Success', 'reimburseable expense updated successfully');
    } catch {
      notify('Error', 'Error in updating reimburseableExpense');
    }
  };
  const onDelete = async () => {
    try {
      await remove(reimburseableExpenseId ?? '');
      returnFunction();
      notify('Success', 'reimburseable expense  deleted successfully');
    } catch {
      notify('Error', 'Error in deleting reimburseableExpense');
    }
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        itemNumber: selected?.itemNumber,
        category: selected?.category,
        quantity: selected?.quantity,
        description: selected?.description,
        unit: selected?.unit,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />
      <div className="flex space-x-4">
        <TextInput
          label="Item Number"
          withAsterisk
          className="w-1/2"
          error={
            errors?.itemNumber ? errors?.itemNumber?.message?.toString() : ''
          }
          {...register('itemNumber')}
        />
        <TextInput
          label="Category"
          withAsterisk
          className="w-1/2"
          error={errors?.category ? errors?.category?.message?.toString() : ''}
          {...register('category')}
        />
      </div>
      <div className="flex space-x-4">
        <TextInput
          label="Description"
          withAsterisk
          className="w-1/2"
          error={
            errors?.description ? errors?.description?.message?.toString() : ''
          }
          {...register('description')}
        />
        <TextInput
          label="Unit of measure"
          withAsterisk
          className="w-1/2"
          error={errors?.unit ? errors?.unit?.message?.toString() : ''}
          {...register('unit')}
        />
      </div>
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

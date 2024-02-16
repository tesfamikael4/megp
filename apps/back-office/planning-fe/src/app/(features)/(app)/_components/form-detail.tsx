'use client';

import { AnnualProcurementPlan } from '@/models/annual-procurement-plan';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@mantine/core';
import { TextInput } from '@mantine/core';
import { Stack } from '@mantine/core';
import { logger } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useCreateMutation,
  useDeleteMutation,
  useLazyReadQuery,
  useUpdateMutation,
} from '../../_api/app.api';
import { notifications } from '@mantine/notifications';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const activitiesSchema: ZodType<Partial<AnnualProcurementPlan>> = z.object({
  planName: z.string().min(1, { message: 'Plan Name is required' }),
  budgetYear: z.string().min(1, { message: 'Budget Year is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
});

export const FormDetail = ({ mode }: FormDetailProps) => {
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm<AnnualProcurementPlan>({
    resolver: zodResolver(activitiesSchema),
  });
  const [create, { isLoading: isCreating }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const [read, { data: appData, isSuccess }] = useLazyReadQuery();
  const router = useRouter();
  const { id } = useParams();

  //event handler
  const onCreate = async (data) => {
    try {
      const res = await create(data).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Created successfully',
        color: 'green',
      });
      router.push(`post-budget-plan/${res.id}/activities`);
    } catch (err) {
      logger.log(err);
      notifications.show({
        title: 'Error',
        message: 'Something went happen ',
        color: 'red',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({ id: id, ...data });
      notifications.show({
        title: 'Success',
        message: ' Updated successfully',
        color: 'green',
      });
    } catch (err) {
      logger.log(err);
      notifications.show({
        title: 'Error',
        message: 'Something went happen ',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      await remove(id as string);
      notifications.show({
        title: 'Success',
        message: ' Deleted successfully',
        color: 'green',
      });
      router.push('/app');
    } catch (err) {
      logger.log(err);
      notifications.show({
        title: 'Error',
        message: 'Something went happen ',
        color: 'red',
      });
    }
  };

  const onReset = () => {
    reset({
      planName: '',
      budgetYear: '',
      description: '',
      status: '',
    });
  };

  //use Effect
  useEffect(() => {
    mode === 'detail' && read(id as string);
  }, [id, mode, read]);

  useEffect(() => {
    if (mode === 'detail' && isSuccess) {
      reset({
        planName: appData.planName,
        budgetYear: appData.budgetYear,
        description: appData.description,
      });
    }
  }, [appData, isSuccess, mode, reset]);
  return (
    <Stack>
      <TextInput
        label="Plan Name"
        {...register('planName')}
        withAsterisk
        error={errors?.planName?.message}
      />
      <TextInput
        label="Budget Year"
        {...register('budgetYear')}
        withAsterisk
        error={errors?.budgetYear?.message}
      />
      <Textarea
        label="Description"
        {...register('description')}
        withAsterisk
        error={errors?.description?.message}
      />

      <EntityButton
        isSaving={isCreating}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        mode={mode}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        onReset={onReset}
      />
    </Stack>
  );
};

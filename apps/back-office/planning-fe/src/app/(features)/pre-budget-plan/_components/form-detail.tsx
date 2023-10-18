import { Select, Stack, TextInput, Textarea } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import {
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
  useReadQuery,
} from '../_api/pre-budget-plan.api';
import { PreBudgetPlan } from '@/models/pre-budget-plan';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useListQuery as useInitiationListQuery } from '../../initiation/_api/initiation.api';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  procurementReference: '',
  planInitiationId: '',
  remark: '',
  description: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const preBudgetPlanSchema: ZodType<Partial<PreBudgetPlan>> = z.object({
    procurementReference: z
      .string()
      .min(1, { message: 'This field is required' }),
    planInitiationId: z.string().min(1, { message: 'This field is required' }),
    remark: z.string().min(1, { message: 'This field is required' }),
    description: z.string().min(1, { message: 'This field is required' }),
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
    register,
  } = useForm<PreBudgetPlan>({
    resolver: zodResolver(preBudgetPlanSchema),
    defaultValues,
  });

  const router = useRouter();
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const { data: selected, isSuccess: selectedSuccess } = useReadQuery(
    id?.toString(),
  );
  const { data: planInitiation } = useInitiationListQuery();

  const onCreate = async (data) => {
    try {
      const result = await create(data);
      if ('data' in result) {
        router.push(`/pre-budget-plan/${result.data.id}`);
      }
      notifications.show({
        message: 'Prebudget plan created successfully',
        title: 'Success',
      });
    } catch (err) {
      notifications.show({
        message: 'error in creating prebudget plan',
        title: 'Success',
        color: 'red',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: id?.toString(),
      });
      notifications.show({
        message: 'Prebudget plan updated successfully',
        title: 'Success',
      });
    } catch {
      notifications.show({
        message: 'error in updating prebudget plan',
        title: 'Success',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notifications.show({
        message: 'Prebudget plan deleted successfully',
        title: 'Success',
      });
      router.push('/pre-budget-plan');
    } catch {
      notifications.show({
        message: 'error in deleting prebudget plan',
        title: 'Success',
        color: 'red',
      });
    }
  };
  const onReset = async () => {
    reset({ ...defaultValues });
  };
  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        procurementReference: selected?.procurementReference,
        description: selected?.description,
        remark: selected?.remark,
      });
      setValue('planInitiationId', selected?.planInitiationId);
    }
  }, [mode, reset, selected, selectedSuccess, setValue]);

  return (
    <Stack>
      <Controller
        name="planInitiationId"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            withAsterisk
            label="Plan Initiation"
            required
            error={
              errors?.planInitiationId
                ? errors?.planInitiationId?.message?.toString()
                : ''
            }
            value={value}
            onChange={onChange}
            data={
              planInitiation?.items?.map((type) => ({
                value: type?.id,
                label: type?.planName,
              })) || []
            }
          />
        )}
      />
      <TextInput
        withAsterisk
        label="Procurement Reference "
        error={
          errors?.procurementReference
            ? errors?.procurementReference?.message?.toString()
            : ''
        }
        required
        {...register('procurementReference')}
      />
      <Textarea
        label="Description"
        autosize
        minRows={2}
        withAsterisk
        error={
          errors?.description ? errors?.description?.message?.toString() : ''
        }
        {...register('description')}
      />
      <Textarea
        label="Remark"
        autosize
        minRows={2}
        withAsterisk
        error={errors?.remark ? errors?.remark?.message?.toString() : ''}
        {...register('remark')}
      />

      <EntityButton
        mode={mode}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        onReset={onReset}
        isSaving={isSaving}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    </Stack>
  );
}

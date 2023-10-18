import { Select, Stack, TextInput, Textarea } from '@mantine/core';
import { EntityButton } from '@megp/entity';

import { Controller, useForm } from 'react-hook-form';
import {
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
  useReadQuery,
} from '../_api/initiation.api';
import { Initiation } from '@/models/initiation';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  planName: '',
  budgetYearId: '',
  budgetYear: '',
  description: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const initiationSchema: ZodType<Partial<Initiation>> = z.object({
    organizationId: z.string().min(1, { message: 'This field is required' }),
    organizationName: z.string().min(1, { message: 'This field is required' }),
    planName: z.string().min(1, { message: 'This field is required' }),
    budgetYearId: z.string().min(1, { message: 'This field is required' }),
    budgetYear: z.string().min(1, { message: 'This field is required' }),
    description: z.string().min(1, { message: 'This field is required' }),
    initiatorName: z.string().min(1, { message: 'This field is required' }),
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
    setValue,
  } = useForm<Initiation>({
    resolver: zodResolver(initiationSchema),
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

  const budgetYear = [
    {
      id: 'd9101fd6-6372-11ee-8c99-0242ac120002',
      code: 'FY-M-2023',
      fiscalYear: '2023',
      starts: '2023-1-1',
      ends: '2023-12-30',
    },
  ];

  const onCreate = async (data) => {
    try {
      const result = await create(data);
      if ('data' in result) {
        router.push(`/initiation/${result.data.id}`);
      }
      notifications.show({
        message: 'Plan initiation created successfully',
        title: 'Success',
      });
    } catch (err) {
      notifications.show({
        message: 'error in creating plan initiation',
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
        message: 'Plan initiation updated successfully',
        title: 'Success',
      });
    } catch {
      notifications.show({
        message: 'error in updating plan initation',
        title: 'Success',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notifications.show({
        message: 'Plan initiation deleted successfully',
        title: 'Success',
      });
      router.push('/initiation');
    } catch {
      notifications.show({
        message: 'error in deleting plan initiation',
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
        planName: selected?.planName,
        budgetYear: JSON.stringify({
          id: selected?.budgetYear?.id,
          code: selected?.budgetYear?.code,
          fiscalYear: selected?.budgetYear?.fiscalYear,
          starts: selected?.budgetYear?.starts,
          ends: selected?.budgetYear?.ends,
        }),

        description: selected?.description,
        budgetYearId: selected?.budgetYearId,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  useEffect(() => {
    setValue('organizationId', '4b51fc96-6372-11ee-8c99-0242ac120002');
    setValue('organizationName', 'Ministery Office');
    setValue('budgetYearId', 'd9101fd6-6372-11ee-8c99-0242ac120002');
    setValue('budgetYear', budgetYear.toString());
    setValue('initiatorName', 'Fikremariam M');
  });

  return (
    <Stack>
      <TextInput
        withAsterisk
        label="Plan Name"
        error={errors?.planName ? errors?.planName?.message?.toString() : ''}
        required
        {...register('planName')}
      />

      <Textarea
        label="Description"
        autosize
        minRows={2}
        {...register('description')}
      />
      <Controller
        name="budgetYearId"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            withAsterisk
            label="Budget Year"
            error={
              errors?.budgetYearId
                ? errors?.budgetYearId?.message?.toString()
                : ''
            }
            value={value}
            onChange={onChange}
            data={
              budgetYear?.map((type) => ({
                value: type?.id,
                label: type?.code,
              })) || []
            }
          />
        )}
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

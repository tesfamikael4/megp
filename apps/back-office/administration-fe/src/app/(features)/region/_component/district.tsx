import { LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useForm } from 'react-hook-form';
import {
  useCreateMutation,
  useLazyReadQuery,
  useUpdateMutation,
} from '../_api/district.api';
import { District } from '@/models/district';

interface FormDetailProps {
  mode: 'new' | 'detail';
  handleCloseModal: () => void;
  districtId: string;
}

const defaultValues = {
  name: '',
};

export function DistrictForm({
  mode,
  handleCloseModal,
  districtId,
}: FormDetailProps) {
  const measurementSchema: ZodType<Partial<District>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },

    register,
  } = useForm({
    resolver: zodResolver(measurementSchema),
  });
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [getDistrict, { data: distric, isSuccess, isLoading }] =
    useLazyReadQuery();

  const onCreate = async (data) => {
    try {
      const result = await create({
        ...data,
        regionId: id?.toString(),
      });
      if ('data' in result) {
        handleCloseModal();
      }
      notifications.show({
        message: 'District created successfully',
        title: 'Success',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        color: 'red',
        message: 'errors in creating district.',
        title: 'Error',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({ ...distric, ...data }).unwrap();
      handleCloseModal();
      notifications.show({
        message: 'District updated successfully',
        title: 'Success',
        color: 'green',
      });
    } catch {
      notifications.show({
        message: 'errors in updating district.',
        title: 'Error',
        color: 'red',
      });
    }
  };

  const onReset = async () => {
    reset({ ...defaultValues });
  };

  useEffect(() => {
    if (mode == 'detail') {
      getDistrict(districtId);
    }
  }, [districtId, getDistrict, mode]);

  useEffect(() => {
    if (isSuccess) {
      reset({
        name: distric?.name,
      });
    }
  }, [distric, isSuccess, reset]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <TextInput
        withAsterisk
        label="Name"
        {...register('name')}
        error={errors?.name ? errors?.name?.message?.toString() : ''}
        required
      />
      <EntityButton
        mode={mode}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onCancel={handleCloseModal}
        onReset={onReset}
        isSaving={isSaving}
        isUpdating={isUpdating}
      />
    </Stack>
  );
}

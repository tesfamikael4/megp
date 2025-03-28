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
  const districtSchema: ZodType<Partial<District>> = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },

    register,
  } = useForm({
    resolver: zodResolver(districtSchema),
  });
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [getDistrict, { data: distric, isSuccess, isLoading }] =
    useLazyReadQuery();

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        regionId: id?.toString(),
      }).unwrap();
      notifications.show({
        message: 'District created successfully',
        title: 'Success',
        color: 'green',
      });
      handleCloseModal();
    } catch (err) {
      let errorMessage = 'Error occurred while creating District';

      // Handle other specific error messages
      if (err?.data?.message) {
        errorMessage = err.data.message;
      }

      notifications.show({
        message: errorMessage,
        title: 'Error',
        color: 'red',
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
        message: 'Errors in updating district.',
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
    if (mode == 'detail' && isSuccess && distric !== undefined) {
      reset({
        name: distric?.name,
      });
    }
  }, [mode, distric, isSuccess, reset]);

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

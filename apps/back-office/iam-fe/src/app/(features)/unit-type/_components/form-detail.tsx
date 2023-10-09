import { Box, LoadingOverlay, Stack, TextInput, Textarea } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UnitType } from '@/models/unit-type';
import {
  useReadQuery,
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
} from '../_api/unitType.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useForm } from 'react-hook-form';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  name: '',
  description: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const unitTypeSchema: ZodType<Partial<UnitType>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    description: z.string().min(1, { message: 'This field is required' }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(unitTypeSchema),
  });
  const router = useRouter();
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const onCreate = async (data) => {
    try {
      const result = await create({
        ...data,
        organizationId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
      });
      if ('data' in result) {
        router.push(`/unit-type/${result?.data?.id}`);
      }
      notifications.show({
        message: 'unit Type created successfully',
        title: 'Success',
      });
    } catch (err) {
      notifications.show({
        message: 'errors in deleting unit Type.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: id?.toString(),
        organizationId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
      });
      notifications.show({
        message: 'unit Type updated successfully',
        title: 'Success',
      });
    } catch {
      notifications.show({
        message: 'errors in updating unit Type.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString()).unwrap();
      notifications.show({
        message: 'unit Type deleted successfully',
        title: 'Success',
      });
      router.push('/unit-type');
    } catch (err) {
      notifications.show({
        message: 'errors in deleting unit Type.',
        title: 'Error',
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
        name: selected?.name,
        code: selected?.code,
        shortName: selected?.shortName,
        description: selected?.description,
        typeId: selected?.typeId,
        sectorId: selected?.sectorId,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack>
      <Box pos={'relative'}>
        <LoadingOverlay visible={isLoading} />
        <TextInput
          withAsterisk
          label="Name"
          {...register('name')}
          error={errors?.name ? errors?.name?.message?.toString() : ''}
          required
        />

        <Textarea
          label="Description"
          autosize
          minRows={2}
          {...register('description')}
          error={
            errors?.description ? errors?.description?.message?.toString() : ''
          }
        />
      </Box>
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

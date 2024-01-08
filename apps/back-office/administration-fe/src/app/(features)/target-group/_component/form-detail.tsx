import { LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useForm } from 'react-hook-form';
import { TargetGroup } from '@/models/target-group';
import {
  useCreateMutation,
  useDeleteMutation,
  useReadQuery,
  useUpdateMutation,
} from '../_api/target-group.api';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  name: '',
  description: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const targetGroupSchema: ZodType<Partial<TargetGroup>> = z.object({
    name: z
      .string()
      .min(1, { message: 'This field is required' })
      .transform((str) => str.toLowerCase()),
    description: z
      .string()
      .optional()
      .transform((str) => (str ? str.toLowerCase() : str)),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },

    register,
  } = useForm({
    resolver: zodResolver(targetGroupSchema),
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
    const transformedData = {
      ...data,
      name: data.name.toLowerCase(),
      description: data.description?.toLowerCase(),
    };

    try {
      const result = await create(transformedData).unwrap();

      // Check if the result has a message indicating that the target group already exists
      if (result && result.message === 'Target Group already exist.') {
        notifications.show({
          message: result.message,
          title: 'Error',
          color: 'red',
        });
      } else {
        notifications.show({
          message: 'Target Group Created Successfully',
          title: 'Success',
          color: 'green',
        });
        router.push(`/target-group/${result.id}`);
      }
    } catch (error) {
      // Handle other types of errors
      let errorMessage = 'Unknown error occurred';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
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
      await update({ ...data, id: id?.toString() });
      notifications.show({
        message: 'Target Group Updated Successfully',
        title: 'Success',
        color: 'green',
      });
    } catch {
      notifications.show({
        message: 'Error in Updating Target Group.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString()).unwrap();
      notifications.show({
        message: 'Target Group Deleted Successfully',
        title: 'Success',
        color: 'green',
      });
      router.push('/target-group');
    } catch (err) {
      notifications.show({
        message: 'Errors in Deleting Target-group.',
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
        description: selected?.description,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <TextInput
        withAsterisk
        label="Name"
        {...register('name')}
        error={errors?.name ? errors?.name?.message?.toString() : ''}
        required
      />{' '}
      <TextInput
        // withAsterisk
        label="Description"
        {...register('description')}
        error={
          errors?.description ? errors?.description?.message?.toString() : ''
        }
        // required
      />{' '}
      <EntityButton
        mode={mode}
        // data={selected}
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

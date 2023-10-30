import {
  Flex,
  LoadingOverlay,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  useUpdateMutation,
  useReadQuery,
  useCreateMutation,
} from '../_api/permission.api';
import { useReadQuery as useReadAppQuery } from '../_api/application.api';
import { useEffect } from 'react';

import { notifications } from '@mantine/notifications';
import { useForm } from 'react-hook-form';
import { Permission } from '@/models/permission';
import { useParams } from 'next/navigation';

interface FormDetailProps {
  mode: 'new' | 'detail';
  handleCloseModal: () => void;
  unitId: string;
}

const defaultValues = {
  name: '',
  description: '',
  key: '',
};

export function PermissionForm({
  mode,
  handleCloseModal,
  unitId,
}: FormDetailProps) {
  const permissionSchema: ZodType<Partial<Permission>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    description: z.string(),
    key: z.string().min(1, { message: 'This field is required' }),
  });

  const { id } = useParams();

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(permissionSchema),
  });

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(unitId);

  const { data: selectedApp } = useReadAppQuery(id?.toString());

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        applicationId: id?.toString(),
        applicationName: selectedApp?.name,
        applicationKey: selectedApp?.key,
      });

      notifications.show({
        message: 'permission created successfully',
        title: 'Success',
        color: 'green',
      });
      handleCloseModal();
    } catch (err) {
      notifications.show({
        message: 'errors in creating permission.',
        title: 'Error',
        color: 'red',
      });
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: unitId,
        applicationId: id?.toString(),
        applicationName: selectedApp?.name,
        applicationKey: selectedApp?.key,
      });
      notifications.show({
        message: 'Permission updated successfully',
        title: 'Success',
        color: 'green',
      });
      handleCloseModal();
    } catch {
      notifications.show({
        message: 'Errors in updating permission.',
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
        key: selected?.key,
        description: selected?.description,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos={'relative'}>
      <LoadingOverlay visible={isLoading} />
      <TextInput
        withAsterisk
        label="Name"
        {...register('name')}
        error={errors?.name ? errors?.name?.message?.toString() : ''}
        required
      />
      <TextInput
        withAsterisk
        label="Key"
        {...register('key')}
        error={errors?.key ? errors?.key?.message?.toString() : ''}
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
      <Flex gap="md" justify="flex-start" align="flex-start" direction="row">
        <EntityButton
          mode={mode}
          onCreate={handleSubmit(onCreate)}
          onUpdate={handleSubmit(onUpdate)}
          onCancel={handleCloseModal}
          onReset={onReset}
          isSaving={isSaving}
          isUpdating={isUpdating}
        />
      </Flex>
    </Stack>
  );
}

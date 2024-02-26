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
  useListByAppIdQuery,
} from '../_api/permission.api';
import { useReadQuery as useReadAppQuery } from '../_api/application.api';
import { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { Permission } from '@/models/permission';
import { useParams } from 'next/navigation';
import { notify } from '@megp/core-fe';

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
      }).unwrap();

      notify('Success', 'Permission created successfully');
      handleCloseModal();
    } catch (err) {
      notify('Error', 'Errors in creating permission.');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: unitId,
      }).unwrap();

      notify('Success', 'Permission updated successfully');
      handleCloseModal();
    } catch {
      notify('Error', 'Errors in updating permission.');
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
      {mode === 'detail' && <LoadingOverlay visible={isLoading} />}

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

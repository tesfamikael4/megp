import { Stack, TextInput } from '@mantine/core';
import { EntityButton } from '@megp/entity';

import { useForm } from 'react-hook-form';
import {
  useUpdateMutation,
  useCreateMutation,
  useReadQuery,
} from '../_api/taxonomy.api';
import { useParams, useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { Taxonomy } from '@/models/taxonomy';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import DataImport from './data-import';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  name: '',
  version: '',
  upload: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const taxonomySchema: ZodType<Partial<Taxonomy>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    version: z.string().min(1, { message: 'This field is required' }),
    upload: z.string().min(1, { message: 'This field is required' }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm<Taxonomy>({
    resolver: zodResolver(taxonomySchema),
    defaultValues,
  });

  const router = useRouter();
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const { data: selected, isSuccess: selectedSuccess } = useReadQuery(
    id?.toString(),
  );

  const onCreate = async (data) => {
    try {
      const result = await create(data);
      if ('data' in result) {
        router.push(`/taxonomy/${result.data.id}`);
      }
      notifications.show({
        message: 'Taxonomy created successfully',
        title: 'Success',
      });
    } catch (err) {
      notifications.show({
        message: 'error in creating taxonomy',
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
        message: 'Taxonomy updated successfully',
        title: 'Success',
      });
    } catch {
      notifications.show({
        message: 'error in updating taxonomy',
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
        name: selected?.name,
        version: selected?.version,
        upload: selected?.upload,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack>
      <TextInput
        withAsterisk
        label="Name"
        error={errors?.name ? errors?.name?.message?.toString() : ''}
        required
        {...register('name')}
      />
      <TextInput
        withAsterisk
        label="Version"
        error={errors?.version ? errors?.version?.message?.toString() : ''}
        required
        {...register('version')}
      />
      <DataImport />

      <EntityButton
        mode={mode}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onReset={onReset}
        isSaving={isSaving}
        isUpdating={isUpdating}
      />
    </Stack>
  );
}

import { LoadingOverlay, Stack, TextInput, Textarea } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { OrganizationSector } from '@/models/organization-sector';
import {
  useReadQuery,
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
} from '../_api/organization-sector.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { notify } from '@megp/core-fe';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  name: '',
  description: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const organizationSectorSchema: ZodType<Partial<OrganizationSector>> =
    z.object({
      name: z.string().min(1, { message: 'This field is required' }),
      description: z.string().min(1, { message: 'This field is required' }),
    });

  const {
    handleSubmit,
    reset,
    formState: { errors },

    register,
  } = useForm({
    resolver: zodResolver(organizationSectorSchema),
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
      const result = await create(data);
      if ('data' in result) {
        router.push(`/organization-sector/${result?.data?.id}`);
      }
      notify('Success', 'Organization Sector created successfully');
    } catch (err) {
      notify('Error', 'Errors in deleting organization Sector.');
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString() }).unwrap();
      notify('Success', 'Organization Sector updated successfully');
    } catch {
      notify('Error', 'Errors in updating organization Sector.');
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString()).unwrap();
      notify('Success', 'Organization Sector deleted successfully');

      router.push('/organization-sector');
    } catch (err) {
      notify('Error', 'Errors in deleting organization Sector.');
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

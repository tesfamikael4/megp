import { Select, Stack, TextInput, Textarea } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  useReadQuery,
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
} from '../_api/organization.api';
import { useListQuery } from '../../organization-sector/_api/organizationSector.api';
import { useLazyListQuery } from '../../organization-type/_api/organizationType.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { Organization } from '@/models/organization';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  name: '',
  typeId: null,
  sectorId: null,
  shortName: '',
  description: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const organizationSchema: ZodType<Partial<Organization>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    typeId: z.string({
      required_error: 'This field is required',
      invalid_type_error: 'This field is required to be a string',
    }),
    code: z.string().optional(),
    sectorId: z.string({
      required_error: 'This field is required',
      invalid_type_error: 'This field is required to be a string',
    }),
    shortName: z.string().min(1, { message: 'This field is required' }),
    description: z.string().optional(),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
  } = useForm({
    resolver: zodResolver(organizationSchema),
  });
  const router = useRouter();
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const { data: selected, isSuccess: selectedSuccess } = useReadQuery(
    id?.toString(),
  );
  const { data: sector } = useListQuery();

  const [triggerOrgType, { data: orgType }] = useLazyListQuery();

  const onCreate = async (data) => {
    try {
      const result = await create(data);
      if ('data' in result) {
        router.push(`/organizations/${result.data.id}`);
      }
      notifications.show({
        message: 'organization created successfully',
        title: 'Success',
      });
    } catch (err) {
      notifications.show({
        message: 'error in creating organization',
        title: 'Success',
        color: 'red',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString() });
      notifications.show({
        message: 'organization updated successfully',
        title: 'Success',
      });
    } catch {
      notifications.show({
        message: 'error in updating organization',
        title: 'Success',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notifications.show({
        message: 'organization  deleted successfully',
        title: 'Success',
      });
      router.push('/organizations');
    } catch {
      notifications.show({
        message: 'error in deleting organization',
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
        code: selected?.code,
        shortName: selected?.shortName,
        description: selected?.description,
        typeId: selected?.typeId,
        sectorId: selected?.sectorId,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  useEffect(() => {
    triggerOrgType();
  }, [triggerOrgType]);

  return (
    <Stack>
      <TextInput
        withAsterisk
        label="Name"
        error={errors?.name ? errors?.name?.message?.toString() : ''}
        {...register('name')}
      />
      <TextInput
        withAsterisk
        label="Short name"
        error={errors?.shortName ? errors?.shortName?.message?.toString() : ''}
        required
        {...register('shortName')}
      />

      <Textarea
        label="Description"
        autosize
        minRows={2}
        {...register('description')}
      />

      <Controller
        name="typeId"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            name="name"
            label="Organization Type"
            value={value}
            withAsterisk
            error={errors?.typeId ? errors?.typeId?.message?.toString() : ''}
            onChange={onChange}
            data={
              orgType?.items?.map((type) => ({
                value: type?.id,
                label: type?.name,
              })) || []
            }
          />
        )}
      />
      <Controller
        name="sectorId"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            withAsterisk
            name="name"
            error={
              errors?.sectorId ? errors?.sectorId?.message?.toString() : ''
            }
            label="Organization Sector"
            value={value}
            onChange={onChange}
            data={
              sector?.items?.map((type) => ({
                value: type?.id,
                label: type?.name,
              })) || []
            }
          />
        )}
      />
      <TextInput
        label={'External Organization Code'}
        disabled
        {...register('code')}
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
